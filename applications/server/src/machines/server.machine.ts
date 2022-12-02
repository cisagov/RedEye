import 'reflect-metadata';
import { existsSync } from 'fs';
import { rmSync } from 'fs-extra';
import path from 'path';
import { createMachine, interpret, actions, spawn, StateMachine } from 'xstate';
import { ParsingProgress } from '@redeye/models';
import { getDbPath } from '../util';

// Services
import { importLocalCampaignsDatabasesService } from './importLocalCampaigns.service';
import { startHttpServerService, startBlueTeamHttpServerService } from './http.service';
import { connectOrCreateDatabase } from './maindb.service';
// External Machines
import { messengerMachine, SpawnedMessengerMachine } from './messenger.machine';
// Types
import type { Server } from 'http';
import { EntityCacheManager } from '../cache';
import type { cliArgs } from '..';
import { createConfig, ConfigDefinition } from '../config';

export type ServerMachineContext = {
	cm: EntityCacheManager;
	cliArgs: cliArgs;
	server: Server;
	parsingProgress: ParsingProgress;
	config: ConfigDefinition;
	messagingService: SpawnedMessengerMachine;
};

type ServerMachineEvents = { type: 'KILL_SERVICE' };

const serverMachine = createMachine(
	{
		tsTypes: {} as import('./server.machine.typegen').Typegen0,
		schema: {
			context: {} as ServerMachineContext,
			events: {} as ServerMachineEvents,
			services: {} as {
				createCacheService: { data: EntityCacheManager };
				startHttpServerService: { data: void };
				startBlueTeamHttpServerService: { data: void };
			},
		},
		id: 'SERVER_MACHINE',
		initial: 'loadDatabase',
		states: {
			loadDatabase: {
				invoke: {
					src: 'createCacheService',
					onDone: [
						{
							target: 'moveBlueTeamDatabases',
							cond: 'isBlueTeam',
							actions: ['assignCacheManager', 'spawnMessagingService'],
						},
						{
							target: 'initializeHTTPServer',
							actions: ['assignCacheManager', 'spawnMessagingService'],
						},
					],
					onError: 'critical_failure',
				},
			},
			moveBlueTeamDatabases: {
				invoke: {
					src: 'importLocalCampaignsDatabasesService',
					onDone: 'initializeBlueHTTPServerService',
				},
			},
			initializeHTTPServer: {
				invoke: {
					src: 'startHttpServerService',
					onDone: { target: 'ready' },
					onError: 'critical_failure',
				},
			},
			initializeBlueHTTPServerService: {
				invoke: {
					src: 'startBlueTeamHttpServerService',
					onDone: 'frozen',
					onError: 'critical_failure',
				},
			},
			ready: {},
			// Prevent all parsing by going to a frozen state
			frozen: {},
			critical_failure: {
				entry: 'cleanUp',
			},
		},
		on: {
			KILL_SERVICE: {
				actions: 'cleanUp',
			},
		},
	},
	{
		guards: {
			isBlueTeam: (ctx) => ctx.config.blueTeam,
		},
		actions: {
			assignCacheManager: actions.assign((_ctx, event) => ({
				cm: event.data,
			})),
			cleanUp: (ctx) => {
				try {
					// Cleanup anonymized campaigns
					let anonymizedPath = path.join(getDbPath(ctx.config.databaseMode), 'anonymized-campaigns');
					if (existsSync(anonymizedPath)) rmSync(anonymizedPath, { recursive: true });
					ctx.messagingService?.stop?.();
					ctx.server.close((err) => {
						if (err) console.error('HTTP server closed', err);
						else console.info('HTTP server closed');
						process.exit();
					});
				} catch (err) {
					console.error('HTTP server closed', err);
					process.exit();
				}
			},
			spawnMessagingService: actions.assign((ctx) => {
				const messagingService = spawn(
					messengerMachine.withContext({
						config: ctx.config,
						// @ts-expect-error parsing machine is initialized upon entry
						parsingMachine: null,
					})
				);
				return { messagingService };
			}),
		},
		services: {
			createCacheService: async (ctx): Promise<EntityCacheManager> => {
				try {
					const mainOrm = await connectOrCreateDatabase(ctx.config);
					const cacheManager = new EntityCacheManager(mainOrm);
					return cacheManager;
				} catch {
					return Promise.reject();
				}
			},
			importLocalCampaignsDatabasesService,
			startHttpServerService,
			startBlueTeamHttpServerService,
		},
	}
);

export const startServerService = (cliArgs: cliArgs) => {
	const config = createConfig(cliArgs);
	const service = interpret(
		serverMachine.withContext({
			projectDatabases: {},
			parsingProgress: new ParsingProgress(),
			cliArgs,
			config,
			// @ts-expect-error: database is defined almost immediately, there should be another layer of abstraction in future though
			cm: null,
		}) as unknown as StateMachine<any, any, any>
	);
	service.start();
	return service;
};

import { actions, createMachine } from 'xstate';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { DatabaseMachineContext } from '../shared/database.machine';
import { databaseMachine } from '../shared/database.machine';
import type { ParsingOrchestratorMachineContext } from './parsingOrchestrator.machine';
import { parsingOrchestratorMachine } from './parsingOrchestrator.machine';
import type { LoggerInstance } from '../shared/logging';
import { logEntryState, logFinalState, logTransition } from '../shared/logging';
import { closeOrm } from '../shared/closeOrm.service';

type BeaconParsingOrchestratorContext = {
	databasePath: string;
	beaconId: UUID;
	orm?: MikroORM<BetterSqliteDriver>;
	logger: LoggerInstance;
};

export const mainBeaconMachine = createMachine(
	{
		id: 'MAIN_BEACON_MACHINE',
		tsTypes: {} as import('./main.machine.typegen').Typegen0,
		schema: {
			context: {} as BeaconParsingOrchestratorContext,
			services: {} as {
				databaseMachine: {
					data: {
						orm: MikroORM<BetterSqliteDriver>;
						connection: {
							orm: MikroORM<BetterSqliteDriver>;
						};
					};
				};
				closeOrm: { data: void };
			},
		},
		initial: 'connectingDb',
		entry: 'logEntryState',
		states: {
			connectingDb: {
				exit: 'logTransition',
				invoke: {
					src: 'databaseMachine',
					data: ({ databasePath }): DatabaseMachineContext => ({ databasePath }),
					onDone: {
						target: 'parsing',
						actions: ['assignOrm', 'logDatabaseConnectionSuccess'],
					},
					onError: { target: 'criticalFailure', actions: 'logDatabaseConnectionFailure' },
				},
				on: {
					FAILURE: { target: 'criticalFailure', actions: 'logDatabaseConnectionFailure' },
				},
			},
			parsing: {
				exit: 'logTransition',
				invoke: {
					src: 'parsingOrchestratorMachine',
					data: (ctx, event): ParsingOrchestratorMachineContext => ({
						beaconId: ctx.beaconId,
						orm: event.data.orm,
						logEntries: [],
						logger: ctx.logger,
					}),
					onDone: 'cleanup',
				},
			},
			cleanup: {
				exit: 'logFinalState',
				invoke: {
					src: 'closeOrm',
					onDone: 'done',
				},
			},
			criticalFailure: {
				exit: 'logErrorFinalState',
				invoke: {
					src: 'closeOrm',
					onDone: 'done',
				},
			},
			done: {
				type: 'final',
			},
		},
	},
	{
		actions: {
			logTransition: (ctx, event, meta) => logTransition(ctx, event, meta, `MAIN_BEACON_MACHINE (${ctx.beaconId})`),
			logEntryState: (ctx, event, meta) => logEntryState(ctx, event, meta, `MAIN_BEACON_MACHINE (${ctx.beaconId})`),
			logFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[FINAL]', `MAIN_BEACON_MACHINE (${ctx.beaconId})`),
			logErrorFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[ERROR FINAL]', `MAIN_BEACON_MACHINE (${ctx.beaconId})`),
			assignOrm: actions.assign((_ctx, event) => {
				return { orm: event.data.orm };
			}),
			logDatabaseConnectionSuccess: (ctx) => {
				ctx.logger('SUCCESS', { tags: [ctx.beaconId, 'BEACON_DATABASE'] });
			},
			logDatabaseConnectionFailure: (ctx) => {
				ctx.logger('Database connection FAILURE', { tags: [ctx.beaconId, 'BEACON_DATABASE'] });
			},
		},
		services: {
			databaseMachine,
			parsingOrchestratorMachine,
			closeOrm,
		},
	}
);

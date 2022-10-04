import { actions, createMachine, ActorRefFrom } from 'xstate';

import { FolderLogNamesReturn, parseFolderLogNames } from './identifyLogs.service';

import { hrtime } from 'process';

//services
import { persistBeaconLogLines, PersistBeaconLogLinesReturn } from './persistBeaconLogLines.service';
import { persistGenericLogs } from './persistGenericLogs.service';
import { persistKeystrokes } from './persistKeystrokes.service';
import { persistImages } from './persistImages.service';

// types
import type { Beacon } from '@redeye/models';
import type { ProcessLogsDoneEvent } from './parsingOrchestrator.machine';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { logEntryState, logFinalState, LoggerInstance, logTransition } from '../shared/logging';

export type ProcessServerLogsMachineContext = {
	orm: MikroORM<BetterSqliteDriver>;
	folderPath: string;
	beacons: Beacon[];
	keystrokeLogs: string[];
	timestamps: bigint[];
	persistenceDuration: bigint;
	logOutputAssociationDuration: bigint;
	keylogPersistenceDuration: bigint;
	persistImagesDuration: bigint;
	logger: LoggerInstance;
} & FolderLogNamesReturn;

// key is the beacon identifier given by cobalt strike
export type BeaconPathsRegistry = Record<string, { beacon: Beacon | undefined; paths: string[] }>;

type StartEvent = {
	type: 'START';
};

type Events = StartEvent;

export type SpawnedProcessServerLogsMachine = ActorRefFrom<typeof processServerLogsMachine>;

const doneEvent: ProcessLogsDoneEvent = { type: 'PROCESS_SERVER_LOGS_DONE' };

export const processServerLogsMachine = createMachine(
	{
		tsTypes: {} as import('./processServerLogs.machine.typegen').Typegen0,
		schema: {} as {
			context: ProcessServerLogsMachineContext;
			events: Events;
			services: {
				persistBeaconLogWithoutBeacons: { data: PersistBeaconLogLinesReturn };
				persistAllBeaconLogLines: { data: PersistBeaconLogLinesReturn };
				parseFolderLogNames: { data: FolderLogNamesReturn };
				persistGenericLogs: { data: void };
				persistKeystrokes: { data: void };
				persistImages: { data: void };
			};
		},
		initial: 'idle',
		entry: 'logEntryState',
		states: {
			idle: {
				exit: ['logTransition', 'pushTimeStamp'],
				on: { START: 'associateLogsWithBeacons' },
			},
			associateLogsWithBeacons: {
				entry: 'pushTimeStamp',
				exit: ['logTransition'],
				invoke: {
					src: 'parseFolderLogNames',
					onDone: {
						target: 'persistBeaconLogsWithoutBeacons',
						actions: ['pushTimeStamp', 'assignLogsIdentifyResults'],
					},
					onError: 'criticalFailure',
				},
			},
			persistBeaconLogsWithoutBeacons: {
				exit: ['logTransition'],
				invoke: {
					src: 'persistBeaconLogWithoutBeacons',
					onDone: { target: 'persistBeaconLogs', actions: ['updateBeaconPersistDuration'] },
					onError: 'criticalFailure',
				},
			},
			persistBeaconLogs: {
				exit: ['logTransition'],
				invoke: {
					src: 'persistAllBeaconLogLines',
					onDone: { target: 'persistKeystrokesLogs', actions: ['updateBeaconPersistDuration'] },
					onError: 'criticalFailure',
				},
			},

			persistKeystrokesLogs: {
				exit: ['logTransition'],
				invoke: {
					src: 'persistKeystrokes',
					onDone: {
						target: 'persistImages',
					},
					onError: 'criticalFailure',
				},
			},
			persistImages: {
				exit: ['logTransition'],
				invoke: {
					src: 'persistImages',
					onDone: { target: 'persistGenericLogs' },
					onError: 'criticalFailure',
				},
			},
			persistGenericLogs: {
				invoke: {
					src: 'persistGenericLogs',
					onDone: { target: 'done' },
					onError: 'criticalFailure',
				},
			},
			done: {
				entry: ['logFinalState', 'sendParentDone'],
				type: 'final',
			},
			criticalFailure: {
				entry: ['logErrorFinalState'],
				type: 'final',
			},
		},
	},
	{
		actions: {
			logTransition: (ctx, event, meta) => logTransition(ctx, event, meta, `PROCESS_SERVER_LOGS (${ctx.folderPath})`),
			logEntryState: (ctx, event, meta) => logEntryState(ctx, event, meta, `PROCESS_SERVER_LOGS  (${ctx.folderPath})`),
			logFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[FINAL]', `PROCESS_SERVER_LOGS  (${ctx.folderPath})`),
			logErrorFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[ERROR FINAL]', `PROCESS_SERVER_LOGS  (${ctx.folderPath})`),

			sendParentDone: actions.sendParent(doneEvent),
			assignLogsIdentifyResults: actions.assign((_ctx, event) => event.data),

			updateBeaconPersistDuration: actions.assign((ctx, event) => ({
				persistenceDuration: ctx.persistenceDuration + event.data.persistenceDuration,
				logOutputAssociationDuration: ctx.logOutputAssociationDuration + event.data.logAssociationDuration,
			})),
			// logging
			pushTimeStamp: (ctx) => {
				ctx.timestamps.push(hrtime.bigint());
			},
		},
		services: {
			parseFolderLogNames,
			persistBeaconLogWithoutBeacons: (ctx) =>
				persistBeaconLogLines({
					beacon: undefined,
					paths: ctx.beaconLogsWithoutBeacons,
					orm: ctx.orm,
					logger: ctx.logger,
				}),
			persistAllBeaconLogLines: (ctx) => {
				return new Promise<PersistBeaconLogLinesReturn>((resolve) => {
					const promises = Object.values(ctx.beaconPathRegistry).map((registry) => {
						return persistBeaconLogLines({
							beacon: registry.beacon,
							paths: registry.paths,
							orm: ctx.orm,
							logger: ctx.logger,
						});
					});
					Promise.all(promises).then((results) => {
						const finalResult = results.reduce<PersistBeaconLogLinesReturn>(
							(summation, current) => {
								summation.logAssociationDuration += current.logAssociationDuration;
								summation.persistenceDuration += current.persistenceDuration;
								return summation;
							},
							{ persistenceDuration: BigInt(0), logAssociationDuration: BigInt(0) }
						);
						resolve(finalResult);
					});
				});
			},
			persistGenericLogs: (ctx) =>
				persistGenericLogs({
					orm: ctx.orm,
					genericLogs: ctx.genericLogFiles,
					timestamps: [],
					logger: ctx.logger,
				}),
			persistKeystrokes: (ctx) =>
				persistKeystrokes({
					orm: ctx.orm,
					timestamps: [],
					beacons: ctx.beacons,
					keystrokeLogs: ctx.keystrokeLogs,
					logger: ctx.logger,
				}),
			persistImages: (ctx) =>
				persistImages({
					orm: ctx.orm,
					timestamps: [],
					beacons: ctx.beacons,
					imagePaths: ctx.imagePaths,
					logger: ctx.logger,
				}),
		},
		guards: {},
	}
);
// logPerformance: (ctx) => {
//   const now = hrtime.bigint();

//   const associationDuration = ctx.timestamps[1] - ctx.timestamps[0];
//   const total = now - ctx.timestamps[0];
//   const { persistenceDuration, logOutputAssociationDuration, keylogPersistenceDuration, persistImagesDuration } =
//     ctx;
//   // TODO: THIS IS SO BORKED
//   const genericLogsDuration = hrtime.bigint();
//   const misc =
//     total -
//     associationDuration -
//     persistenceDuration -
//     logOutputAssociationDuration -
//     keylogPersistenceDuration -
//     persistImagesDuration -
//     genericLogsDuration;

//   const boop = `
// Server logs: ${ctx.folderPath}
// \tBeacon log association time: ${Number(associationDuration) / 1e9} seconds
// \tBeacon log output association time: ${Number(logOutputAssociationDuration) / 1e9} seconds
// \tBeacon log persistence time: ${Number(persistenceDuration) / 1e9} seconds
// \tKeylogger persistence time: ${Number(keylogPersistenceDuration) / 1e9} seconds
// \tImages persistence time: ${Number(persistImagesDuration) / 1e9} seconds
// \tDatabase overhead time: ${Number(misc) / 1e9} seconds
// \tTotal execution time: ${Number(total) / 1e9} seconds
// `;
//   ctx.logger(boop, { tags: ['PERF', 'SERVER_PARSER'] });
// }

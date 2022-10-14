import { actions, createMachine, DoneInvokeEvent } from 'xstate';
import { MikroORM } from '@mikro-orm/core';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { DatabaseConnectionResolution, databaseMachine, DatabaseMachineContext } from '../shared/database.machine';
import {
	ParsingOrchestrationCompleteData,
	parsingOrchestratorMachine,
	ParsingOrchestratorMachineContext,
} from './parsingOrchestrator.machine';
import { hrtime } from 'process';
import { logEntryState, logFinalState, LoggerInstance, logTransition } from '../shared/logging';
import type { LogLevel } from '../shared/commandOptions';
import { closeOrm } from '../shared/closeOrm.service';

type TimeMeasurement = bigint[];

export type MainContext = {
	maxChildProcesses: number;
	folderPaths: string[];
	databasePath?: string;
	loggingFolderPath: string;
	timeMeasurements: { databaseConnection?: TimeMeasurement; totalTime?: TimeMeasurement };
	logger: LoggerInstance;
	logLevel: LogLevel;
	orm?: MikroORM<BetterSqliteDriver>;
};

type DatabaseFailureEvent = DoneInvokeEvent<DatabaseConnectionResolution>; // connection won't actually exist

type Events = DatabaseFailureEvent;

export const mainCampaignMachine = createMachine(
	{
		id: 'MAIN_CAMPAIGN_MACHINE',
		tsTypes: {} as import('./main.machine.typegen').Typegen0,
		schema: {
			context: {} as MainContext,
			events: {} as Events,
			services: {} as {
				databaseMachine: {
					data: {
						orm: MikroORM<BetterSqliteDriver>;
						databasePath: string;
					};
				};
				parsingOrchestratorMachine: {
					data: ParsingOrchestrationCompleteData;
				};
				closeOrm: { data: void };
			},
		},
		initial: 'connectingDb',
		entry: ['logEntryState', 'timestampStart'],
		states: {
			connectingDb: {
				exit: 'logTransition',
				invoke: {
					src: 'databaseMachine',
					data: ({ folderPaths, databasePath }): DatabaseMachineContext => ({ folderPaths, databasePath }),
					onDone: {
						target: 'parsing',
						actions: ['timestampDatabaseDone', 'assignOrm'],
					},
					onError: { target: 'criticalFailure' },
				},
			},
			parsing: {
				exit: 'logTransition',
				invoke: {
					src: 'parsingOrchestratorMachine',
					data: (ctx, event: DoneInvokeEvent<DatabaseConnectionResolution>): ParsingOrchestratorMachineContext => ({
						maxChildProcesses: ctx.maxChildProcesses,
						databasePath: event.data.databasePath,
						timeParallelComputation: 0,
						timestampsCommandsAndMetadataPhase: [],
						timestampsEntitiesPhase: [],
						timestampsLogsPhase: [],
						timestampsOrchestration: [],
						timestampLinksPhase: [],
						orm: event.data.orm,
						loggingFolderPath: ctx.loggingFolderPath,
						logger: ctx.logger,
						logLevel: ctx.logLevel,
						savedRelationships: [],
						spawnedLogIdentifierActors: [],
						spawnedBeaconScriptRunnerActors: [],
						errors: [],
					}),

					onDone: { target: 'cleanup', actions: ['timestampParsingDone'] },
					onError: {
						target: 'cleanup',
					},
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
				entry: ['logErrorFinalState'],
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
			logTransition: (ctx, event, meta) => logTransition(ctx, event, meta, meta.state.machine?.id as string),
			logEntryState: (ctx, event, meta) => logEntryState(ctx, event, meta, meta.state.machine?.id as string),
			logFinalState: (ctx, event, meta) => logFinalState(ctx, event, meta, '[FINAL]', meta.state.machine?.id as string),
			logErrorFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[ERROR FINAL]', meta.state.machine?.id as string),
			timestampStart: (ctx) => {
				const now = hrtime.bigint();
				ctx.timeMeasurements.databaseConnection = [now];
				ctx.timeMeasurements.totalTime = [now];
			},
			timestampDatabaseDone: (ctx) => {
				ctx.timeMeasurements.databaseConnection?.push(hrtime.bigint());
			},
			timestampParsingDone: (ctx) => {
				ctx.timeMeasurements.totalTime?.push(hrtime.bigint());
			},
			// Database logs are here since the machine is heavily shared
			assignOrm: actions.assign((_ctx, event) => {
				return { orm: event.data.orm };
			}),
		},
		services: {
			databaseMachine,
			parsingOrchestratorMachine,
			closeOrm,
		},
	}
);

import { actions, createMachine, spawn } from 'xstate';
import { MikroORM } from '@mikro-orm/core';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import {
	processServerLogsMachine,
	ProcessServerLogsMachineContext,
	SpawnedProcessServerLogsMachine,
} from './processServerLogs.machine';
import { hrtime } from 'process';
import { Beacon } from '@redeye/models';
import { linksParser } from './linksParser.service';
import { entitiesIdentify, ParsedObjects } from './entitiesIdentify.service';
import { entitiesPersist } from './entitiesPersist.service';
import { LoggerInstance, logTransition, logEntryState, logFinalState } from '../shared/logging';
import type { LogLevel } from '../shared/commandOptions';
import {
	BeaconChildActorDone,
	beaconScriptRunnerMachine,
	SpawnedBeaconScriptRunnerMachine,
} from './beaconScriptRunner.machine';

/**
 * Generic overview of parsing flow
 * ! synchronous
 * 0: Load project database (databaseConnectService)
 * 1: Load the various project file paths from database or from command line while in development (databaseConnectService)
 * 2: Parse all files, looking for hosts and beacons but don't save anything else to memory other than names (identifyEntitiesMachine)
 * 3: Native insert all hosts (identifyEntitiesMachine)
 * 4: Native insert all beacons and associate them with servers and hosts (identifyEntitiesMachine)
 * - Beacons will be needed in the synchronous steps from this point but computers and servers are not
 * 5: Break into multiple child machines/processes and parse all files again (identifyLogsMachine)
 *      5.1 Create all log line entries and associate them with beacons
 *      5.2 Create all Files and Images
 * ! parallelize
 * 6: Parse all commands
 * 7: Parse all links
 */

export type ParsingOrchestratorMachineContext = {
	// passed entities
	orm: MikroORM<BetterSqliteDriver>;
	logger: LoggerInstance;
	// internal data
	savedRelationships: RequiredLogParsingRelationships[];
	errors: any[];
	// timing
	timestampsOrchestration: bigint[];
	timestampsEntitiesPhase: bigint[];
	timestampsLogsPhase: bigint[];
	timestampsCommandsAndMetadataPhase: bigint[];
	timeParallelComputation: number;
	timestampLinksPhase: bigint[];
	// spawned machines
	spawnedLogIdentifierActors: SpawnedProcessServerLogsMachine[];
	spawnedBeaconScriptRunnerActors: SpawnedBeaconScriptRunnerMachine[];
	// passed props
	loggingFolderPath: string;
	maxChildProcesses: number;
	databasePath: string;
	logLevel: LogLevel;
};

export type RequiredLogParsingRelationships = {
	serverPath: string;
	beacons: Beacon[];
};

type IdentifyDoneEvent = { type: 'IDENTIFY_DONE' };
export type ProcessLogsDoneEvent = { type: 'PROCESS_SERVER_LOGS_DONE' };
type IdentifyEntitiesDoneEvent = {
	type: 'IDENTIFY_ENTITIES_DONE';
	relationships: RequiredLogParsingRelationships[];
};

type Events =
	| IdentifyDoneEvent
	| IdentifyEntitiesDoneEvent
	| ProcessLogsDoneEvent
	| BeaconChildActorDone
	| { type: 'START' };

export type ParsingOrchestrationCompleteData =
	| {
			orchestrationDuration: number;
			entitiesIdentifyDuration: number;
			entitiesPersistDuration: number;
			logPersistenceDuration: number;
			commandsDuration: number;
			commandsComputeDuration: number;
			linksDuration: number;
	  }
	| { errors: string[] };

export const parsingOrchestratorMachine = createMachine(
	{
		id: 'CAMPAIGN_PARSING_ORCHESTRATOR',
		description: 'Manages all parsing for a campaign',
		tsTypes: {} as import('./parsingOrchestrator.machine.typegen').Typegen0,
		schema: {} as {
			context: ParsingOrchestratorMachineContext;
			events: Events;
			services: {
				linksParser: { data: void };
				entitiesIdentifyService: { data: ParsedObjects };
				entitiesPersistService: { data: RequiredLogParsingRelationships[] };
			};
		},
		initial: 'entitiesIdentify',
		entry: ['timestampPushOrchestration', 'logEntryState'],
		states: {
			entitiesIdentify: {
				entry: ['timestampPushEntitiesPhase'],
				exit: 'logTransition',
				invoke: {
					src: 'entitiesIdentifyService',
					onDone: 'entitiesPersist',
					onError: { target: 'criticalFailure', actions: 'unknownCriticalFailure' },
				},
			},
			entitiesPersist: {
				entry: ['timestampPushEntitiesPhase'],
				exit: ['timestampPushEntitiesPhase', 'logTransition'],
				invoke: {
					src: 'entitiesPersistService',
					onDone: {
						target: 'logsPhase',
						actions: ['saveRelationships'],
					},
					onError: { target: 'criticalFailure', actions: 'unknownCriticalFailure' },
				},
			},
			// Persist all logs and associate them with their entities
			logsPhase: {
				entry: ['spawnAllLogParsers', 'timestampPushLogs', 'sendStart'],
				exit: ['removeSpawnLogIdentifiers', 'timestampPushLogs', 'logTransition'],
				on: {
					START: [
						{
							target: 'criticalFailure',
							cond: 'noLogIdentifiers',
							actions: 'criticalFailureLogsPhase',
						},
						{
							actions: 'sendLogIdentifierStart',
						},
					],
					PROCESS_SERVER_LOGS_DONE: [
						{
							target: 'commandsAndMetadataPhase',
							cond: 'allLogIdentifiersActorsDone',
						},
						{
							actions: 'sendLogIdentifierStart',
						},
					],
				},
			},
			// find and persist commands within the log files, spawns n number of child machines which parse the beacons
			commandsAndMetadataPhase: {
				entry: ['timestampPushCommands', 'spawnAllBeaconChildren', 'sendStart'],
				exit: ['timestampPushCommands', 'logTransition'],
				on: {
					START: [
						{
							cond: 'allBeaconActorsDone',
							target: 'criticalFailure',
							actions: ['criticalFailureNoBeaconsToParse'],
						},
						{
							actions: 'startFirstIdleBeaconActor',
						},
					],
					BEACON_CHILD_ACTOR_DONE: [
						{
							cond: 'allBeaconActorsDone',
							actions: ['updateTotalComputeTime'],
							target: 'identifyLinks',
						},
						{
							cond: 'canStartBeaconActor',
							actions: ['updateTotalComputeTime', 'startFirstIdleBeaconActor'],
						},
					],
				},
			},
			// identify all links between entities
			identifyLinks: {
				entry: ['timestampPushLinks'],
				invoke: {
					src: 'linksParser',
					onDone: { target: 'done', actions: ['timestampPushLinks'] },
					onError: { target: 'criticalFailure', actions: ['unknownCriticalFailure', 'logTransition'] },
				},
			},
			done: {
				entry: ['logFinalState'],
				type: 'final',
				data: (ctx): ParsingOrchestrationCompleteData => ({
					orchestrationDuration: Number(hrtime.bigint() - ctx.timestampsOrchestration[0]) / 1e9,
					entitiesIdentifyDuration: Number(ctx.timestampsEntitiesPhase[1] - ctx.timestampsEntitiesPhase[0]) / 1e9,
					entitiesPersistDuration: Number(ctx.timestampsEntitiesPhase[2] - ctx.timestampsEntitiesPhase[1]) / 1e9,
					logPersistenceDuration: Number(ctx.timestampsLogsPhase[1] - ctx.timestampsLogsPhase[0]) / 1e9,
					commandsDuration:
						Number(ctx.timestampsCommandsAndMetadataPhase[1] - ctx.timestampsCommandsAndMetadataPhase[0]) / 1e9,
					commandsComputeDuration: ctx.timeParallelComputation,
					linksDuration: Number(ctx.timestampLinksPhase[1] - ctx.timestampLinksPhase[0]) / 1e9,
				}),
			},
			criticalFailure: {
				data: (ctx): ParsingOrchestrationCompleteData => ({ errors: ctx.errors }),
				entry: ['logErrorFinalState', 'escalateErrors'],
			},
		},
	},
	{
		actions: {
			// SHARED
			logTransition: (ctx, event, meta) => logTransition(ctx, event, meta, meta.state.machine?.id as string),
			logEntryState: (ctx, event, meta) => logEntryState(ctx, event, meta, meta.state.machine?.id as string),
			logFinalState: (ctx, event, meta) => logFinalState(ctx, event, meta, '[FINAL]', meta.state.machine?.id as string),
			logErrorFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[ERROR FINAL]', meta.state.machine?.id as string),
			unknownCriticalFailure: (ctx, event, meta) => {
				ctx.logger('unknown error', {
					level: 'error',
					error: event,
					tags: [meta.state.machine?.id as string],
				});
				ctx.errors.push(JSON.stringify(event));
			},
			escalateErrors: actions.escalate((ctx) => ctx.errors.join('\n')),
			// TOP LEVEL
			timestampPushOrchestration: (ctx) => {
				ctx.timestampsOrchestration.push(hrtime.bigint());
			},
			// PHASE ONE - ENTITIES

			timestampPushEntitiesPhase: (ctx) => {
				ctx.timestampsEntitiesPhase.push(hrtime.bigint());
			},

			saveRelationships: actions.assign((_ctx, event) => ({ savedRelationships: event.data })),

			// PHASE TWO - LOGS
			criticalFailureLogsPhase: (ctx, _event, meta) => {
				ctx.logger('no entities identified to parse', {
					tags: [meta.state.machine?.id as string],
					level: 'error',
				});
				ctx.errors.push('critical failure in logs phase: no entities identified to parse');
			},
			timestampPushLogs: (ctx) => {
				ctx.timestampsLogsPhase.push(hrtime.bigint());
			},
			spawnAllLogParsers: actions.assign((ctx) => {
				const contexts = ctx.savedRelationships.map((relationship): ProcessServerLogsMachineContext => {
					return {
						folderPath: relationship.serverPath,
						beacons: relationship.beacons,
						orm: ctx.orm,
						timestamps: [],
						persistenceDuration: BigInt(0),
						logOutputAssociationDuration: BigInt(0),
						keylogPersistenceDuration: BigInt(0),
						persistImagesDuration: BigInt(0),
						logger: ctx.logger,
						beaconPathRegistry: {},
						beaconLogsWithoutBeacons: [],
						genericLogFiles: [],
						keystrokeLogs: [],
						imagePaths: [],
					};
				});
				return {
					spawnedLogIdentifierActors: contexts.map((context) => spawn(processServerLogsMachine.withContext(context))),
				};
			}),
			sendLogIdentifierStart: actions.send('START', {
				to: (ctx) => {
					const index = ctx.spawnedLogIdentifierActors.findIndex((actor) => {
						const snapshot = actor.getSnapshot();
						return !snapshot?.done;
					});
					return ctx.spawnedLogIdentifierActors[index];
				},
			}),
			removeSpawnLogIdentifiers: actions.assign((_ctx) => ({
				spawnedLogIdentifierActors: [],
			})),

			// PHASE THREE - COMMANDS AND METADATA
			timestampPushCommands: (ctx) => {
				ctx.timestampsCommandsAndMetadataPhase.push(hrtime.bigint());
			},
			criticalFailureNoBeaconsToParse: (ctx) => {
				ctx.logger('no beacons to parse for commands', {
					tags: ['CAMPAIGN_PARSING_ORCHESTRATOR_MACHINE', 'COMMANDS_METADATA_PHASE'],
					level: 'error',
				});

				ctx.errors.push('critical failure in commandsAndMetadata phase: no beacons to parse');
			},
			updateTotalComputeTime: actions.assign((ctx, event) => {
				return { timeParallelComputation: ctx.timeParallelComputation + event.totalExecutionTime };
			}),
			sendStart: actions.send('START'),
			startFirstIdleBeaconActor: actions.send('START', {
				to: (ctx) =>
					ctx.spawnedBeaconScriptRunnerActors.find((runner) =>
						runner.getSnapshot()?.matches('idle')
					) as SpawnedBeaconScriptRunnerMachine,
			}),
			spawnAllBeaconChildren: actions.assign((ctx) => {
				const beaconIds = ctx.savedRelationships.flatMap((relationship) =>
					relationship.beacons.map((beacon) => beacon.id)
				);

				const spawnedBeaconScriptRunnerActors = beaconIds.map((beaconId) => {
					const spawned = spawn(
						beaconScriptRunnerMachine.withContext({
							beaconId,
							databasePath: ctx.databasePath,
							loggingFolderPath: ctx.loggingFolderPath,
							logger: ctx.logger,
							logLevel: ctx.logLevel,
							timestamps: [],
						})
					);
					return spawned;
				});
				return { spawnedBeaconScriptRunnerActors };
			}),
			// PHASE FOUR - PARSE LINKS

			timestampPushLinks: (ctx) => {
				ctx.timestampLinksPhase.push(hrtime.bigint());
			},
		},
		guards: {
			noLogIdentifiers: (ctx) => ctx.spawnedLogIdentifierActors.length === 0,
			allLogIdentifiersActorsDone: (ctx) => ctx.spawnedLogIdentifierActors.every((actor) => actor.getSnapshot()?.done),
			allBeaconActorsDone: (ctx) => ctx.spawnedBeaconScriptRunnerActors.every((machine) => machine.getSnapshot()?.done),
			canStartBeaconActor: (ctx) => {
				const { remaining, running } = ctx.spawnedBeaconScriptRunnerActors.reduce(
					(acc, current) => {
						const snapshot = current.getSnapshot();
						if (!snapshot?.done) {
							if (snapshot?.matches('idle')) acc.remaining++;
							else acc.running++;
						}
						return acc;
					},
					{ remaining: 0, running: 0 }
				);
				return remaining > 0 && running < ctx.maxChildProcesses;
			},
		},
		services: {
			linksParser,
			entitiesIdentifyService: (ctx) => entitiesIdentify({ logger: ctx.logger, orm: ctx.orm }),
			entitiesPersistService: (ctx, event) => entitiesPersist({ orm: ctx.orm, parsedObjects: event.data }),
		},
	}
);

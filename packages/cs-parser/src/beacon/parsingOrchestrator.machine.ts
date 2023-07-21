import { createMachine, actions } from 'xstate';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { Host } from '@redeye/models';
import { Beacon, BeaconLineType, BeaconMeta, HostMeta, LogEntry, Command, Operator, Shapes } from '@redeye/models';
import { getMinMaxDate } from '../shared/dateTimeRegex';
import { findOperatorName } from '../shared/regex';
import { processTechniques } from './processTechniques';
import {
	findHostIpFromPath,
	findOsFromMetaLine,
	findPidFromMetaLine,
	findUserNameFromMetaLine,
	findCommandText,
	findMetadataOrigin,
	findAttackIds,
} from './regex';
import { identifyCommandGroupings } from './identifyCommandGroupings';
import { processUploadCommand } from './processUploadCommand';
import type { LoggerInstance } from '../shared/logging';
import { logTransition, logEntryState, logFinalState } from '../shared/logging';

export type ParsingOrchestratorMachineContext = {
	beaconId: UUID;
	orm: MikroORM<BetterSqliteDriver>;
	beacon?: Beacon;
	logEntries: LogEntry[];
	logger: LoggerInstance;
};
type ParsingOrchestratorMachineEvents = { type: 'START' };

type FetchRelationshipsResult = { beacon: Beacon };

const immutableTimeSortLogs = (entries: LogEntry[]) => {
	return [...entries].sort((a, b) => {
		const timeA = a.dateTime?.getTime();
		const timeB = b.dateTime?.getTime();
		if (timeA && timeB) {
			if (timeA < timeB) return -1;
			if (timeA > timeB) return 1;
			return a.lineNumber - b.lineNumber;
		}
		return 0;
	});
};

export const parsingOrchestratorMachine = createMachine(
	{
		tsTypes: {} as import('./parsingOrchestrator.machine.typegen').Typegen0,
		schema: {
			context: {} as ParsingOrchestratorMachineContext,
			events: {} as ParsingOrchestratorMachineEvents,
			services: {} as {
				fetchBeaconData: {
					data: FetchRelationshipsResult;
				};
				findAllMetadata: {
					data: null;
				};
				findAllCommands: {
					data: null;
				};
			},
		},
		initial: 'fetchBeacon',
		entry: 'logEntryState',
		states: {
			fetchBeacon: {
				exit: 'logTransition',
				invoke: {
					src: 'fetchBeaconData',
					onDone: { target: 'findMetadata', actions: 'assignBeacon' },
					onError: 'criticalFailure',
				},
			},
			findMetadata: {
				exit: 'logTransition',
				invoke: {
					src: 'findAllMetadata',
					onDone: 'findAllCommands',
					onError: 'criticalFailure',
				},
			},
			findAllCommands: {
				exit: 'logTransition',
				invoke: {
					src: 'findAllCommands',
					onDone: 'done',
					onError: 'criticalFailure',
				},
			},
			done: {
				entry: 'logFinalState',
				type: 'final',
			},
			criticalFailure: {
				type: 'final',
				entry: ['logCriticalFailure', 'logErrorFinalState'],
			},
		},
	},
	{
		actions: {
			logTransition: (ctx, event, meta) =>
				logTransition(ctx, event, meta, `BEACON_PARSING_ORCHESTRATOR (${ctx.beaconId})`),
			logEntryState: (ctx, event, meta) =>
				logEntryState(ctx, event, meta, `BEACON_PARSING_ORCHESTRATOR (${ctx.beaconId})`),
			logFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[FINAL]', `BEACON_PARSING_ORCHESTRATOR (${ctx.beaconId})`),
			logErrorFinalState: (ctx, event, meta) =>
				logFinalState(ctx, event, meta, '[ERROR FINAL]', `BEACON_PARSING_ORCHESTRATOR (${ctx.beaconId})`),
			assignBeacon: actions.assign((_ctx, event) => ({
				beacon: event.data.beacon,
				logEntries: event.data.beacon.logs
					.getItems()
					.sort((a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0)),
			})),
		},
		services: {
			fetchBeaconData: (ctx) => {
				return new Promise<FetchRelationshipsResult>((resolve, reject) => {
					try {
						const em = ctx.orm.em.fork();
						em.findOneOrFail(Beacon, { id: ctx.beaconId }, { populate: ['logs', 'operators'] }).then((beacon) => {
							resolve({ beacon });
						});
					} catch (e) {
						reject(e);
					}
				});
			},
			findAllMetadata: (ctx) => {
				return new Promise<null>((resolve, reject) => {
					try {
						const metadataLogs: LogEntry[] = ctx.logEntries.filter(
							(logEntry) => logEntry.lineType === BeaconLineType.METADATA
						);

						const promises = metadataLogs.flatMap((metadataLog) => {
							const ip = findHostIpFromPath(metadataLog.filepath);
							// each host is likely to have a bunch of meta objects, deduplicate later
							const hostMeta = new HostMeta({
								ip,
								os: findOsFromMetaLine(metadataLog.blob),
								host: metadataLog.beacon?.host as Host,
								shape: Shapes.circle,
							});

							const beaconMeta = new BeaconMeta({
								pid: findPidFromMetaLine(metadataLog.blob),
								beacon: metadataLog.beacon as Beacon,
								ip,
								username: findUserNameFromMetaLine(metadataLog.blob),
								startTime: ctx.logEntries[0].dateTime,
								endTime: ctx.logEntries[ctx.logEntries.length - 1].dateTime,
								origin: findMetadataOrigin(metadataLog.blob),
								source: metadataLog,
								shape: Shapes.circle,
							});

							const em = ctx.orm.em.fork();
							return [em.nativeInsert(hostMeta), em.nativeInsert(beaconMeta)];
						});
						// ? Is this the correct way to handle this? This is going to ignore errors other than ones generated by violating the unique policy on metadata objects
						Promise.allSettled(promises).then(() => {
							resolve(null);
						});
					} catch (e) {
						reject(e);
					}
				});
			},
			findAllCommands: (ctx) => {
				return new Promise<null>((resolve, reject) => {
					try {
						const beacon = ctx.beacon as Beacon;
						const logLines = immutableTimeSortLogs(ctx.logEntries);
						const em = ctx.orm.em.fork();
						const internalCommands = identifyCommandGroupings(logLines);

						const filePromises = internalCommands
							.filter((command) => findCommandText(command.input.blob) === 'upload')
							.map(async (command) => {
								const file = processUploadCommand(command, beacon);
								if (file) await em.nativeInsert(file);
								return null;
							});

						const annotationPromises: (() => Promise<boolean>)[] = [];
						const commandPromises = internalCommands.flatMap((internalCommand) => {
							const inputText = findCommandText(internalCommand.input.blob);
							const redTeamMember = findOperatorName(internalCommand.input.blob);
							const operator = beacon.operators.getItems().find((op) => op.id === redTeamMember);
							let updateOperatorPromise;
							if (operator) {
								operator.startTime = getMinMaxDate(true, operator.startTime, internalCommand.input.dateTime);
								operator.endTime = getMinMaxDate(false, operator.endTime, internalCommand.input.dateTime);
								updateOperatorPromise = em.nativeUpdate(
									Operator,
									{ id: operator.id },
									{
										startTime: operator.startTime,
										endTime: operator.endTime,
									}
								);
							}
							const attackIds = findAttackIds(internalCommand.output);

							const command = new Command({
								id:
									beacon.beaconName +
									'-' +
									internalCommand.input.dateTime?.getTime() +
									'-' +
									internalCommand.input.lineNumber,
								input: internalCommand.input,
								output: internalCommand.output,
								commandFailed: internalCommand.output.some((output) => output.lineType === BeaconLineType.ERROR),
								attackIds,
								beacon,
								operator,
								inputText,
							});
							const commandPromise = em.nativeInsert(command);

							const updatePromise = em.nativeUpdate(
								LogEntry,
								{ id: internalCommand.output.map((e) => e.id) },
								{ command }
							);

							annotationPromises.push(processTechniques(em, attackIds, command));

							return [commandPromise, updatePromise, updateOperatorPromise];
						});

						Promise.all([...filePromises, ...commandPromises]).then(() => {
							Promise.all(annotationPromises.map((aP) => aP())).then(() => resolve(null));
						});
					} catch (e) {
						reject(e);
					}
				});
			},
		},
	}
);

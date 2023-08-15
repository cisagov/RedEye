import { exec, execFile } from 'child_process';
import { hrtime } from 'process';
import type { ActorRefFrom } from 'xstate';
import { actions, createMachine } from 'xstate';
import path from 'path';
import type { LogLevel } from '../shared/commandOptions';

import type { LoggerInstance } from '../shared/logging';

type BeaconScriptRunnerMachineContext = {
	beaconId: string;
	databasePath: string;
	loggingFolderPath: string;
	logger: LoggerInstance;
	logLevel: LogLevel;
	timestamps: bigint[];
};

type Events = { type: 'START' };

export type BeaconChildActorDone = { type: 'BEACON_CHILD_ACTOR_DONE'; totalExecutionTime: number };

export type SpawnedBeaconScriptRunnerMachine = ActorRefFrom<typeof beaconScriptRunnerMachine>;

const getRuntimeDir = () => {
	if (process.pkg) {
		return path.resolve(process.execPath, '..');
	} else {
		return path.join(__dirname, '..');
	}
};

export const beaconScriptRunnerMachine = createMachine(
	{
		tsTypes: {} as import('./beaconScriptRunner.machine.typegen').Typegen0,
		schema: {} as {
			context: BeaconScriptRunnerMachineContext;
			events: Events;
			services: {
				runScript: {
					data: void;
				};
			};
		},
		initial: 'idle',
		states: {
			idle: {
				on: {
					START: { target: 'running', actions: 'pushTimestamp' },
				},
			},
			running: {
				invoke: {
					src: 'runScript',
					onDone: 'done',
				},
			},
			done: { entry: 'tellParentDone', type: 'final' },
		},
	},
	{
		actions: {
			tellParentDone: actions.sendParent(
				(ctx): BeaconChildActorDone => ({
					type: 'BEACON_CHILD_ACTOR_DONE',
					totalExecutionTime: Number(hrtime.bigint() - ctx.timestamps[0]),
				})
			),
			pushTimestamp: (ctx) => {
				ctx.timestamps.push(hrtime.bigint());
			},
		},
		services: {
			runScript: (ctx) => {
				return new Promise<void>((resolve) => {
					const args = [
						'beacon',
						`-p`,
						`${ctx.loggingFolderPath}`,
						`-d`,
						`${ctx.databasePath}`,
						`-b`,
						`${ctx.beaconId}`,
						`-l`,
						`${ctx.logLevel}`,
					];
					// This spawns a dedicated node process to parse a beacon

					const execCallback = (error: unknown, stdout: unknown, stderror: unknown) => {
						ctx.logger('exec end', {
							payload: JSON.stringify({ error, stdout, stderror }),
							tags: [ctx.beaconId, 'BEACON_PARSER_INVOKE'],
							level: 'debug',
						});
						resolve();
					};

					if (process.pkg) {
						const command = path.resolve(getRuntimeDir(), 'cobalt-strike-parser');
						ctx.logger('execFile start', {
							payload: [command, process.argv[1], ...args],
							tags: [ctx.beaconId, 'BEACON_PARSER_INVOKE'],
							level: 'debug',
						});
						execFile(command, [process.argv[1], ...args], execCallback);
					} else {
						const command = `cobalt-strike-parser ${args.join(' ')}`;
						ctx.logger('exec start', {
							payload: command,
							tags: [ctx.beaconId, 'BEACON_PARSER_INVOKE'],
							level: 'debug',
						});
						exec(command, execCallback);
					}
				});
			},
		},
	}
);

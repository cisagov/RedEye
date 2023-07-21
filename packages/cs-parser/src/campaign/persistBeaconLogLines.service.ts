import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import type { Beacon } from '@redeye/models';
import { LogEntry, LogType } from '@redeye/models';
import { getDateFromPath, findBeaconLineType, findTimeFromLogLine, combinePathAndLogDates } from '../shared/regex';
import { hrtime } from 'process';
import type { LoggerInstance } from '../shared/logging';
import { bulkInsertLogEntries } from './insertUtils';

type PersistBeaconLogLinesArguments = {
	beacon: Beacon | undefined;
	paths: string[];
	orm: MikroORM<BetterSqliteDriver>;
	logger: LoggerInstance;
};

export type PersistBeaconLogLinesReturn = {
	persistenceDuration: bigint;
	logAssociationDuration: bigint;
};

export const persistBeaconLogLines = (args: PersistBeaconLogLinesArguments): Promise<PersistBeaconLogLinesReturn> => {
	return new Promise<PersistBeaconLogLinesReturn>((resolve) => {
		let persistenceDuration: bigint = BigInt(0);
		let logAssociationDuration: bigint = BigInt(0);
		const promises = args.paths.map((path) => {
			return new Promise<void>((resolve) => {
				const start = hrtime.bigint();
				const pathDate = getDateFromPath(path);
				let lineNumber = 1;
				const completedEntries: LogEntry[] = [];
				let previousEntry: LogEntry | undefined = undefined;

				const readInterface = createInterface({
					input: createReadStream(path),
				});

				readInterface.on('line', (line) => {
					const beaconLineType = findBeaconLineType(line);
					// If there is a new line type, it means this line is over and start a new one
					if (beaconLineType) {
						const logTime = findTimeFromLogLine(line);
						const dateTime = combinePathAndLogDates(pathDate, logTime);

						const workingEntry = new LogEntry({
							blob: line,
							dateTime,
							filepath: path,
							lineNumber,
							lineType: beaconLineType,
							logType: LogType.BEACON,
							beacon: args.beacon,
						});

						if (previousEntry) {
							completedEntries.push(previousEntry);
						}
						previousEntry = workingEntry;
					} else if (previousEntry) {
						previousEntry.pushLogLine(line);
					} else {
						// a line that is in a beacon log but isn't associated with a previous line and doesn't have a line type
						const logTime = findTimeFromLogLine(line);
						const dateTime = combinePathAndLogDates(pathDate, logTime);
						const brokenEntry = new LogEntry({
							blob: line,
							dateTime,
							filepath: path,
							lineNumber,
							logType: LogType.BEACON,
							beacon: args.beacon,
						});
						completedEntries.push(brokenEntry);
					}
					lineNumber++;
				});
				logAssociationDuration = hrtime.bigint() - start;
				readInterface.on('close', async () => {
					if (previousEntry) completedEntries.push(previousEntry);
					const start = hrtime.bigint();
					await bulkInsertLogEntries(args.orm.em.fork(), completedEntries);
					const end = hrtime.bigint();
					persistenceDuration = end - start;
					resolve();
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve({ logAssociationDuration, persistenceDuration });
		});
	});
};

import { findFileName } from './regex';
import { LogEntry, LogType } from '@redeye/models';
import { combinePathAndLogDates, findTimeFromLogLine, getDateFromPath } from '../shared/dateTimeRegex';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import type { LoggerInstance } from '../shared/logging';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { bulkInsertLogEntries } from './insertUtils';

type PersistGenericLogsArguments = {
	orm: MikroORM<BetterSqliteDriver>;
	genericLogs: string[];
	timestamps: bigint[];
	logger: LoggerInstance;
};

export const persistGenericLogs = (args: PersistGenericLogsArguments): Promise<void> => {
	return new Promise<void>((resolve) => {
		const promises = args.genericLogs.map((path) => {
			return new Promise<void>((resolve) => {
				let logType: LogType;
				const fileName = findFileName(path);
				const pathDate = getDateFromPath(path);
				if (fileName === 'events.log') logType = LogType.EVENT;
				else if (fileName.includes('weblog')) logType = LogType.WEBLOG;
				else if (fileName === 'downloads.log') logType = LogType.DOWNLOAD;
				else logType = LogType.UNKNOWN;

				const em = args.orm.em.fork();

				let lineNumber = 0;

				const readInterface = createInterface({
					input: createReadStream(path),
				});

				const entries: LogEntry[] = [];
				readInterface.on('line', async (line) => {
					lineNumber++;
					const logTime = findTimeFromLogLine(line);
					const dateTime = combinePathAndLogDates(pathDate, logTime);
					const entry = new LogEntry({ blob: line, dateTime, filepath: path, lineNumber, logType });
					entries.push(entry);
				});

				readInterface.on('close', async () => {
					await bulkInsertLogEntries(em, entries);

					resolve();
				});
			});
		});
		Promise.all(promises).then(() => {
			resolve();
		});
	});
};

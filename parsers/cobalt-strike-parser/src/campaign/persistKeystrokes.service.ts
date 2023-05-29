import { Beacon, LogEntry, LogType } from '@redeye/models';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { combinePathAndLogDates, findTimeFromLogLine, getDateFromPath } from '../shared/dateTimeRegex';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { beaconFromKeyLoggerName } from './regex';
import { LoggerInstance } from '../shared/logging';

type PersistKeystrokesArgument = {
	orm: MikroORM<BetterSqliteDriver>;
	keystrokeLogs: string[];
	beacons: Beacon[];
	timestamps: bigint[];
	logger: LoggerInstance;
};

export const persistKeystrokes = (arg: PersistKeystrokesArgument): Promise<void> => {
	return new Promise<void>((resolve) => {
		const promises = arg.keystrokeLogs.map((keystrokeLogPath) => {
			return new Promise<void>((resolve) => {
				const em = arg.orm.em.fork();
				const pathDate = getDateFromPath(keystrokeLogPath);
				const beaconName = beaconFromKeyLoggerName(keystrokeLogPath);

				const beacon = arg.beacons.find((beacon) => beacon.beaconName === beaconName);
				const dateTime = combinePathAndLogDates(pathDate, { hour: 0, minute: 0, second: 0 });

				const log = new LogEntry({
					blob: '',
					dateTime,
					beacon,
					filepath: keystrokeLogPath,
					lineNumber: 0,
					logType: LogType.KEYSTROKES,
				});

				const readInterface = createInterface({
					input: createReadStream(keystrokeLogPath),
				});

				readInterface.on('line', (line) => {
					log.pushLogLine(line);
				});

				readInterface.on('close', async () => {
					const logTime = findTimeFromLogLine(log.blob);
					const dateTime = combinePathAndLogDates(pathDate, logTime);
					log.dateTime = dateTime;

					await em.nativeInsert(log);
					resolve();
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		});
	});
};

import { getDateFromPath, findTimeFromLogLine, combinePathAndLogDates } from './dateTimeRegex';

test('Date from path', () => {
	expect(getDateFromPath('/Users/user/Desktop/logs/log-backups/1https/190502/172.22.1.5/beacon_99909.log')).toEqual({
		year: 2019,
		monthIndex: 4,
		day: 2,
	});
	expect(
		getDateFromPath(`\\Users\\user\\Desktop\\logs\\log-backups\\1https\\190502\\172.22.1.5\\beacon_99909.log`)
	).toEqual({ year: 2019, monthIndex: 4, day: 2 });
});

test('Dateless log line with date in path', () => {
	const datePath = '/Users/user/Desktop/logs/log-backups/1https/190502/127.0.01/beacon_99909.log';
	const dateFromPath = getDateFromPath(datePath);
	const nonTimeLine = '[System Process]	0	0';
	expect(dateFromPath).toEqual({
		year: 2019,
		monthIndex: 4,
		day: 2,
	});
	const falsyLogLineTime = findTimeFromLogLine(nonTimeLine);
	expect(findTimeFromLogLine(nonTimeLine)).toBeFalsy();
	expect(combinePathAndLogDates(dateFromPath, falsyLogLineTime)).toBeFalsy();
});

test('Log line contains time', () => {
	expect(findTimeFromLogLine('05/02 15:45:01 [checkin] host called home, sent: 12 bytes')).toEqual({
		hour: 15,
		minute: 45,
		second: 1,
	});
	expect(findTimeFromLogLine('09/15 18:39:14 UTC [output]/nbeacon exit./n')).toEqual({
		hour: 18,
		minute: 39,
		second: 14,
	});
});

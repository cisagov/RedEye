import { findFirstCaptureGroup } from './baseRegex';

type PathDate = { year: number; monthIndex: number; day: number };
export function getDateFromPath(path: string): PathDate | undefined {
	const unixPathDate = findFirstCaptureGroup(new RegExp(/\/(\d{6})\//), path);
	const windowsPathDate = findFirstCaptureGroup(new RegExp(/\\(\d{6})\\/), path);
	const pathDate = unixPathDate ?? windowsPathDate;
	if (pathDate) {
		// two digit year might be fragile
		const [twoDigitYear, month, day] = pathDate.match(/.{1,2}/g) as string[];
		const year = `20${twoDigitYear}`;
		return {
			year: parseInt(year),
			monthIndex: parseInt(month) - 1,
			day: parseInt(day),
		};
	}
	return undefined;
}

type LogLineTime = { hour: number; minute: number; second: number };
export function findTimeFromLogLine(line: string): LogLineTime | undefined {
	let hour = '00';
	let minute = '00';
	let second = '00';
	try {
		const regex = new RegExp(/(\d{2}:\d{2}:\d{2})/, 'g');
		const fullMatch = findFirstCaptureGroup(regex, line);
		if (fullMatch) {
			[hour, minute, second] = fullMatch.split(':');
		} else {
			const regex = new RegExp(/(\d{2}:\d{2})/, 'g');
			const partialMatch = findFirstCaptureGroup(regex, line);
			if (partialMatch == null) {
				return undefined;
			}
			[hour, minute] = partialMatch.split(':');
		}
		return {
			hour: parseInt(hour),
			minute: parseInt(minute),
			second: parseInt(second),
		};
	} catch (e) {
		// TODO: Log errors
		return undefined;
	}
}

export function combinePathAndLogDates(pathDate: PathDate | undefined, logLineTime: LogLineTime | undefined) {
	if (pathDate && logLineTime) {
		return new Date(
			Date.UTC(
				pathDate.year,
				pathDate.monthIndex,
				pathDate.day,
				logLineTime.hour,
				logLineTime.minute,
				logLineTime.second
			)
		);
	} else {
		return undefined;
	}
}

/**
 * Compares first date to second date
 * @param minimum {Boolean}
 * @param date1 {Date | null | undefined}
 * @param date2 {Date | null | undefined}
 * @return Date
 */
export function getMinMaxDate(minimum: boolean, date1?: Date | null, date2?: Date | null): Date {
	const dateComparator = minimum ? Math.min : Math.max;
	const defaultVal = minimum ? 8.64e15 : 0;
	return new Date(
		dateComparator.apply(null, [new Date(date1 ?? defaultVal).valueOf(), new Date(date2 ?? defaultVal).valueOf()])
	);
}

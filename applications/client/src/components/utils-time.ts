import { timeDay, timeYear } from 'd3';

export enum TickFormat {
	Second = 'Second',
	Minute = 'Minute',
	Hour = 'Hour',
	Day = 'Day',
	Month = 'Month',
	YearMonth = 'YearMonth',
	Year = 'Year',
}

export const formatters: {
	[key in TickFormat]: string | ((arg: Date) => string);
} = {
	[TickFormat.Second]: 'HH:mm:ss',
	[TickFormat.Minute]: 'HH:mm',
	[TickFormat.Hour]: (date) => {
		// if midnight show MM/DD HH:mm
		const rounded = timeDay(date);
		if (rounded.valueOf() === date.valueOf()) {
			return 'MM/DD';
		} else {
			return 'HH:mm';
		}
	},
	[TickFormat.Day]: 'MM/DD',
	[TickFormat.Month]: 'MMM',
	[TickFormat.YearMonth]: (date) => {
		// if Jan, do YYYY or MMM YYYY
		const rounded = timeYear(date);
		if (rounded.valueOf() === date.valueOf()) {
			return 'YYYY';
		} else {
			return 'MMM';
		}
	},
	[TickFormat.Year]: 'YYYY',
};

const durationSecond = 1;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationMonth = durationDay * 30;
const durationYear = durationDay * 365;

export const tickFormatIntervals: [TickFormat, number][] = [
	[TickFormat.Second, 30 * durationSecond], // use TickFormats.Second for interval x <= 30 seconds
	[TickFormat.Minute, durationHour],
	[TickFormat.Hour, 12 * durationHour],
	[TickFormat.Day, durationWeek],
	[TickFormat.Month, durationMonth],
	[TickFormat.YearMonth, durationYear],
	[TickFormat.Year, 2 * durationYear],
];

export const dateFormat = 'MM/DD/YY';
export const datePlaceholder = '00/00/00';
export const dateShortFormat = 'MM/DD';
export const dateShortPlaceholder = '00/00';
export const timeFormat = 'HH:mm';
export const timePlaceholder = '00:00';
export const dateTimeFormat = `${dateFormat} ${timeFormat}`;
export const dateTimePlaceholder = `${datePlaceholder} ${timePlaceholder}`;

export const durationFormatter = (date1?: Date | null, date2?: Date | null) => {
	if (!date1 || !date2) return undefined;
	const duration = Math.abs(date1.getTime() - date2.getTime()) / 1000;
	return duration > durationMonth ? dateFormat : dateTimeFormat;
};

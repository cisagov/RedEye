import type { TickFormat } from '@redeye/client/components';
import { formatters, tickFormatIntervals } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import type { TimeInterval } from 'd3';
import { bisector, timeTickInterval, timeTicks } from 'd3';
import type { TimeScale } from './TimelineChart';

export function createTickFormatter(kind: TickFormat): (arg: Date) => string {
	const store = useStore();
	const formatter = formatters[kind];
	return (date) => store.settings.momentTz(date).format(typeof formatter === 'function' ? formatter(date) : formatter);
}

export function createTicksWithFormatter(xScale: TimeScale): { tickDates: Date[]; formatter: (arg: Date) => string } {
	const store = useStore();
	const start = xScale.domain()[0];
	const end = xScale.domain()[1];
	const dataWidth = Math.abs(xScale.range()[1] - xScale.range()[0]);
	const tickCount = Math.floor((dataWidth * 4) / 600); // 4 ticks per 600px

	// intervals aren't generated for tickCount < 3 🤷‍
	if (tickCount < 3) {
		return {
			tickDates: [],
			formatter: () => '',
		};
	}

	// Note these need to be the same so that all the stuff matches.
	const tickArgs: [Date, Date, number] = [start, end, tickCount];
	const tickInterval = timeTickInterval(...tickArgs) as TimeInterval;
	const tickDates: Date[] = timeTicks(...tickArgs);

	const intervalStart = tickInterval(start);
	const intervalEnd = tickInterval.offset(intervalStart, 1);
	const intervalSeconds = Math.abs(store.settings.momentTz(intervalStart).diff(intervalEnd, 'seconds', true));

	// use TickFormats.Second for interval intervalSeconds <= 30 seconds
	const tickFormatI = bisector<(typeof tickFormatIntervals)[0], number>((x) => x[1]).left(
		tickFormatIntervals,
		intervalSeconds
	);

	const formatKind = tickFormatIntervals[tickFormatI][0];

	const formatter = createTickFormatter(formatKind);
	return { tickDates, formatter };
}

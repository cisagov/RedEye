import { css } from '@emotion/react';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import type { ScaleTime } from 'd3';
import { scaleTime } from 'd3';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AxisLabels } from './AxisLabel';
import { Bars } from './Bars';
import { Scrubber } from './Scrubber';
import { PIXEL_BAR_DENSITY, X_AXIS_LABELS_HEIGHT } from './timeline-static-vars';

type TimelineChartProps = ComponentProps<'div'> & {};

export interface IBar {
	start: Date;
	end: Date;
	beaconCount: number;
	activeBeaconCount: number;
	selectedBeaconCount: number;
}

export interface IDimensions {
	width: number;
	height: number;
}

export const TIMELINE_PADDING = {
	// NOTE: Support for top/bottom padding isn't implemented
	// TOP: 8,
	RIGHT: 8,
	// BOTTOM: 8,
	LEFT: 8,
};

export type TimeScale = ScaleTime<number | any, number | any>;

export const TimelineChart = observer<TimelineChartProps>(({ ...props }) => {
	const store = useStore();
	const { width, height, ref } = useResizeDetector({ refreshMode: 'debounce', refreshRate: 500 });
	const state = createState(
		{
			dimensions: {
				width: 0,
				height: 0,
			} as IDimensions | undefined,
			xScale: undefined as TimeScale | undefined,
			updateScale(start: Date, end: Date, newWidth: number) {
				this.xScale = scaleTime(
					[start, end],
					[TIMELINE_PADDING.LEFT, newWidth - TIMELINE_PADDING.LEFT - TIMELINE_PADDING.RIGHT]
				);
			},
			get start() {
				return store.campaign?.timeline.startTime;
			},
			get end() {
				return store.campaign?.timeline.endTime;
			},
			get bars() {
				return store.campaign?.timeline.bars;
			},
		},
		{ xScale: observable.ref }
	);

	// get bars based on width
	useEffect(() => {
		if (width) {
			const targetBarCount = Math.round(width / PIXEL_BAR_DENSITY);
			store.campaign?.timeline.setSuggestedBucketCount(targetBarCount);
		}
	}, [width]);

	useEffect(() => {
		const timeline = store.campaign?.timeline;
		const start = timeline.startTime;
		const end = timeline.endTime;

		if (start && end && width) {
			state.updateScale(start, end, width);
		} else {
			state.update('xScale', undefined);
		}
	}, [store.campaign?.timeline.endTime, store.campaign?.timeline.startTime, width]);

	return (
		<div
			ref={ref}
			css={css`
				width: 100%;
			`}
		>
			<div {...props} css={safetyOverflowDiv}>
				<svg height={height} width={width}>
					{state.start && state.end && width && height && state.xScale && (
						<>
							<Bars
								xScale={state.xScale}
								bars={state.bars}
								start={state.start}
								end={state.end}
								dimensions={{ height: height - X_AXIS_LABELS_HEIGHT, width }}
								scrubberTime={store.campaign?.timeline.scrubberTime ?? null}
							/>
							<AxisLabels xScale={state.xScale} yTop={height - X_AXIS_LABELS_HEIGHT} start={state.start} end={state.end} />
							{store.campaign?.timeline.scrubberTime && state.bars.length !== 0 && (
								<Scrubber
									scrubberTime={store.campaign?.timeline.scrubberTime}
									setScrubberTime={store.campaign?.timeline?.setScrubberTimeExact}
									xScale={state.xScale}
									bars={state.bars}
									dimensions={{ width, height }}
								/>
							)}
						</>
					)}
				</svg>
			</div>
		</div>
	);
});

const safetyOverflowDiv = css`
	overflow: hidden;
	flex: 1 1 auto;
	height: 100%;
`;

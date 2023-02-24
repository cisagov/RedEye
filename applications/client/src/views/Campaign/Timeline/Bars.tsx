import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2';
import { css } from '@emotion/react';
import { createState, durationFormatter } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { TimelineTokens } from '@redeye/ui-styles';
import { max, scaleLinear } from 'd3';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { animated } from 'react-spring';
import { BarLabelOnHover, BarLabelBeaconList } from './BarLabels';
import { TIMELINE_BG_COLOR } from './timeline-static-vars';
import type { IBar, IDimensions, TimeScale } from './TimelineChart';

type BarsProps = ComponentProps<'div'> & {
	bars: IBar[];
	start: Date;
	end?: Date;
	dimensions: IDimensions;
	xScale: TimeScale;
	scrubberTime: Date | null;
};

export const Bars = observer<BarsProps>(({ xScale, bars, start, end, dimensions, scrubberTime }) => {
	const store = useStore();
	const yMax = max(bars.map((bar) => bar.beaconCount)) ?? 0;
	const yScale = scaleLinear([0, yMax], [0, dimensions.height]);
	const state = createState({
		isHover: true as boolean,
		toggleIsHover() {
			this.isHover = !this.isHover;
		},
	});
	const BarLabel = useMemo(() => (state.isHover ? BarLabelOnHover : BarLabelBeaconList), [state.isHover]);

	return (
		<g>
			{bars.map((bar) => {
				const x = xScale(bar.start);
				const width = xScale(bar.end) - x;

				return (
					<Popover2
						key={`${start.valueOf()}-${bar.start.valueOf()}`}
						interactionKind={Popover2InteractionKind.HOVER}
						content={
							bar.beaconCount ? (
								<BarLabel bar={bar} dateFormatter={durationFormatter(start, end)} handleClick={() => state.toggleIsHover()} />
							) : undefined
						}
						placement="bottom"
						// placement="bottom-end"
						// modifiers={{
						// 	offset: {
						// 		enabled: true,
						// 		options: {
						// 			offset: [20, 20],
						// 		},
						// 	},
						// }}
						renderTarget={({ isOpen, ref, ...targetProps }) => (
							<g
								cy-test="timeline-bar"
								ref={ref}
								{...targetProps}
								onMouseDown={() => {
									store.campaign?.timeline.setScrubberTimeExact(bar.end);
								}}
							>
								{bar.beaconCount && (
									<>
										{/* Interaction Beacon Bar for color */}
										<rect
											x={x}
											width={width}
											y={0}
											height={dimensions.height}
											css={[baseBarStyles, isOpen && interactionBarStyles]}
										/>
										{/* Dead & Future Beacon Bar */}
										<rect
											x={x}
											width={width}
											y={dimensions.height - yScale(bar.beaconCount)}
											height={yScale(bar.beaconCount)}
											css={[baseBarStyles, scrubberTime && bar.end <= scrubberTime ? deadBarStyles : futureBarStyles]}
										/>
										{/* Active Beacon Bar */}
										<rect
											x={x}
											width={width}
											y={dimensions.height - yScale(bar.activeBeaconCount)}
											height={yScale(bar.activeBeaconCount)}
											css={[baseBarStyles, aliveBarStyles]}
										/>
										{/* Selected Beacon Bar */}
										<animated.rect
											x={x}
											width={width}
											y={dimensions.height - yScale(bar.selectedBeaconCount)}
											height={yScale(bar.selectedBeaconCount)}
											css={[baseBarStyles, selectedBarStyles]}
										/>
										{/* Interaction Beacon Bar for Functionality */}
										<rect x={x} width={width} y={0} height={dimensions.height} css={[interactionBarFnStyles]} />
									</>
								)}
							</g>
						)}
					/>
				);
			})}
		</g>
	);
});

const baseBarStyles = css`
	stroke: ${TIMELINE_BG_COLOR};
	stroke-width: 2px;
	fill: transparent;
	transition: 200ms ease;
	transition-property: fill, y, height;
`;

const deadBarStyles = css`
	fill: ${TimelineTokens.PastBgTimeline};
`;

const futureBarStyles = css`
	fill: ${TimelineTokens.FutureBgTimeline};
`;

const aliveBarStyles = css`
	fill: ${TimelineTokens.PresentBgTimeline};
`;

const selectedBarStyles = css`
	fill: ${TimelineTokens.SelectedBgTimeline};
`;

const interactionBarStyles = css`
	fill: ${TimelineTokens.PreviewBgTimeline};
`;

const interactionBarFnStyles = css`
	fill: transparent;
	cursor: pointer;
`;

import { Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { durationFormatter } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { TimelineTokens } from '@redeye/ui-styles';
import { interpolateRound, max, scaleLinear } from 'd3';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { TimelineBarHoverPopover } from './TimelineBarHoverPopover';
import { POPOVER_Y_OFFSET } from './timeline-static-vars';
import type { IBar, IDimensions, TimeScale } from './TimelineChart';

type BarsProps = ComponentProps<'div'> & {
	bars: IBar[];
	start: Date;
	end?: Date;
	dimensions: IDimensions;
	xScale: TimeScale;
	scrubberTime: Date | null;
};

const { minBarScale, minBarScaleDiff } = { minBarScale: 3, minBarScaleDiff: 1 };
export const Bars = observer<BarsProps>(({ xScale, bars, start, end, dimensions, scrubberTime }) => {
	const store = useStore();
	const yMax = max(bars.map((bar) => bar.beaconCount)) ?? 0;
	const yScale = scaleLinear([0, yMax], [0, dimensions.height]).interpolate(interpolateRound);

	return (
		<g>
			{/* MAYBEDO: wrap all the bars in a single popover and use the modifiers.offset to position on the hovered bar */}
			{bars.map((bar) => {
				const x = xScale(bar.start);
				const width = xScale(bar.end) - x - 1;

				// In order to avoid some invisible bars (beacons or active/selected beacons) caused by smallCount&pixelLimit, here we set a min bar height for all different beacon types in a ladder.
				const beaconCountScale = Math.max(minBarScale, yScale(bar.beaconCount));

				const activeBeaconCountScale =
					bar.activeBeaconCount > 0
						? Math.max(
								bar.activeBeaconCount === bar.beaconCount ? minBarScale : minBarScale - minBarScaleDiff,
								yScale(bar.activeBeaconCount)
						  )
						: yScale(bar.activeBeaconCount);

				const selectedBeaconCountScale =
					bar.selectedBeaconCount > 0
						? Math.max(
								bar.selectedBeaconCount === bar.beaconCount
									? minBarScale
									: bar.selectedBeaconCount === bar.activeBeaconCount
									? minBarScale - minBarScaleDiff
									: minBarScale - 2 * minBarScaleDiff,
								yScale(bar.selectedBeaconCount)
						  )
						: yScale(bar.selectedBeaconCount);

				return (
					<Popover
						key={`${start.valueOf()}-${bar.start.valueOf()}`}
						interactionKind={PopoverInteractionKind.HOVER}
						placement="bottom"
						minimal
						modifiers={{
							offset: {
								enabled: true,
								options: { offset: [0, POPOVER_Y_OFFSET] },
							},
						}}
						content={
							bar.beaconCount ? (
								<TimelineBarHoverPopover bar={bar} dateFormatter={durationFormatter(start, end)} />
							) : undefined
						}
						renderTarget={({ isOpen, ref, ...targetProps }) => (
							<g
								cy-test="timeline-bar"
								ref={ref}
								{...(targetProps as any)} // :(
								onMouseDown={() => {
									if (!store.router.params.presentation) {
										store.campaign?.timeline.setScrubberTimeAny(bar.end);
									}
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
											css={[
												baseBarStyles,
												isOpen && interactionBarStyles,
												// css`g:hover > & { ${interactionBarStyles} } `, // this may be better
											]}
										/>
										{/* Dead & Future Beacon Bar */}
										<rect
											x={x}
											width={width}
											y={dimensions.height - beaconCountScale}
											height={beaconCountScale}
											css={[baseBarStyles, scrubberTime && bar.end <= scrubberTime ? deadBarStyles : futureBarStyles]}
										/>
										{/* Active Beacon Bar */}
										<rect
											x={x}
											width={width}
											y={dimensions.height - activeBeaconCountScale}
											height={activeBeaconCountScale}
											css={[baseBarStyles, aliveBarStyles]}
										/>
										{/* Selected Beacon Bar */}
										<rect
											x={x}
											width={width}
											y={dimensions.height - selectedBeaconCountScale}
											height={selectedBeaconCountScale}
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
	fill: transparent;
	transition: 200ms ease;
	transition-property: y, height;
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

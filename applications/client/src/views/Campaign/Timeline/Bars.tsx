import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2';
import { css } from '@emotion/react';
import { createState, durationFormatter } from '@redeye/client/components';
import { CoreTokens } from '@redeye/ui-styles';
import { max, scaleLinear } from 'd3';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
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
	const yMax = max(bars.map((bar) => bar.beaconCount)) ?? 0;
	const yScale = scaleLinear([0, yMax], [0, dimensions.height]);
	const state = createState({
		isHover: true as boolean,
		toggleIsHover() {
			this.isHover = !this.isHover;
		},
	});

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
								state.isHover ? (
									<BarLabelOnHover bar={bar} dateFormatter={durationFormatter(start, end)} />
								) : (
									<BarLabelBeaconList bar={bar} dateFormatter={durationFormatter(start, end)} />
								)
							) : undefined
						}
						placement="bottom"
						modifiers={{
							arrow: { enabled: false },
							offset: {
								enabled: true,
								options: {
									offset: [0, 20],
								},
							},
						}}
						renderTarget={({ isOpen, ref, ...targetProps }) => (
							<g
								ref={ref}
								{...targetProps}
								onMouseDown={(e) => {
									e.preventDefault();
									state.toggleIsHover();
								}}
							>
								{/* Interaction Beacon Bar for color */}
								{bar.beaconCount && (
									<rect
										x={x}
										width={width}
										y={0}
										height={dimensions.height}
										css={[baseBarStyles, interactionBarStyles(isOpen)]}
									/>
								)}
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
								{!!bar.beaconCount && (
									<rect x={x} width={width} y={0} height={dimensions.height} css={[interactionBarFnStyles]} />
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
	transition: fill 300ms linear, y 500ms linear, height 500ms linear;
`;

const deadBarStyles = css`
	fill: ${CoreTokens.BeaconDead};
`;

const futureBarStyles = css`
	fill: ${CoreTokens.BeaconFuture};
`;

const aliveBarStyles = css`
	fill: ${CoreTokens.BeaconAlive};
`;

const selectedBarStyles = css`
	fill: ${CoreTokens.BeaconSelected};
`;

const interactionBarStyles = (hover: boolean) => css`
	fill: ${hover ? CoreTokens.BeaconInteracted : 'transparent'};
	opacity: 0.3;
`;

const interactionBarFnStyles = css`
	fill: transparent;
	cursor: pointer;
`;

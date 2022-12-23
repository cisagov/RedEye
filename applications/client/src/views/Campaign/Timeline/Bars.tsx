import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2';
import { css } from '@emotion/react';
import { createState, durationFormatter } from '@redeye/client/components';
import { Tokens } from '@redeye/ui-styles';
import { max, scaleLinear } from 'd3';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { animated } from 'react-spring';
import { BarLabelOnHover, BarLabelOnClick } from './BarLabels';
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
		interaction: Popover2InteractionKind.HOVER as Popover2InteractionKind,
		setInteraction(interaction: Popover2InteractionKind) {
			this.interaction = interaction;
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
								state.interaction === Popover2InteractionKind.HOVER ? (
									<BarLabelOnHover bar={bar} dateFormatter={durationFormatter(start, end)} />
								) : (
									<BarLabelOnClick bar={bar} dateFormatter={durationFormatter(start, end)} />
								)
							) : undefined
						}
						placement="bottom"
						renderTarget={({ isOpen, ref, ...targetProps }) => (
							<g
								ref={ref}
								{...targetProps}
								onMouseDown={(e) => {
									e.preventDefault();
									state.setInteraction(Popover2InteractionKind.CLICK);
								}}
								onMouseOut={() => state.setInteraction(Popover2InteractionKind.HOVER)}
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
								{!!bar.beaconCount && (
									<animated.rect
										x={x}
										width={width}
										y={dimensions.height - yScale(bar.selectedBeaconCount)}
										height={yScale(bar.selectedBeaconCount)}
										css={[baseBarStyles, selectedBarStyles]}
									/>
								)}
								{/* Interaction Beacon Bar for Functionality */}
								<rect x={x} width={width} y={0} height={dimensions.height} css={[baseBarStyles, interactionBarFnStyles]} />
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
	fill: ${Tokens.CoreTokens.BeaconDead};
`;

const futureBarStyles = css`
	fill: ${Tokens.CoreTokens.BeaconFuture};
`;

const aliveBarStyles = css`
	fill: ${Tokens.CoreTokens.BeaconAlive};
`;

const selectedBarStyles = css`
	fill: ${Tokens.CoreTokens.BeaconSelected};
`;

const interactionBarStyles = (hover: boolean) => css`
	fill: ${hover ? Tokens.CoreTokens.BeaconInteracted : 'transparent'};
`;

const interactionBarFnStyles = css`
	fill: transparent;
`;

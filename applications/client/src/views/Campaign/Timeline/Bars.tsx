import { css } from '@emotion/react';
import { Tokens } from '@redeye/ui-styles';
import { max, scaleLinear } from 'd3';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { Fragment } from 'react';
import { animated } from 'react-spring';
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

export const Bars = observer<BarsProps>(({ xScale, bars, start, dimensions, scrubberTime }) => {
	const yMax = max(bars.map((bar) => bar.beaconCount)) ?? 0;
	const yScale = scaleLinear([0, yMax], [0, dimensions.height]);

	return (
		<g>
			{bars.map((bar) => {
				const x = xScale(bar.start);
				const width = xScale(bar.end) - x;

				return (
					<Fragment key={`${start.valueOf()}-${bar.start.valueOf()}`}>
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
					</Fragment>
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

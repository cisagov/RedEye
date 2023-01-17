import { css } from '@emotion/react';
import { dateFormat, durationFormatter } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { Tokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { createTicksWithFormatter } from './create-ticks';
import { TIMELINE_BG_COLOR, X_AXIS_LABELS_HEIGHT } from './timeline-static-vars';
import type { TimeScale } from './TimelineChart';
import { TIMELINE_PADDING } from './TimelineChart';

const LINE_WIDTH = 1;
export type AxisLabelProps = ComponentProps<'div'> & {
	xScale: TimeScale;
	yTop: number;
	start: Date;
	end: Date;
};

export const AxisLabels = observer<AxisLabelProps>(({ xScale, yTop, start, end }) => {
	const { tickDates, formatter } = createTicksWithFormatter(xScale);
	const edgeLabelFormatter = durationFormatter(start, end);

	const yMiddle = yTop + X_AXIS_LABELS_HEIGHT / 2;
	const axisY = yTop + 1;
	return (
		<g>
			<line x1={xScale(start)} x2={xScale(end)} y1={axisY} y2={axisY} css={lineStyles} />
			{tickDates.map((date) => {
				const x = xScale(date);

				return (
					<Fragment key={date.toISOString()}>
						<line x1={x} x2={x} y1={axisY} y2={axisY + 4} css={lineStyles} />
						<text y={yMiddle} x={x} css={baseLabelStyles}>
							{formatter(date)}
						</text>
					</Fragment>
				);
			})}
			{/*  Start */}
			<EdgeLabel xScale={xScale} axisY={axisY} yMiddle={yMiddle} formatter={edgeLabelFormatter} time={start} isLeft />
			<EdgeLabel xScale={xScale} axisY={axisY} yMiddle={yMiddle} formatter={edgeLabelFormatter} time={end} />
		</g>
	);
});

type EdgeLabelProps = ComponentProps<'div'> & {
	isLeft?: boolean;
	time: Date;
	xScale: TimeScale;
	axisY: number;
	yMiddle: number;
	formatter?: string;
};

const EdgeLabel = observer<EdgeLabelProps>(
	({ isLeft = false, time, xScale, axisY, yMiddle, formatter = dateFormat }) => {
		const ref = useRef<SVGTextElement>(null);
		const [{ width, height }, setSize] = useState({ width: null as number | null, height: null as number | null });
		const store = useStore();
		useLayoutEffect(() => {
			const text = ref?.current;
			if (text) {
				const rect = text.getBoundingClientRect();
				setSize({
					height: rect.height,
					width: rect.width,
				});
			}
		}, [time]);

		const x = xScale(time) + ((isLeft ? 1 : -1) * LINE_WIDTH) / 2;

		const gradientKey = time.toISOString();
		const stopColor = TIMELINE_BG_COLOR;
		const gradientRectWidth = (width ?? 0) + 30;

		return (
			<>
				<defs>
					{/* does this linear gradient appear? */}
					{/* Yes, it's used for the fade out effect (see BLDSTRIKE-184) */}
					<linearGradient id={gradientKey} x1={isLeft ? '100%' : '0%'} y1="0%" x2={isLeft ? '0%' : '100%'} y2="0%">
						<stop offset="0%" style={{ stopColor, stopOpacity: 0 }} />
						<stop offset="40%" style={{ stopColor, stopOpacity: 1 }} />
					</linearGradient>
				</defs>
				{width && height && (
					<rect
						x={isLeft ? 0 : x - gradientRectWidth}
						y={axisY + 4}
						height={height}
						width={isLeft ? gradientRectWidth + TIMELINE_PADDING.LEFT : gradientRectWidth + TIMELINE_PADDING.RIGHT}
						fill={`url(#${gradientKey})`}
					/>
				)}
				<line x1={x} x2={x} y1={axisY} y2={axisY + 4} css={lineStyles} />
				<text ref={ref} y={yMiddle} x={x} css={[baseLabelStyles, edgeLabelStyles, isLeft && leftEdgeLabelOverrideStyles]}>
					{store.settings.momentTz(time).format(formatter)}
				</text>
			</>
		);
	}
);

const lineStyles = css`
	stroke: ${Tokens.CoreTokens.TextDisabled};
	stroke-width: ${LINE_WIDTH}px;
`;

const baseLabelStyles = css`
	dominant-baseline: central;
	text-anchor: middle;
	fill: ${Tokens.TextColors.PtTextColorDisabled};
	font-weight: 700;
	font-size: 0.8rem;
`;

const edgeLabelStyles = css`
	fill: ${Tokens.TextColors.PtTextColor};
	text-anchor: end;
`;

const leftEdgeLabelOverrideStyles = css`
	text-anchor: start;
`;

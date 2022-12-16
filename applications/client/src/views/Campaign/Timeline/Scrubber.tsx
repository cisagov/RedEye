import { css } from '@emotion/react';
import { useStore } from '@redeye/client/store';
import { Tokens } from '@redeye/ui-styles';
import type { ScaleTime } from 'd3';
import { debounce } from 'throttle-debounce';
import { observer } from 'mobx-react-lite';
import type { MutableRefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { AnimatedValue, ForwardedProps, SetUpdateFn } from 'react-spring';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { durationFormatter } from '@redeye/client/components';
import { PARTIAL_HEIGHT_LINE, X_AXIS_LABELS_HEIGHT } from './timeline-static-vars';
import type { IBar, IDimensions } from './TimelineChart';

type ScrubberProps = {
	setScrubberTime: (Date) => void;
	bars: IBar[];
	scrubberTime: Date;
	xScale: ScaleTime<number, number>;
	dimensions: IDimensions;
	start: Date;
	end: Date;
};

export const Scrubber = observer<ScrubberProps>(
	({ setScrubberTime, bars, scrubberTime, xScale, dimensions, start, end }) => {
		const store = useStore();
		const grabberTimeFormatter = durationFormatter(start, end);
		const [grabberTime, setGrabberTime] = useState<Date | undefined>(undefined);

		const grabberTimeStr = useMemo(
			() => store.settings.momentTz(grabberTime).format(grabberTimeFormatter) || '',
			[grabberTime, grabberTimeFormatter]
		);

		// Debounced is not really needed since the value is only updated when the user is done dragging
		const setScrubberTimeDebounced = useMemo(
			() =>
				debounce(250, (time?: Date) => {
					if (time) store.campaign?.timeline.setScrubberTimeExact(time);
				}),
			[setScrubberTime]
		);

		// Calculate scrubber properties
		const x = xScale(scrubberTime) ?? 0;
		const circleY = dimensions.height - X_AXIS_LABELS_HEIGHT / 2;
		type DS = { x: number }; // TODO: figure out why the overload isn't matching the react-springs type properly
		const [spring, set] = useSpring(() => ({
			// I don't think either of the below things are working
			from: { x },
			config: {
				// Make the scrubber move faster 🤞
				mass: 1,
				tension: 500,
				friction: 40,
			},
			// the below makes the typescript compiler happy. I think something might be wrong with useSpring's types
		})) as unknown as [AnimatedValue<ForwardedProps<DS>>, SetUpdateFn<DS>];

		// Temporary x for non-react lifecycle operations
		const currentX = useRef(x);
		useEffect(() => {
			// TempX needs to be kept up-to-date with proper x
			currentX.current = x;
			set({ x, immediate: false });
		}, [x]);

		const bind = useGesture({
			onDrag: ({ movement: [xDelta], event }) => {
				event.preventDefault();
				const rounded = calculateNewX(currentX, xDelta, bars, xScale);

				// Update the spring
				// @ts-ignore
				set({ x: rounded, xTxt: rounded - grabberTimeStr.length * 3.3, immediate: true });
				setGrabberTime(xScale.invert(rounded as unknown as number));
			},
			onDragEnd: ({ movement: [xDelta] }) => {
				const rounded = calculateNewX(currentX, xDelta, bars, xScale);

				currentX.current = rounded as unknown as number;
				setScrubberTimeDebounced(xScale.invert(rounded as unknown as number));
				setGrabberTime(undefined);
			},
		});

		const disableControls = store.campaign.presentation.isPresenting;

		return (
			<>
				<animated.line
					cy-test="timeline-animated-line"
					x1={spring.x}
					y1={0}
					x2={spring.x}
					y2={dimensions.height}
					css={fullHeightLine}
				/>
				<animated.line
					x1={spring.x}
					y1={PARTIAL_HEIGHT_LINE.TOP}
					x2={spring.x}
					y2={dimensions.height - PARTIAL_HEIGHT_LINE.BOTTOM}
					css={partialHeightLine}
				/>
				<g {...bind()} css={grabberWrapperStyles} style={disableControls ? { display: 'none' } : {}}>
					<animated.circle cx={spring.x} cy={circleY} r={5} css={bigCircleStyles} />
					<animated.circle cx={spring.x} cy={circleY} r={1} css={smallCircleStyles} />
					<animated.circle cx={spring.x} cy={circleY} r={10} css={grabberCircleStyles} />
				</g>
				{grabberTime && (
					<animated.text
						// @ts-ignore
						x={spring.xTxt || spring.x}
						y={circleY + 25}
						css={grabberTxtStyles}
					>
						{grabberTimeStr}
					</animated.text>
				)}
			</>
		);
	}
);

function calculateNewX(
	currentX: MutableRefObject<number>,
	xDelta: [number, number][0],
	bars: IBar[],
	xScale: ScaleTime<number, number>
) {
	const x = currentX?.current;
	const newX = x + xDelta;

	let rounded: number | null = null;
	let roundedDiff = Infinity;
	bars.forEach(({ end }) => {
		const endX = xScale(end);
		const distance = Math.abs(newX - endX);
		if (distance <= roundedDiff) {
			rounded = endX;
			roundedDiff = distance;
		}
	});
	return rounded;
}

const fullHeightLine = css`
	stroke: ${Tokens.TextColors.PtTextColorMuted};
	stroke-width: 1px;
`;

const partialHeightLine = css`
	stroke: ${Tokens.TextColors.PtTextColor};
	stroke-width: 1px;
`;

const bigCircleStyles = css`
	stroke-width: 1px;
	stroke: ${Tokens.IntentColors.PtIntentPrimaryActive};
	fill: ${Tokens.IntentColors.PtIntentPrimary};
`;

const smallCircleStyles = css`
	fill: ${Tokens.IntentColors.PtIntentPrimary};
`;

const grabberCircleStyles = css`
	fill: transparent;
`;

const grabberWrapperStyles = css`
	cursor: ew-resize;
`;

const grabberTxtStyles = css`
	stroke: ${Tokens.TextColors.PtTextColorMuted};
	font-size: 0.7rem;
`;

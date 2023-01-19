import { css } from '@emotion/react';
import { useStore } from '@redeye/client/store';
import { AdvancedTokens, CoreTokens } from '@redeye/ui-styles';
import type { ScaleTime } from 'd3';
import { debounce } from 'throttle-debounce';
import { observer } from 'mobx-react-lite';
import type { MutableRefObject } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { AnimatedValue, ForwardedProps, SetUpdateFn } from 'react-spring';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { PARTIAL_HEIGHT_LINE, X_AXIS_LABELS_HEIGHT } from './timeline-static-vars';
import type { IBar, IDimensions } from './TimelineChart';

type ScrubberProps = {
	setScrubberTime: (Date) => void;
	bars: IBar[];
	scrubberTime: Date;
	xScale: ScaleTime<number, number>;
	dimensions: IDimensions;
	setGrabberTime: any;
	setGrabberTimeMarginLeft: (number) => void;
	grabberTimeLabel: string;
};

export const Scrubber = observer<ScrubberProps>(
	({
		setScrubberTime,
		bars,
		scrubberTime,
		xScale,
		dimensions,
		setGrabberTime,
		grabberTimeLabel,
		setGrabberTimeMarginLeft,
	}) => {
		const store = useStore();

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
				set({ x: rounded, immediate: true });
				setGrabberTime(xScale.invert(rounded as unknown as number));
				setGrabberTimeMarginLeft((rounded as unknown as number) - (grabberTimeLabel.length || 8) * 4);
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
	stroke: ${CoreTokens.TextMuted};
	stroke-width: 1px;
`;

const partialHeightLine = css`
	stroke: ${CoreTokens.TextBody};
	stroke-width: 1px;
`;

const bigCircleStyles = css`
	stroke-width: 1px;
	stroke: ${AdvancedTokens.PtIntentPrimaryActive};
	fill: ${AdvancedTokens.PtIntentPrimary};
`;

const smallCircleStyles = css`
	fill: ${AdvancedTokens.PtIntentPrimary};
`;

const grabberCircleStyles = css`
	fill: transparent;
`;

const grabberWrapperStyles = css`
	cursor: ew-resize;
`;

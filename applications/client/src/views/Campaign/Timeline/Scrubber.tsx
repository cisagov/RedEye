import { css } from '@emotion/react';
import { useStore } from '@redeye/client/store';
import { AdvancedTokens, CoreTokens } from '@redeye/ui-styles';
import type { ScaleTime } from 'd3';
import { debounce } from 'throttle-debounce';
import { observer } from 'mobx-react-lite';
import type { MutableRefObject } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
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

		const circleY = dimensions.height - X_AXIS_LABELS_HEIGHT / 2;

		const xState = xScale(scrubberTime) ?? 0;
		const [xVisual, setXVisual] = useState(xState); // x for updating the scrubber svg position
		const xCurrent = useRef(xState); // Temporary x for non-react lifecycle operations

		useEffect(() => {
			// xCurrent and xVisual need to be kept up-to-date with proper xState
			xCurrent.current = xState;
			setXVisual(xState);
		}, [xState]);

		const bind = useGesture({
			onDrag: ({ movement: [xDelta], event }) => {
				event.preventDefault();
				const rounded = calculateNewX(xCurrent, xDelta, bars, xScale);
				setXVisual(rounded);
				setGrabberTime(xScale.invert(rounded));
				setGrabberTimeMarginLeft(rounded - (grabberTimeLabel.length || 8) * 4);
			},
			onDragEnd: ({ movement: [xDelta] }) => {
				const rounded = calculateNewX(xCurrent, xDelta, bars, xScale);
				xCurrent.current = rounded;
				setScrubberTimeDebounced(xScale.invert(rounded));
				setGrabberTime(undefined);
			},
		});

		const disableControls = store.campaign.presentation.isPresenting;

		return (
			<g css={{ transform: `translateX(${Math.round(xVisual) + 0.5}px)`, transition: 'transform 100ms ease' }}>
				<line cy-test="timeline-animated-line" x1={0} y1={0} x2={0} y2={dimensions.height} css={fullHeightLine} />
				<line
					x1={0}
					y1={PARTIAL_HEIGHT_LINE.TOP}
					x2={0}
					y2={dimensions.height - PARTIAL_HEIGHT_LINE.BOTTOM}
					css={partialHeightLine}
				/>
				<g {...bind()} css={grabberWrapperStyles} style={disableControls ? { display: 'none' } : {}}>
					<circle cx={0} cy={circleY} r={5} css={bigCircleStyles} />
					<circle cx={0} cy={circleY} r={1} css={smallCircleStyles} />
					<circle cx={0} cy={circleY} r={10} css={grabberCircleStyles} />
				</g>
			</g>
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

	let rounded = 0;
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

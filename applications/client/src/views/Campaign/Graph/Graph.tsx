import { css } from '@emotion/react';
import { datePlaceholder, durationFormatter, ErrorFallback } from '@redeye/client/components';
import { CampaignLoadingMessage, useStore } from '@redeye/client/store';
import { CoreTokens, Header, Spacer, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useResizeDetector } from 'react-resize-detector';
import { nodeColorStyles } from './node-colors';
import { graphStyles } from './graph-styles';
import { GraphControls } from './GraphControls';
import { LoadingOverlay } from './LoadingOverlay';

type GraphProps = ComponentProps<'div'> & {};

export const Graph = observer<GraphProps>((props) => {
	const store = useStore();
	const graphRef = useRef<SVGSVGElement>(null);

	const {
		width: resizeWidth,
		height: resizeHeight,
		ref: resizeRef,
	} = useResizeDetector<HTMLDivElement>({
		refreshMode: 'throttle',
		refreshRate: 100,
	});
	useEffect(() => {
		store.campaign.graph?.resize();
	}, [resizeWidth, resizeHeight, store.campaign.graph]);

	useEffect(() => {
		if (graphRef.current && store.campaign.isLoading === CampaignLoadingMessage.DONE) {
			if (store.campaign.graph) {
				store.campaign.updateGraph();
			} else {
				store.campaign.createGraph(graphRef.current);
			}
		}
	}, [graphRef, store.campaign.isLoading]);

	const zoomControls = useMemo(
		() => ({
			zoomIn: () => store.campaign.graph?.zoomIn(),
			zoomOut: () => store.campaign.graph?.zoomOut(),
			zoomToFit: () => store.campaign.graph?.zoomToFit(),
			exportSVG: () => store.campaign.graph?.exportSVG(CoreTokens.Background3),
		}),
		[]
	);

	const currentMoment = store.settings.momentTz(store.campaign.timeline?.scrubberTime as Date);
	const { startTime, endTime } = store.campaign.timeline;
	const formatter = durationFormatter(startTime, endTime);
	const currentFormattedTime = formatter ? currentMoment.format(formatter) : datePlaceholder;

	return (
		<div cy-test="graph" css={wrapperStyles} ref={resizeRef} onPointerDown={closePopovers} {...props}>
			<Header small css={headerStyles}>
				<Txt>Beacon Graph</Txt>
				<Txt muted normal monospace medium>
					<Spacer>•</Spacer>
					{store.campaign.timeline.isShowingAllTime ? 'All Time' : currentFormattedTime}
				</Txt>
			</Header>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				{(!!store.campaign?.isLoading && store.campaign?.isLoading !== CampaignLoadingMessage.DONE) ||
				!!store.campaign?.error ? (
					<LoadingOverlay />
				) : null}
				<svg
					css={[graphLayoutStyles, graphStyles, nodeColorStyles]}
					ref={graphRef}
					className={store.settings.theme === 'dark' ? ThemeClasses.DARK : ThemeClasses.LIGHT}
				/>
				<GraphControls {...zoomControls} css={controlsStyles} />
			</ErrorBoundary>
		</div>
	);
});

const wrapperStyles = css`
	position: relative;
	display: grid;
`;

const headerStyles = css`
	margin: 0.75rem 2rem;
	justify-self: start;
	align-self: start;
	z-index: 1;
`;

const graphLayoutStyles = css`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	height: 100%;
	width: 100%;
`;

const controlsStyles = css`
	position: absolute;
	top: 0;
	right: 0;
	margin: 1rem;
`;

const closePopovers = () => {
	// The graph's d3.zoom handler eats the mousedown event that our popper.js & blueprint.Popover listen to to know when to close.
	// We need to recreate this event by tieing to the similar pointerdown event
	document.dispatchEvent(new Event('mousedown'));
};

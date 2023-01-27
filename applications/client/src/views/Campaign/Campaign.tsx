import type { ButtonProps } from '@blueprintjs/core';
import { Button, HotkeysTarget2, Spinner } from '@blueprintjs/core';
import { ChevronLeft16, ChevronRight16 } from '@carbon/icons-react';
import { css, Global } from '@emotion/react';
import { AuthCheck, CarbonIcon, DragResize, ErrorFallback, NavBar } from '@redeye/client/components';
import {
	beaconQuery,
	CampaignLoadingMessage,
	commandTypeCountModelPrimitives,
	hostQuery,
	linkQuery,
	operatorModelPrimitives,
	serverQuery,
	useStore,
} from '@redeye/client/store';
import { RedEyeRoutes } from '@redeye/client/store/routing/router';
import { Graph, RawLogsDialog, Timeline } from '@redeye/client/views';
import type { TxtProps } from '@redeye/ui-styles';
import { CoreTokens, CardStyled, UtilityStyles, Spacer, Txt } from '@redeye/ui-styles';
import { useQueries } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, FC } from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';

type CampaignProps = ComponentProps<'div'> & {};

const Explore = lazy(() => import('./Explore/Explore'));
const Presentation = lazy(() => import('./Presentation/Presentation'));

const Campaign = observer<CampaignProps>(() => {
	const store = useStore();

	const queries = useQueries({
		queries: [
			{
				queryKey: ['campaign', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryServers(
						{
							campaignId: store.campaign?.id!,
							username: store.auth.userName!,
							hidden: store.settings.showHidden,
						},
						serverQuery
					),
				enabled: !!store.campaign.fetchEnabled,
			},
			{
				queryKey: ['beacons', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryBeacons(
						{
							campaignId: store.campaign?.id!,
							hidden: store.settings.showHidden,
						},
						beaconQuery
					),
				enabled: !!store.campaign.fetchEnabled,
			},
			{
				queryKey: ['links', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryLinks(
						{
							campaignId: store.campaign?.id!,
							hidden: store.settings.showHidden,
						},
						linkQuery
					),
				enabled: !!store.campaign.fetchEnabled,
			},
			{
				queryKey: ['commandCount', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryCommandTypes(
						{
							campaignId: store.campaign?.id!,
							hidden: store.settings.showHidden,
						},
						commandTypeCountModelPrimitives.toString()
					),
				enabled: !!store.campaign.fetchEnabled,
			},
			{
				queryKey: ['hosts', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryHosts(
						{
							campaignId: store.campaign?.id!,
							hidden: store.settings.showHidden,
						},
						hostQuery
					),
				enabled: !!store.campaign.fetchEnabled,
			},
			{
				queryKey: ['operators', store.campaign?.id],
				queryFn: async () =>
					await store.graphqlStore.queryOperators(
						{
							campaignId: store.campaign?.id!,
							hidden: store.settings.showHidden,
						},
						operatorModelPrimitives.toString()
					),
				enabled: !!store.campaign.fetchEnabled,
			},
		],
	});

	const hotkeys = [
		{
			combo: 'mod+K',
			global: true,
			label: 'Open Search Modal',
			onKeyDown: (event) => {
				event.preventDefault();
				store.campaign.search.openSearch();
			},
		},
	];

	useEffect(
		() => () => {
			store.campaign.graph = undefined;
		},
		[]
	);

	useEffect(() => {
		if (store.campaign.fetchEnabled) {
			store.campaign.setIsLoading(CampaignLoadingMessage.GET_DATA);
			if (queries.length && queries.every((d) => d.isSuccess && !d.isFetching)) {
				store.campaign.setIsLoading(CampaignLoadingMessage.GRAPH);
				store.graphqlStore?.servers?.forEach((server) => server.buildServerStats());
				store.campaign.setIsLoading(CampaignLoadingMessage.DONE);
				store.campaign.setFetchEnabled(false);
			}
		}
	}, [queries]);

	return (
		<HotkeysTarget2 hotkeys={hotkeys}>
			<div css={wrapperStyle}>
				<Global styles={HTMLbodyStyles} />
				{store.appMeta.blueTeam ? null : <AuthCheck />}
				<RawLogsDialog />
				<NavBar css={navBarStyles} />
				<DragResize
					css={dragResizeStyle}
					fixedCollapsedContent={({ reset }) => (
						<CollapsedContent
							css={css`
								cursor: e-resize;
								box-shadow: ${CoreTokens.Elevation2};
							`}
							onClick={reset}
							icon={<CarbonIcon icon={ChevronRight16} />}
						>
							<NavTitle />
						</CollapsedContent>
					)}
					fluidCollapsedContent={({ reset }) => (
						<CollapsedContent
							css={css`
								background-color: unset;
								cursor: w-resize;
							`}
							onClick={reset}
							icon={<CarbonIcon icon={ChevronLeft16} />}
						>
							<Txt ellipsize>Timeline &amp; Node Graph</Txt>
						</CollapsedContent>
					)}
					fixedContent={({ collapseFixed }) => (
						<div css={infoWrapperStyles}>
							<div css={titleBarStyles}>
								<NavTitle />
								<Button cy-test="collapse-panel" icon={<CarbonIcon icon={ChevronLeft16} />} onClick={collapseFixed} minimal />
							</div>
							<Suspense fallback={<Spinner />}>
								<Routes>
									<Route path={`${RedEyeRoutes.CAMPAIGN_EXPLORE}/*`} element={<Explore />} />
									<Route path={`${RedEyeRoutes.CAMPAIGN_PRESENTATION}/*`} element={<Presentation />} />
								</Routes>
							</Suspense>
							{/* <Search /> */}
						</div>
					)}
					fluidContent={({}) => (
						<div css={visPanelStyles}>
							<CardStyled elevation={2} css={timelineStyles}>
								<ErrorBoundary FallbackComponent={ErrorFallback}>
									<Timeline cy-test="timeline" />
								</ErrorBoundary>
							</CardStyled>
							<Graph />
						</div>
					)}
				/>
			</div>
		</HotkeysTarget2>
	);
});

// eslint-disable-next-line import/no-default-export
export default Campaign; // need this for router

const HTMLbodyStyles = css`
	body {
		overflow: hidden;
	}
`;
const wrapperStyle = css`
	display: grid;
	grid-template-columns: auto 1fr;
	${UtilityStyles.fillNoOverflowStyle}
`;
const navBarStyles = css`
	border-right: 1px solid ${CoreTokens.BorderNormal};
`;
const dragResizeStyle = css`
	${UtilityStyles.fillNoOverflowStyle}
`;
const infoWrapperStyles = css`
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: auto 1fr;
	background-color: ${CoreTokens.Background1};
	box-shadow: ${CoreTokens.Elevation2};
	${UtilityStyles.fillNoOverflowStyle}
`;
const titleBarStyles = css`
	padding: 0.5rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
`;

const visPanelStyles = css`
	display: grid;
	grid-template-rows: auto 1fr;
	${UtilityStyles.fillNoOverflowStyle}
`;
const timelineStyles = css`
	margin: 1rem 1rem 0 1rem;
	overflow: hidden;
`;

type CollapsedContentProps = ComponentProps<'div'> & ButtonProps & {};

export const CollapsedContent: FC<CollapsedContentProps> = ({ children, icon, ...props }) => (
	<div {...props} css={collapsedContentWrapperStyle}>
		<Button
			icon={icon}
			// onClick={onClick}
			minimal
		/>
		<div css={collapsedContentTextStyle}>{children}</div>
	</div>
);
const collapsedContentWrapperStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0.5rem;
	background-color: ${CoreTokens.Background1};
	height: 100%;
	width: 100%;
	cursor: pointer;
`;
const collapsedContentTextStyle = css`
	transform: rotate(90deg);
	transform-origin: center left;
	max-width: 1px;
	overflow: visible;
`;

type NavTitleProps = TxtProps & {};
export const NavTitle = observer<NavTitleProps>(({ ...props }) => {
	const store = useStore();
	const campaign = store.graphqlStore.campaigns.get(store.router.params?.id as string);
	const navigationLocation = store.router.params.view; // TODO: from router
	return (
		<Txt bold ellipsize {...props}>
			<Txt bold>{campaign?.name || 'CurrentCampaign'}</Txt>
			<Spacer>{' / '}</Spacer>
			<Txt
				muted
				css={css`
					text-transform: capitalize;
				`}
			>
				{navigationLocation}
			</Txt>
		</Txt>
	);
});

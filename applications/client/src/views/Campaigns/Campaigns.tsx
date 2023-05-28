import { Button } from '@blueprintjs/core';
import { Add16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { AuthCheck, CarbonIcon, ErrorFallback, ExpandingSearchBox, AppHeader } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CampaignModel } from '@redeye/client/store';
import { parserInfoModelPrimitives, useStore } from '@redeye/client/store';
import { CampaignCard, NewCampaignDialog } from '@redeye/client/views';
import { FlexSplitter, Header, Txt } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type CampaignsProps = ComponentProps<'div'> & {};

const Campaigns = observer<CampaignsProps>(() => {
	const store = useStore();
	const campaignQuery = useQuery(['campaigns'], async () => await store.graphqlStore.queryCampaigns());
	useQuery(
		['parsers'],
		async () =>
			await store.graphqlStore.queryParserInfo(
				{},
				parserInfoModelPrimitives
					.uploadForm((up) =>
						up.enabledInBlueTeam.tabTitle
							.fileUpload((fileUp) => fileUp.type.validate.acceptedExtensions.description)
							.fileDisplay((fileDis) => fileDis.description.editable)
					)
					.toString()
			)
	);
	const state = createState({
		openAddCampaign: false,
		search: '',
		get currentCampaign(): CampaignModel | undefined {
			return Array.from(store.graphqlStore.campaigns.values()).find(
				(campaign: CampaignModel) => campaign.id === store.router.params?.id && store.router.params?.id !== 'all'
			);
		},
		get otherCampaigns(): CampaignModel[] {
			return Array.from(store.graphqlStore.campaigns.values()).filter(
				(campaign: CampaignModel) =>
					campaign.id !== store.router.params?.id && campaign.name?.toLowerCase().includes(this.search.toLowerCase())
			);
		},
	});
	useEffect(() => {
		if (campaignQuery.isFetched) {
			campaignQuery.data?.campaigns.forEach((campaign) => {
				if (campaign.isParsing) campaign.processServers();
			});
		}
	}, [campaignQuery.isFetched]);

	return (
		<div css={wrapperStyle}>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				{store.appMeta.blueTeam ? null : <AuthCheck />}
				<AppHeader css={headerStyle} />
				<div css={titleBarStyle}>
					<Header large>Campaigns</Header>
					<FlexSplitter />
					<ExpandingSearchBox
						value={state.search}
						onChange={(e) => state.update('search', e.target.value)}
						onClear={() => state.update('search', '')}
						cy-test="search"
						placeholder="Search…"
						large
						css={expandingSearchBoxStyle}
					/>
					<Button
						cy-test="add-campaign-btn"
						intent="primary"
						onClick={() => state.update('openAddCampaign', true)}
						text="Add a campaign"
						rightIcon={<CarbonIcon icon={Add16} />}
						large
						css={addNewButtonStyle}
					/>
				</div>
				{!state.currentCampaign && state.otherCampaigns.length < 1 && (
					<Txt disabled large italic>
						No Campaigns
					</Txt>
				)}
				{state.currentCampaign && (
					<>
						<Txt tagName="h3" meta small css={metaTitleStyle}>
							Current Campaign
						</Txt>
						<CampaignCard isCurrent campaign={state.currentCampaign} />
					</>
				)}
				{state.otherCampaigns.length > 0 && (
					<>
						<Txt tagName="h3" meta small css={metaTitleStyle}>
							{state.currentCampaign ? 'Other' : ''} Campaigns
						</Txt>
						{state.otherCampaigns.map((campaign) => (
							<CampaignCard
								key={`${campaign.id}${campaign.firstLogTime}${campaign.lastLogTime}`}
								campaign={campaign}
								cy-test={`${campaign.id}${campaign.firstLogTime}${campaign.lastLogTime}`}
							/>
						))}
					</>
				)}
			</ErrorBoundary>
			<NewCampaignDialog open={state.openAddCampaign} onClose={() => state.update('openAddCampaign', false)} />
		</div>
	);
});

const wrapperStyle = css`
	margin: 0 auto;
	max-width: 50rem;
	padding: 2rem;
`;
const headerStyle = css`
	margin: 6rem 0 2rem;
`;
const titleBarStyle = css`
	display: flex;
	align-items: center;
`;
const expandingSearchBoxStyle = css`
	flex: 1 0 auto;
	margin-left: 0.5rem;
`;
const addNewButtonStyle = css`
	margin-left: 0.5rem;
	flex: 0 0 auto;
`;
const metaTitleStyle = css`
	margin: 2rem 0 1rem;
`;

// eslint-disable-next-line import/no-default-export
export default Campaigns;

import { Alert, Button, ButtonGroup, Card, Classes, Intent, Menu, ProgressBar } from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { ArrowRight16, Edit16, Export16, OverflowMenuHorizontal16, TrashCan16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, dateFormat, HoverButton } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CampaignModel } from '@redeye/client/store';
import { ParsingStatus, useStore } from '@redeye/client/store';
import { routes } from '@redeye/client/store/routing/router';
import { CampaignViews, Views } from '@redeye/client/types';
import { Tabs } from '@redeye/client/types/explore';
import { RenameDialog } from '@redeye/client/views/Campaigns/RenameDialog';
import { Header, Spacer, CoreTokens, Txt } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { AnonymizeDialog } from './AnonymizeDialog/AnonymizeDialog';

type CampaignCardProps = ComponentProps<'div'> & {
	campaign: CampaignModel;
	isCurrent?: boolean;
};

export const CampaignCard = observer<CampaignCardProps>(({ isCurrent, campaign }) => {
	const store = useStore();

	const deleteCampaign = useMutation(
		async (campaignId: string) => await store.graphqlStore.mutateDeleteCampaign({ campaignId }),
		{
			onSuccess: (_, campaignId) => {
				store.graphqlStore.campaigns.delete(campaignId);
				store.queryClient.refetchQueries(['campaigns']);
				if (store.router.params.id === campaignId) {
					store.router.updateRoute({
						path: routes[Views.CAMPAIGNS_LIST],
						params: { id: 'all' },
						clear: true,
					});
				}
			},
		}
	);

	const state = createState({
		isRenameOpen: false,
		isExportOpen: false,
		isDeletePromptOpen: false,
		viewCampaign() {
			store.router.updateRoute({
				path: routes[CampaignViews.EXPLORE],
				params: {
					id: campaign.id,
					view: CampaignViews.EXPLORE,
					tab: Tabs.HOSTS,
					currentItem: 'all',
				},
			});
		},
		deleteCampaign(e) {
			e.stopPropagation();
			deleteCampaign.mutate(campaign.id);
		},
		get startTime() {
			const start = store.settings.momentTz(campaign.firstLogTime);
			return start.isValid() ? start.format(dateFormat) : campaign.firstLogTime;
		},
		get endTime() {
			const start = store.settings.momentTz(campaign.lastLogTime);
			return start.isValid() ? start.format(dateFormat) : campaign.lastLogTime;
		},
	});

	return (
		<>
			<Card
				cy-test="campaign-card"
				onClick={
					!campaign.isParsing && campaign.parsingStatus !== ParsingStatus.PARSING_FAILURE ? state.viewCampaign : () => {}
				}
				interactive={!campaign.isParsing && campaign.parsingStatus !== ParsingStatus.PARSING_FAILURE}
				tabIndex={0}
				css={[
					rootCardStyle,
					css`
						border-width: ${isCurrent ? '2px' : '0'};
					`,
				]}
			>
				{campaign.parsingStatus === ParsingStatus.PARSING_FAILURE ? (
					<div css={infoWrapperStyle}>
						<div
							css={css`
								margin: 1.5rem 1.5rem 0.75rem;
							`}
						>
							<Header
								medium
								css={css`
									margin-bottom: 0.25rem;
								`}
								cy-test="campaign-name"
							>
								{campaign.name}
							</Header>
							<Txt
								block
								bold
								css={css`
									color: var(--pt-intent-danger);
								`}
							>
								An error occurred while parsing
							</Txt>
							<Txt
								block
								css={css`
									color: var(--pt-intent-danger);
								`}
							>
								Please try again or consult the parsing logs for additional information
							</Txt>
						</div>
						<HoverButton
							intent={Intent.DANGER}
							rightIcon={<CarbonIcon icon={TrashCan16} />}
							text="Delete"
							minimal
							large
							onClick={(e) => {
								e.stopPropagation();
								state.deleteCampaign(e);
							}}
							hoverProps={{
								minimal: false,
							}}
						/>
					</div>
				) : (
					<div css={infoWrapperStyle}>
						<div
							css={css`
								margin: 1.5rem 1.5rem 0.75rem;
							`}
						>
							<Header
								medium
								css={css`
									margin-bottom: 0.25rem;
								`}
								cy-test="campaign-name"
							>
								{campaign.name}
							</Header>

							<Txt
								muted
								skeleton={campaign.isParsing}
								block
								css={css`
									margin-bottom: 0.75rem;
								`}
							>
								<Txt>Last opened by:</Txt>
								<Txt cy-test="last-opened-by" bold>
									{campaign.lastOpenedBy?.id ?? 'None'}
								</Txt>
							</Txt>
							<Txt meta muted small block>
								<Txt cy-test="campaign-dates" bold skeleton={campaign.isParsing}>
									{state.startTime}&mdash;{state.endTime}
								</Txt>
								<Spacer>•</Spacer>
								<Txt cy-test="comment-count" skeleton={campaign.isParsing}>
									<Txt bold>{campaign.annotationCount}</Txt> Comments
								</Txt>
								<Spacer>•</Spacer>
								<Txt cy-test="beacon-count" skeleton={campaign.isParsing}>
									<Txt bold>{campaign.beaconCount}</Txt> Beacons
								</Txt>
								<Spacer>•</Spacer>
								<Txt cy-test="command-count" skeleton={campaign.isParsing}>
									<Txt bold>{campaign.commandCount}</Txt> Commands
								</Txt>
							</Txt>
						</div>

						<ButtonGroup
							css={actionButtonsStyle}
							onClick={(e) => e.stopPropagation()} // prevent extra options from opening campaign
						>
							<Popover2
								css={css`
									flex: unset !important;
								`}
								content={
									<Menu>
										<MenuItem2
											cy-test="delete-campaign"
											text="Delete"
											icon={<CarbonIcon icon={TrashCan16} />}
											onClick={() => state.update('isDeletePromptOpen', true)}
										/>
										<MenuItem2
											cy-test="rename-campaign"
											text="Rename"
											disabled={campaign.isParsing}
											icon={<CarbonIcon icon={Edit16} />}
											onClick={() => state.update('isRenameOpen', true)}
											// disabled
										/>
										<MenuItem2
											cy-test="export-campaign"
											text="Export"
											disabled={campaign.isParsing}
											icon={<CarbonIcon icon={Export16} />}
											onClick={() => state.update('isExportOpen', true)}
										/>
									</Menu>
								}
							>
								<Button cy-test="campaign-options" icon={<CarbonIcon icon={OverflowMenuHorizontal16} />} minimal large />
							</Popover2>
							{!campaign.isParsing && (
								<HoverButton
									text={isCurrent ? 'Return' : 'Open'}
									rightIcon={<CarbonIcon icon={ArrowRight16} />}
									onClick={state.viewCampaign}
									intent="primary"
									minimal
									large
									hoverProps={{
										minimal: false,
									}}
								/>
							)}
						</ButtonGroup>
					</div>
				)}
				{campaign.isParsing && (
					<div>
						<Txt
							block
							css={css`
								margin: 0 1.5rem 0.5rem;
							`}
						>
							<Txt bold>Importing...</Txt>
							<Spacer />
							<Txt>
								{campaign.parsingStatus === ParsingStatus.PARSING_IN_PROGRESS
									? 'This could take several minutes...'
									: 'Queued for parsing...'}
							</Txt>
						</Txt>
						<ProgressBar intent="primary" />
					</div>
				)}
			</Card>
			<Alert
				isOpen={state.isDeletePromptOpen}
				onClose={() => state.update('isDeletePromptOpen', false)}
				onConfirm={state.deleteCampaign}
				confirmButtonText="Delete Campaign"
				cancelButtonText="Cancel"
				intent={Intent.DANGER}
				canOutsideClickCancel
				canEscapeKeyCancel
			>
				Are you sure you want to delete this campaign?
			</Alert>
			{state.isRenameOpen && <RenameDialog onClose={() => state.update('isRenameOpen', false)} campaign={campaign} />}
			<AnonymizeDialog
				isOpen={state.isExportOpen}
				onClose={() => state.update('isExportOpen', false)}
				campaign={campaign}
			/>
		</>
	);
});

const rootCardStyle = css`
	padding: 0;
	margin: 2px 0;
	position: relative; /* for z-index stacking */
	z-index: 0;

	&:hover,
	&:focus,
	&:focus-within {
		z-index: 1;
	}

	border: 0 solid ${CoreTokens.Background1};

	&&& {
		background-color: ${CoreTokens.Background1};
	}

	// &.${Classes.INTERACTIVE}:hover { // ts-styled-plugin(9999) error !?
	&.bp4-interactive:hover {
		background-color: ${CoreTokens.Background1};
	}
`;

const actionButtonsStyle = css`
	flex: 1 0 auto;
	justify-content: flex-end;
`;

const infoWrapperStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	flex-wrap: wrap;
`;

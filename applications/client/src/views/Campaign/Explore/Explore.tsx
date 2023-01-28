import { Button, Classes, Intent, Tab } from '@blueprintjs/core';
import { Launch16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, customIconPaths, Flex, ScrollBox } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { SortDirection, useStore } from '@redeye/client/store';
import { InfoType, Tabs } from '@redeye/client/types/explore';
import { TabsStyled, Txt, CoreTokens, ThemeClasses } from '@redeye/ui-styles';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useCallback, useEffect } from 'react';
import { AddToCommandGroupDialog, ControlBar, NavBreadcrumbs } from './components';
import { InfoPanelTabs, TabNames } from './Panels';

enum Filters {
	ALL = 'all',
}

type InfoProps = ComponentProps<'div'> & {};

export const Explore = observer<InfoProps>(({ ...props }) => {
	const store = useStore();
	const tab = (store.router.params.tab as Tabs) || Tabs.BEACONS;
	const state = createState({
		search: '',
		filter: Filters.ALL,
		ref: null as HTMLDivElement | null,
		infoPanelType: InfoType.OVERVIEW,
		get commandCount() {
			return store.campaign?.commentStore.selectedCommands.size || 0;
		},
	});

	useEffect(
		() =>
			autorun(() => {
				try {
					if (
						!store.campaign?.interactionState.selectedBeacon &&
						!store.campaign?.interactionState.selectedServer &&
						!store.campaign?.interactionState.selectedHost &&
						!store.campaign?.interactionState.selectedOperator &&
						!store.campaign?.interactionState.selectedCommandType
					) {
						state.update('infoPanelType', InfoType.OVERVIEW);
					} else if (store.campaign?.interactionState.selectedCommandType) {
						state.update('infoPanelType', InfoType.COMMAND);
					} else if (store.campaign?.interactionState.selectedOperator) {
						state.update('infoPanelType', InfoType.OPERATOR);
					} else if (store.campaign?.interactionState.selectedBeacon) {
						state.update('infoPanelType', InfoType.BEACON);
					} else if (store.campaign?.interactionState.selectedHost) {
						state.update('infoPanelType', InfoType.HOST);
					} else if (!store.campaign?.interactionState.selectedBeacon) {
						state.update('infoPanelType', InfoType.SERVER);
					}
					store.campaign.timeline.showAllTime();
				} catch (e) {
					window.console.log(e); // Try to catch if tab switching is stalling here - hard to reproduce
				}
			}),
		[]
	);

	const handleTabChange = useCallback(async (newTab: Tabs) => {
		await store.campaign?.setSelectedTab(newTab);
	}, []);

	useEffect(() => {
		store.campaign?.commentStore.setGroupSelect(false);
		store.campaign?.commentStore.clearSelectedCommand();
	}, [store.router.params.tab]);

	return (
		<div
			{...props}
			css={css`
				display: flex;
				flex-direction: column;
				overflow: hidden;
			`}
		>
			<div css={headerStyles}>
				<div cy-test="header">
					<NavBreadcrumbs cy-test="navigation-breadcrumbs" showCurrent />
					{InfoPanelTabs[state.infoPanelType].title(store)}
				</div>
				{state.infoPanelType === InfoType.BEACON && (
					<Button
						// Maybe this should go next to the right of the Tabs
						cy-test="openRawLogs"
						text="Raw Logs"
						rightIcon={<CarbonIcon icon={Launch16} />}
						intent="primary"
						css={css`
							margin: 0rem -0.5rem;
							flex: 0 0 auto;
						`}
						onClick={() => {
							store.router.updateQueryParams({
								queryParams: { 'raw-logs': `beacon-${store.campaign?.interactionState.selectedBeacon?.id}` },
							});
						}}
						small
						minimal
					/>
				)}
			</div>
			<TabsStyled
				css={css`
					.${Classes.TAB_LIST} {
						padding: 0 1rem;
					}
				`}
				renderActiveTabPanelOnly
				onChange={handleTabChange}
				selectedTabId={tab}
			>
				{Object.entries(InfoPanelTabs[state.infoPanelType].panels).map(([panelName, PanelRenderer]) => (
					<Tab
						key={panelName}
						cy-test={panelName}
						id={panelName}
						title={TabNames[panelName]}
						panel={
							<>
								<ControlBar
									type={tab}
									sortBy={store.campaign.sort.sortBy}
									setSortBy={(sort) => store.campaign.setSort(sort)}
									isAscending={store.campaign.sort.direction === SortDirection.ASC}
									toggleIsAscending={() => store.campaign.toggleIsAscending()}
									filter={state.filter}
									isCollapsible={store.router?.params.tab === Tabs.COMMANDS}
								/>
								{store.router?.params.tab === Tabs.COMMANDS &&
									state.infoPanelType !== InfoType.OVERVIEW &&
									store.campaign?.commentStore.groupSelect && (
										<div css={modeBarStyle}>
											<Txt>
												{state.commandCount} Command{state.commandCount === 1 ? '' : 's'} Selected
											</Txt>
											<Button
												cy-test="comment-on-commands"
												disabled={state.commandCount === 0}
												onClick={() => {
													const keys = Array.from(store.campaign?.commentStore.selectedCommands.keys());
													let foundElement = false;
													for (const key of keys) {
														const element = window.document.querySelector(`[data-command-id="${key}"]`);
														if (element) {
															foundElement = true;
															store.campaign?.commentStore.setCommentsOpen(key);
														}
													}
													if (!foundElement) {
														store.campaign?.commentStore.setCommentsOpen(keys[0]);
													}
													store.campaign?.commentStore.setNewGroupComment(true);
												}}
												rightIcon={<CarbonIcon icon={customIconPaths.multiComment16} />}
												intent={Intent.PRIMARY}
												text="Comment on commands"
												css={css`
													padding: 0 1rem;
												`}
											/>
										</div>
									)}
								<ScrollBox cy-test="info">
									<PanelRenderer type={state.infoPanelType} sort={store.campaign.sort} />
								</ScrollBox>
							</>
						}
					/>
				))}
			</TabsStyled>
			<AddToCommandGroupDialog />
		</div>
	);
});

const modeBarStyle = css`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	padding-left: 1rem;

	color: ${CoreTokens.OnIntent};
	background: ${CoreTokens.Intent.Primary4};
	.${ThemeClasses.DARK} & {
		background: ${CoreTokens.Intent.Primary1};
	}
`;

const headerStyles = css`
	padding: 0.5rem 1rem 0.75rem;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

// eslint-disable-next-line import/no-default-export
export default Explore;

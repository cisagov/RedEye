import type { TabId } from '@blueprintjs/core';
import { Button, Classes, Tab } from '@blueprintjs/core';
import { Launch16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, ScrollBox } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { SortDirection, useStore } from '@redeye/client/store';
import { InfoType, Tabs } from '@redeye/client/types/explore';
import { TabsStyled, CoreTokens } from '@redeye/ui-styles';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useCallback, useEffect } from 'react';
import { AddToCommandGroupDialog, ControlBar, NavBreadcrumbs } from './components';
import { InfoPanelTabs, TabNames, useToggleHidden } from './Panels';
import { BulkEdit } from './Panels/BulkEdit';
import { MultiCommandComment } from './Panels/MultiCommandComment';

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
		get hostCount() {
			return (
				(store.campaign?.hostGroupSelect.selectedHosts.length || 0) +
				(store.campaign?.hostGroupSelect.selectedServers.length || 0)
			);
		},
		get beaconCount() {
			return store.campaign?.beaconGroupSelect.selectedBeacons.length || 0;
		},
	});

	const [bulkHideBeaconState, bulkHideBeacon] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons,
				setHidden: true,
			})
	);

	const [bulkShowBeaconState, bulkShowBeacon] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons,
				setHidden: false,
			})
	);

	const [bulkHideHostState, bulkHideHost] = useToggleHidden(async () => {
		if (store.campaign?.hostGroupSelect.selectedServers.length) {
			await store.graphqlStore.mutateToggleServerHidden({
				campaignId: store.campaign?.id!,
				serverIds: store.campaign?.hostGroupSelect.selectedServers,
				setHidden: true,
			});
		}
		if (store.campaign?.hostGroupSelect.selectedHosts.length) {
			await store.graphqlStore.mutateToggleHostHidden({
				campaignId: store.campaign?.id!,
				hostIds: store.campaign?.hostGroupSelect.selectedHosts,
				setHidden: true,
			});
		}
	});

	const [bulkShowHostState, bulkShowHost] = useToggleHidden(async () => {
		if (store.campaign?.hostGroupSelect.selectedServers) {
			await store.graphqlStore.mutateToggleServerHidden({
				campaignId: store.campaign?.id!,
				serverIds: store.campaign?.hostGroupSelect.selectedServers,
				setHidden: false,
			});
		}
		if (store.campaign?.hostGroupSelect.selectedHosts) {
			await store.graphqlStore.mutateToggleHostHidden({
				campaignId: store.campaign?.id!,
				hostIds: store.campaign?.hostGroupSelect.selectedHosts,
				setHidden: false,
			});
		}
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
				} catch (e) {
					window.console.log(e); // Try to catch if tab switching is stalling here - hard to reproduce
				}
			}),
		[]
	);

	const handleTabChange = useCallback(async (newTab: TabId) => {
		await store.campaign?.setSelectedTab(newTab as Tabs);
	}, []);

	useEffect(() => {
		store.campaign?.commentStore.setGroupSelect(false);
		store.campaign?.commentStore.clearSelectedCommand();
		if (store.campaign?.beaconGroupSelect.groupSelect) {
			store.campaign?.setBeaconGroupSelect({
				groupSelect: false,
				selectedBeacons: [],
			});
		}
		if (store.campaign?.hostGroupSelect.groupSelect) {
			store.campaign?.setHostGroupSelect({
				groupSelect: false,
				selectedHosts: [],
				selectedServers: [],
			});
		}
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
									store.campaign?.commentStore.groupSelect && <MultiCommandComment commandCount={state.commandCount} />}

								{store.router?.params.tab === Tabs.HOSTS && store.campaign?.hostGroupSelect.groupSelect && (
									<BulkEdit
										modal="Host"
										count={state.hostCount}
										bulkShow={bulkShowHost}
										bulkHide={bulkHideHost}
										bulkShowState={bulkShowHostState}
										bulkHideState={bulkHideHostState}
									/>
								)}

								{store.router?.params.tab === Tabs.BEACONS && store.campaign?.beaconGroupSelect.groupSelect && (
									<BulkEdit
										modal="Beacon"
										count={state.beaconCount}
										bulkShow={bulkShowBeacon}
										bulkHide={bulkHideBeacon}
										bulkShowState={bulkShowBeaconState}
										bulkHideState={bulkHideBeaconState}
									/>
								)}

								<ScrollBox cy-test="info" css={{ backgroundColor: CoreTokens.Background2 }}>
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

const headerStyles = css`
	padding: 0.5rem 1rem 0.75rem;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
`;

// eslint-disable-next-line import/no-default-export
export default Explore;

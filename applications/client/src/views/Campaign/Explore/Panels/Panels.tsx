import type { AppStore } from '@redeye/client/store';
import { InfoType, Tabs } from '@redeye/client/types/explore';
import { PanelHeader } from '@redeye/client/views';
import { Txt } from '@redeye/ui-styles';
import { BeaconsList, HostBeaconsList } from './Beacon';
import { CommandsList } from './Command';
import { CommentsList } from './Comment';
import { HostsAndServersList } from './Host';
import { BeaconMeta, HostMeta, ServerMeta } from './Meta';
import { OperatorsList } from './OperatorsList';
import { OverviewBeaconsList, OverviewCommandTypesList, OverviewHostsList, OverviewOperatorsList } from './Overview';

export interface SortOption {
	label: string;
	key: string;
}

export const SortBy: Record<string, SortOption> = {
	TIME: { label: 'Time', key: 'minTime' },
	ID: { label: 'ID', key: 'id' },
};

export const TabNames: Record<Tabs, string> = {
	[Tabs.BEACONS]: 'Beacons',
	[Tabs.HOSTS]: 'Hosts',
	[Tabs.COMMANDS]: 'Commands',
	[Tabs.COMMANDS_OVERVIEW]: 'Command Types',
	[Tabs.OPERATORS]: 'Operators',
	[Tabs.COMMENTS]: 'Comments',
	[Tabs.METADATA]: 'Meta',
};

export enum CommentFilterOptions {
	FAVORITE = 'fav',
	OPERATOR = 'user',
	TIME = 'minTime',
}

// Defaults to the first one if unable to find a similar key
export const sortOptions: Record<Tabs, SortOption[]> = {
	[Tabs.BEACONS]: [SortBy.TIME, { label: 'Name', key: 'beaconName' }, SortBy.ID],
	[Tabs.HOSTS]: [SortBy.TIME, { label: 'Name', key: 'hostName' }, SortBy.ID],
	[Tabs.COMMANDS_OVERVIEW]: [{ label: 'Name', key: 'text' }, SortBy.ID],
	[Tabs.COMMANDS]: [
		{ label: 'Time', key: 'time' },
		{ label: 'Name', key: 'name' },
	],
	[Tabs.COMMENTS]: [
		{ label: 'Time', key: CommentFilterOptions.TIME },
		{ label: 'Operator', key: CommentFilterOptions.OPERATOR },
		{ label: 'Favorited', key: CommentFilterOptions.FAVORITE },
	],
	[Tabs.OPERATORS]: [
		{
			label: 'Time',
			key: 'startTime',
		},
		{ label: 'Name', key: 'name' },
		SortBy.ID,
	],
	[Tabs.METADATA]: [
		{
			label: 'Time',
			key: 'startTime',
		},
		{ label: 'Name', key: 'name' },
		SortBy.ID,
	],
};

export const InfoPanelTabs = {
	[InfoType.BEACON]: {
		title: (store: AppStore) => (
			<PanelHeader nodeIconProps={{ type: 'beacon' }}>
				<Txt normal muted>
					{store.campaign?.interactionState.selectedBeacon?.current?.displayName}
				</Txt>
				<Txt>{store.campaign?.interactionState.selectedBeacon?.current?.meta?.[0]?.maybeCurrent?.username}</Txt>
			</PanelHeader>
		),
		panels: {
			[Tabs.COMMANDS]: (props) => <CommandsList showPath={false} {...props} />,
			[Tabs.OPERATORS]: OperatorsList,
			[Tabs.COMMENTS]: CommentsList,
			[Tabs.METADATA]: BeaconMeta,
		},
	},
	[InfoType.OVERVIEW]: {
		title: (store: AppStore) => {
			const campaign = store.graphqlStore.campaigns.get((store.router.params?.id || '0') as string);
			return <PanelHeader>{campaign?.name}</PanelHeader>;
		},
		panels: {
			[Tabs.HOSTS]: OverviewHostsList,
			[Tabs.OPERATORS]: OverviewOperatorsList,
			[Tabs.COMMENTS]: CommentsList,
			[Tabs.BEACONS]: OverviewBeaconsList,
			[Tabs.COMMANDS_OVERVIEW]: OverviewCommandTypesList,
		},
	},
	[InfoType.SERVER]: {
		title: (store: AppStore) => (
			<PanelHeader nodeIconProps={{ type: 'server' }}>
				{store.campaign?.interactionState.selectedServer?.current?.displayName}
			</PanelHeader>
		),
		panels: {
			[Tabs.HOSTS]: HostsAndServersList,
			[Tabs.OPERATORS]: OperatorsList,
			[Tabs.BEACONS]: BeaconsList,
			[Tabs.METADATA]: ServerMeta,
		},
	},
	[InfoType.HOST]: {
		title: (store: AppStore) => (
			<PanelHeader nodeIconProps={{ type: 'host' }}>
				{store.campaign?.interactionState.selectedHost?.current?.displayName}
			</PanelHeader>
		),
		panels: {
			[Tabs.COMMANDS]: CommandsList,
			[Tabs.OPERATORS]: OperatorsList,
			[Tabs.COMMENTS]: CommentsList,
			[Tabs.BEACONS]: HostBeaconsList,
			[Tabs.METADATA]: HostMeta,
		},
	},
	[InfoType.OPERATOR]: {
		title: (store: AppStore) => <PanelHeader>{store.campaign?.interactionState.selectedOperator?.id}</PanelHeader>,
		panels: {
			[Tabs.COMMANDS]: CommandsList,
			[Tabs.BEACONS]: BeaconsList,
		},
	},
	[InfoType.COMMAND]: {
		title: (store: AppStore) => <PanelHeader>{store.campaign?.interactionState.selectedCommandType?.id}</PanelHeader>,
		panels: {
			[Tabs.COMMANDS]: CommandsList,
			[Tabs.COMMENTS]: CommentsList,
		},
	},
};

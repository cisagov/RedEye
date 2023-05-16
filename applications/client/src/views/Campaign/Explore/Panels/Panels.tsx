import { AppStore, CommentListTitle } from '@redeye/client/store';
import { OverviewCommentList } from '@redeye/client/store';
import { InfoType, Tabs } from '@redeye/client/types/explore';
import { DoublePanelHeader, PanelHeader } from '@redeye/client/views';
import { Beacons, HostBeacons } from './Beacon';
import { Commands } from './Command';
import { Comments } from './Comment';
import { Hosts } from './Host';
import { BeaconMeta, HostMeta, ServerMeta } from './Meta';
import { Operators } from './Operator';
import { OverviewBeacons, OverviewCommandTypes, OverviewHosts, OverviewOperators } from './Overview';
import { OverviewComments } from './Comment/CommentList';

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
	[Tabs.COMMENTS_LIST]: 'Comments List',
	[Tabs.METADATA]: 'Meta',
};

export enum CommentFilterOptions {
	FAVORITE = 'fav',
	OPERATOR = 'user',
	TIME = 'minTime',
}

export enum OverviewCommentListFilterOptions {
	COMMENT_COUNT = 'commentCount',
	COMMAND_COUNT = 'commandCount',
	ALPHABETICAL = 'alphabetical',
}

export const commentsTabSort = [
	{ label: 'Time', key: CommentFilterOptions.TIME },
	{ label: 'Operator', key: CommentFilterOptions.OPERATOR },
	{ label: 'Favorited', key: CommentFilterOptions.FAVORITE },
];

export const overviewCommentListSort = [
	{ label: 'Comment Count', key: OverviewCommentListFilterOptions.COMMENT_COUNT },
	{ label: 'Command Count', key: OverviewCommentListFilterOptions.COMMAND_COUNT },
	{ label: 'Alphabetical', key: OverviewCommentListFilterOptions.ALPHABETICAL },
];

// Defaults to the first one if unable to find a similar key
export const sortOptions: (overviewCommentList?: boolean) => Record<Tabs, SortOption[]> = () => ({
	[Tabs.BEACONS]: [SortBy.TIME, { label: 'Name', key: 'beaconName' }, SortBy.ID],
	[Tabs.HOSTS]: [SortBy.TIME, { label: 'Name', key: 'hostName' }, SortBy.ID],
	[Tabs.COMMANDS_OVERVIEW]: [{ label: 'Name', key: 'text' }, SortBy.ID],
	[Tabs.COMMANDS]: [
		{ label: 'Time', key: 'time' },
		{ label: 'Name', key: 'name' },
	],
	[Tabs.COMMENTS]: commentsTabSort,
	[Tabs.COMMENTS_LIST]: overviewCommentListSort,
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
});

export const InfoPanelTabs = {
	[InfoType.BEACON]: {
		title: (store: AppStore) => (
			<DoublePanelHeader
				primaryName={store.campaign?.interactionState.selectedBeacon?.current?.displayName}
				secondaryName={store.campaign?.interactionState.selectedBeacon?.current?.meta?.[0]?.maybeCurrent?.username}
			/>
		),
		panels: {
			[Tabs.COMMANDS]: (props) => <Commands showPath={false} {...props} />,
			[Tabs.OPERATORS]: Operators,
			[Tabs.COMMENTS]: Comments,
			[Tabs.METADATA]: BeaconMeta,
		},
	},
	[InfoType.OVERVIEW]: {
		title: (store: AppStore) => {
			const campaign = store.graphqlStore.campaigns.get((store.router.params?.id || '0') as string);
			return <PanelHeader>{campaign?.name}</PanelHeader>;
		},
		panels: {
			[Tabs.HOSTS]: OverviewHosts,
			[Tabs.OPERATORS]: OverviewOperators,
			// [Tabs.COMMENTS]: Comments,
			[Tabs.COMMENTS_LIST]: OverviewComments,
			[Tabs.BEACONS]: OverviewBeacons,
			[Tabs.COMMANDS_OVERVIEW]: OverviewCommandTypes,
		},
	},
	[InfoType.SERVER]: {
		title: (store: AppStore) => (
			<PanelHeader>{store.campaign?.interactionState.selectedServer?.current?.displayName}</PanelHeader>
		),
		panels: {
			[Tabs.HOSTS]: Hosts,
			[Tabs.OPERATORS]: Operators,
			[Tabs.BEACONS]: Beacons,
			[Tabs.METADATA]: ServerMeta,
		},
	},
	[InfoType.HOST]: {
		title: (store: AppStore) => (
			<PanelHeader>{store.campaign?.interactionState.selectedHost?.current?.displayName}</PanelHeader>
		),
		panels: {
			[Tabs.COMMANDS]: Commands,
			[Tabs.OPERATORS]: Operators,
			[Tabs.COMMENTS]: Comments,
			[Tabs.BEACONS]: HostBeacons,
			[Tabs.METADATA]: HostMeta,
		},
	},
	[InfoType.OPERATOR]: {
		title: (store: AppStore) => <PanelHeader>{store.campaign?.interactionState.selectedOperator?.id}</PanelHeader>,
		panels: {
			[Tabs.COMMANDS]: Commands,
			[Tabs.BEACONS]: Beacons,
		},
	},
	[InfoType.COMMAND]: {
		title: (store: AppStore) => <PanelHeader>{store.campaign?.interactionState.selectedCommandType?.id}</PanelHeader>,
		panels: {
			[Tabs.COMMANDS]: Commands,
			[Tabs.COMMENTS]: Comments,
		},
	},
	[InfoType.COMMENTS_LIST]: {
		title: (store: AppStore) => {
			const campaign = store.graphqlStore.campaigns.get((store.router.params?.id || '0') as string);
			const title = store.router.params.currentItemId
				? store.router.params.currentItemId.slice(0, 5) === 'user-'
					? CommentListTitle.user
					: store.router.params.currentItemId.slice(0, 4) === 'tag-'
					? CommentListTitle.tag
					: CommentListTitle[store.router.params.currentItemId]
				: campaign?.name;
			return (
				<PanelHeader css={title === OverviewCommentList.PROCEDURAL && { fontStyle: 'italic' }}>{title}</PanelHeader>
			);
		},
		panels: {
			[Tabs.COMMENTS]: Comments,
		},
	},
};

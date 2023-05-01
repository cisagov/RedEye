import { Tabs } from '@redeye/client/types/explore';
import { sortOptions } from '@redeye/client/views';
import type { Graph as BSGraph } from '@redeye/graph';
import { RedEyeGraph } from '@redeye/graph';
import { computed, observable, reaction } from 'mobx';
import type { ObjectMap, Ref } from 'mobx-keystone';
import { ExtendedModel, model, modelAction, modelClass, modelFlow, objectMap, prop } from 'mobx-keystone';
import { isDefined } from '../../components';
import type { CurrentItem } from '../../types';
import { CampaignViews } from '../../types';
// import type { BeaconModel, CommandGroupModel, LinkModel, SortOption, SortType } from '../graphql';
// import { CommandModel, SortDirection } from '../graphql';
import type { BeaconModel, CommandGroupModel, LinkModel } from '../graphql';
import { CommandModel, SortDirection, SortOption, SortType } from '../graphql';
import { disposeList } from '../util';
import { RedEyeModel } from '../util/model';
import { AddToCommandGroup } from './add-to-command-group';
import { CommentsStore } from './comments';
import { InteractionState } from './interaction-state';
import { PresentationStore } from './presentation';
import { SearchStore } from './search';
import { TimelineStore } from './timeline';

export enum CampaignLoadingMessage {
	GET_DATA = 'Retrieving campaign data',
	STATS = 'Aggregating campaign statistics',
	GRAPH = 'Building graph',
	PREPARING = 'Preparing workspace',
	DONE = 'Done',
}

export enum OverviewCommentList {
	ALL = 'All',
	COMMENTS = 'Comments',
	USER_COMMENTS = 'User Comments',
}

@model('CampaignStore')
export class CampaignStore extends ExtendedModel(() => ({
	baseModel: modelClass<RedEyeModel>(RedEyeModel),
	props: {
		campaignId: prop<string | undefined>().withSetter(),
		timeline: prop<TimelineStore>(() => new TimelineStore({})),
		commentStore: prop<CommentsStore>(() => new CommentsStore({})).withSetter(),
		search: prop<SearchStore>(() => new SearchStore({})).withSetter(),
		presentation: prop<PresentationStore>(() => new PresentationStore({})).withSetter(),
		interactionState: prop<InteractionState>(() => new InteractionState({})).withSetter(),
		addCommandToCommandGroup: prop<AddToCommandGroup>(() => new AddToCommandGroup({})).withSetter(),

		// Current server values
		commandCount: prop<ObjectMap<number>>(() => objectMap()).withSetter(),
		currentCommandGroups: prop<ObjectMap<Ref<CommandGroupModel>>>(() => objectMap()).withSetter(),
		// View state
		fetchEnabled: prop<boolean>(true).withSetter(),
		isLoading: prop<string>('').withSetter().withSetter(),
		error: prop<string>('').withSetter(),

		// Bulk Selection
		hostGroupSelect: prop<{
			groupSelect: boolean;
			selectedHosts: string[];
			selectedServers: string[];
			hiddenCount: number;
		}>(() => ({ groupSelect: false, selectedHosts: [], selectedServers: [], hiddenCount: 0 })).withSetter(),
		beaconGroupSelect: prop<{
			groupSelect: boolean;
			selectedBeacons: string[];
			hiddenCount: number;
		}>(() => ({ groupSelect: false, selectedBeacons: [], hiddenCount: 0 })).withSetter(),
		bulkSelectCantHideEntityIds: prop<string[]>(() => []).withSetter(),
		overviewCommentList: prop<OverviewCommentList>(OverviewCommentList.ALL).withSetter(),
	},
})) {
	@observable sortMemory: {
		[key in Tabs]: SortType;
	} = {} as any;

	@observable graph: RedEyeGraph | undefined;

	protected onAttachedToRootStore(): (() => void) | void {
		return disposeList(
			reaction(
				() => this.sort,
				() => {
					if (this.appStore?.router.params.tab) this.sortMemory[this.appStore.router.params.tab] = { ...this.sort };
				},
				{ fireImmediately: true }
			),
			reaction(
				() => this.appStore?.router.params.tab,
				() => {
					const sort = this.getDefaultSort(this.appStore?.router.params.tab as Tabs);
					if (sort?.sortBy !== this.sort.sortBy) {
						this.appStore?.router.updateQueryParams({
							queryParams: { sort: `${sort?.sortBy} ${sort?.direction}` },
							replace: true,
						});
					}
				},
				{ fireImmediately: true }
			)
		);
	}

	get graphData() {
		const nodes: Array<BeaconModel> = Array.from(this.appStore?.graphqlStore.beacons?.values() || []);
		const edges: Array<LinkModel> = Array.from(this.appStore?.graphqlStore.links?.values() || []);
		const parents = Array.from(this.appStore?.graphqlStore.hosts.values() || [], (host) => ({
			id: host.id,
			name: host.displayName ?? host.hostName ?? undefined,
		}));
		if (nodes.length) {
			const beacons = {};
			this.timeline.currentTimelineData?.buckets.forEach((bucket) => {
				bucket.createdBeacons?.forEach((beacon) => {
					beacons[beacon] = {
						...(beacons[beacon] || {}),
						start: bucket.bucketStartTime,
					};
				});
				bucket.dyingBeacons?.forEach((beacon) => {
					beacons[beacon] = {
						...(beacons[beacon] || {}),
						end: bucket.bucketEndTime,
					};
				});
			});
			const links: BSGraph['links'] = edges
				.map((edge) => ({
					source: edge.origin?.id,
					target: edge.destination?.id,
					id: edge.id,
				}))
				.filter(isDefined) as BSGraph['links'];
			return {
				nodes: nodes.map((node) => ({
					id: node.id,
					name: [node.displayName, node.meta[0]?.maybeCurrent?.username].filter((d) => d).join(' ') || undefined,
					parent: node.host?.id,
					isServer: !!node.host?.maybeCurrent?.cobaltStrikeServer,
					...(beacons[node.id] || {}),
				})),
				links,
				parents,
			};
		}

		return undefined;
	}

	@modelAction createGraph(element: SVGSVGElement) {
		const graphData = this.graphData;
		if (graphData) {
			this.graph = new RedEyeGraph({
				onSelectionChange: (node) => {
					if (this.appStore?.router.params.view !== CampaignViews.PRESENTATION) {
						if (node) {
							const type: CurrentItem = node.children?.length ? 'host' : 'beacon';
							const interactionModel = this.interactionState.getModel(type, node.id!);
							if (interactionModel && !(interactionModel instanceof CommandModel)) interactionModel.select();
						} else if (this.interactionState.selectedBeacon) {
							this.interactionState.selectedBeacon?.maybeCurrent?.select();
						} else if (this.interactionState.selectedHost) {
							this.interactionState.selectedHost?.maybeCurrent?.select();
						} else if (this.interactionState.selectedServer) {
							this.interactionState.selectedServer?.maybeCurrent?.select();
						}
					}
				},
				graphData,
				element,
			});
			this.interactionState.changeSelected();
		}
	}

	@modelAction updateGraph() {
		if (this.graph) {
			const graphData = this.graphData;
			if (graphData) {
				this.graph.graphData.updateGraphData(graphData);
			}
		}
	}

	@modelFlow *refetch() {
		if (this.appStore) {
			this.appStore.queryClient.getQueryCache().clear();
			yield this.appStore.queryClient.invalidateQueries();

			this.appStore.campaign.setIsLoading('');
			this.appStore.campaign.setFetchEnabled(true);
		}
	}

	getDefaultSort(tab?: Tabs) {
		if (tab) {
			const memorySortBy = this.sortMemory[tab];
			const sortOption = sortOptions[tab].find((option) => option.key === this.sort.sortBy);
			// 1) Use the option in memory if it exists
			// 2) Otherwise use an option that has the same key as what was previously being searched
			// 3) if that isn't valid for the current newTab use the first option in sortOptions
			const sortBy = (memorySortBy?.sortBy ?? sortOption?.key ?? sortOptions[tab][0].key) as SortOption;
			const direction = memorySortBy?.direction ?? SortDirection.ASC;
			return { sortBy, direction };
		}
	}

	@modelAction setSort(sortBy: SortOption) {
		this.appStore?.router.updateQueryParams({ queryParams: { sort: `${sortBy} ${SortDirection.ASC}` } });
	}

	@modelAction toggleIsAscending() {
		const direction = this.sort.direction === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;
		this.appStore?.router.updateQueryParams({ queryParams: { sort: `${this.sort.sortBy} ${direction}` } });
	}

	@modelAction setSelectedTab(newTab: Tabs) {
		if (newTab !== this.appStore?.router.params.tab) {
			const sort = this.getDefaultSort(newTab);
			this.appStore?.router.updateRoute({
				path: this.appStore.router.currentRoute,
				params: {
					tab: newTab,
					activeItem: undefined,
					activeItemId: undefined,
				},
				queryParams: {
					sort: sort ? `${sort?.sortBy} ${sort?.direction}` : undefined,
				},
			});
		}
	}

	// Getters
	@computed get id() {
		return this.campaignId || this.appStore?.router.params?.id;
	}

	@computed get sort(): SortType {
		const [sort, direction] = this.appStore?.router.queryParams.sort?.split(' ') ?? [];
		return {
			sortBy: sort as SortOption,
			direction: direction as SortDirection,
		};
	}
}

import { Intent, ProgressBar } from '@blueprintjs/core';
import { isDefined, VirtualizedList } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { SortDirection, SortTypeCommentsTab } from '@redeye/client/store';
import {
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	commandQuery,
	SortOptionComments,
	useStore,
	commandGroupCommentsQuery,
} from '@redeye/client/store';
import { CommentGroup, MessageRow } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useRef, useEffect } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

type CommentsProps = ComponentProps<'div'> & {
	sort: {
		sortBy: string;
		direction: SortDirection;
	};
};

const pageSize = 10;

export const Comments = observer<CommentsProps>(({ sort }) => {
	const store = useStore();
	const listRef = useRef<VirtuosoHandle | null>(null);
	const state = createState({
		newComment: '' as string | undefined,
		scrollToIndex: undefined as undefined | number,
		toggleNewComment(id?: string) {
			this.newComment = id;
		},
		visibleRange: {
			startIndex: 0,
			endIndex: pageSize,
		},
		expandedCommandIDs: store.router.params.activeItemId
			? observable.array([store.router.params.activeItemId])
			: observable.array<string>([]),
		removeExpandedCommandID(commandId: string) {
			this.expandedCommandIDs.remove(commandId);
		},
	});

	const { data: entityCommentsData } = useQuery(
		[
			'commandGroups',
			store.campaign?.id,
			store.campaign?.interactionState.selectedBeacon?.id,
			store.campaign?.interactionState.selectedHost?.id,
			store.campaign?.interactionState.selectedOperator?.id,
			store.campaign?.interactionState.selectedCommandType?.id,
			sort,
			store.router.params.currentItem,
			store.router.params.currentItemId,
		],
		async () =>
			await store.graphqlStore.queryCommandGroupIds({
				campaignId: store.campaign?.id!,
				beaconId: store.campaign?.interactionState.selectedBeacon?.id as string,
				hostId: store.campaign?.interactionState.selectedHost?.id as string,
				operatorId: store.campaign?.interactionState.selectedOperator?.id!,
				commandType: store.campaign?.interactionState.selectedCommandType?.id!,
				hidden: store.settings.showHidden,
				sort: {
					...sort,
					sortBy: sort.sortBy === 'minTime' ? SortOptionComments.time : (sort.sortBy as SortOptionComments),
				},
			})
	);

	const { isLoading: entityCommentsIsLoading } = useQuery(
		[
			'commandGroupsById',
			'commandGroups',
			store.campaign.id,
			entityCommentsData?.commandGroupIds,
			Math.trunc(state.visibleRange.endIndex / pageSize),
			store.router.params.currentItem,
			store.router.params.currentItemId,
		],
		async () => {
			if (entityCommentsData?.commandGroupIds?.length) {
				const index = Math.trunc(state.visibleRange.endIndex / pageSize);
				const start = index * pageSize;
				const ids = entityCommentsData.commandGroupIds.slice(start, start + pageSize);
				// query commands as temp solution
				const commandGroupsQuery = await store.graphqlStore.queryCommandGroups(
					{
						campaignId: store.campaign?.id!,
						commandGroupIds: ids,
						hidden: store.settings.showHidden,
					},
					commandGroupCommentsQuery // command cache issue?
				);

				// query commands as temp solution
				const commandIds = commandGroupsQuery?.commandGroups.flatMap((cg) => cg.commandIds).filter<string>(isDefined);
				return store.graphqlStore.queryCommands(
					{
						campaignId: store.campaign?.id!,
						commandIds,
						hidden: store.settings.showHidden,
					},
					commandQuery
				);
				// query commands as temp solution
			}
		},
		{
			enabled: !!entityCommentsData?.commandGroupIds?.length,
		}
	);

	// Fetch presentationItemsData again when refreshing browser @comments_list-[currentItemId] and changing sort
	const { data: campaignCommentsData } = useQuery(
		[
			'overview-comments-items',
			store.campaign.id,
			store.campaign.sortMemory.comments_list,
			store.campaign.sortMemory.comments,
		],
		async () => {
			if (store.router.params.currentItem === 'comments_list' && store.router.params.currentItemId) {
				const presentationItemsData = await store.graphqlStore.queryPresentationItems(
					{
						campaignId: store.campaign.id!,
						hidden: store.settings.showHidden,
						forOverviewComments: true,
						commentsTabSort: sort as SortTypeCommentsTab,
					},
					presentationItemModelPrimitives.commandGroups(presentationCommandGroupModelPrimitives).toString(),
					undefined,
					true
				);
				const currentPresentationItem = presentationItemsData?.presentationItems.find(
					(item) => item.id === store.router.params.currentItemId
				);
				return { commandGroupIds: Array.from(currentPresentationItem?.commandGroupIds || []) };
			}
			return { commandGroupIds: [] as string[] };
		}
	);

	const { isLoading: campaignCommentsIsLoading } = useQuery(
		[
			'commandGroupsById',
			'commandGroups',
			store.campaign.id,
			campaignCommentsData?.commandGroupIds,
			Math.trunc(state.visibleRange.endIndex / pageSize),
			store.router.params.currentItem,
			store.router.params.currentItemId,
		],
		async () => {
			if (campaignCommentsData?.commandGroupIds?.length) {
				const index = Math.trunc(state.visibleRange.endIndex / pageSize);
				const start = index * pageSize;
				const ids = campaignCommentsData?.commandGroupIds?.slice(start, start + pageSize);
				// query commands as temp solution
				const commandGroupsQuery = await store.graphqlStore.queryCommandGroups(
					{
						campaignId: store.campaign?.id!,
						commandGroupIds: ids,
						hidden: store.settings.showHidden,
					},
					commandGroupCommentsQuery // command cache issue?
				);

				// query commands as temp solution
				const commandIds = commandGroupsQuery?.commandGroups.flatMap((cg) => cg.commandIds).filter<string>(isDefined);
				return store.graphqlStore.queryCommands(
					{
						campaignId: store.campaign?.id!,
						commandIds,
						hidden: store.settings.showHidden,
					},
					commandQuery
				);
				// query commands as temp solution
			}
		},
		{
			enabled: !!campaignCommentsData?.commandGroupIds?.length,
		}
	);

	useEffect(() => {
		if (store.campaign?.commentStore.scrollToComment) {
			state.update(
				'scrollToIndex',
				Object.values(store.graphqlStore.commandGroups?.items).findIndex(
					(commandGroup) => commandGroup.id === store.campaign?.commentStore.scrollToComment
				)
			);
			if (state.scrollToIndex !== -1) {
				setTimeout(() => {
					listRef?.current?.scrollToIndex({
						index: state.scrollToIndex!,
						align: 'start',
						behavior: 'smooth',
					});
					setTimeout(() => {
						state.update('scrollToIndex', undefined);
						store.campaign.commentStore.setScrollToComment(undefined);
					}, 1000);
				}, 250);
			}
		}
	}, [entityCommentsData]);

	const isCampaignComments = store.router.params.currentItem === 'comments_list';
	const commandGroupIds: string[] | undefined = isCampaignComments
		? campaignCommentsData?.commandGroupIds
		: entityCommentsData?.commandGroupIds;
	const isLoading = isCampaignComments ? campaignCommentsIsLoading : entityCommentsIsLoading;

	return (
		<VirtualizedList
			rangeChanged={(visibleRange) => state.update('visibleRange', visibleRange)}
			listRef={listRef}
			cy-test="comments-view"
		>
			{commandGroupIds?.length === 0 ? (
				isLoading ? (
					<ProgressBar intent={Intent.PRIMARY} />
				) : (
					<MessageRow>No comments</MessageRow>
				)
			) : (
				commandGroupIds?.map((commandGroupId) => (
					<CommentGroup
						cy-test="comment-group"
						key={commandGroupId}
						commandGroupId={commandGroupId}
						toggleNewComment={state.toggleNewComment}
						newComment={state.newComment}
						expandedCommandIDs={state.expandedCommandIDs}
						removeExpandedCommandID={state.removeExpandedCommandID}
					/>
				))
			)}
		</VirtualizedList>
	);
});

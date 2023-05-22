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
			endIndex: 0,
		},
		expandedCommandIDs: store.router.params.activeItemId
			? observable.array([store.router.params.activeItemId])
			: observable.array<string>([]),
		removeExpandedCommandID(commandId: string) {
			this.expandedCommandIDs.remove(commandId);
		},
	});
	const { data } = useQuery(
		[
			'commandGroups',
			store.campaign?.id,
			store.campaign?.interactionState.selectedBeacon?.id,
			store.campaign?.interactionState.selectedHost?.id,
			store.campaign?.interactionState.selectedOperator?.id,
			store.campaign?.interactionState.selectedCommandType?.id,
			sort,
			store.router.params,
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
					// @ts-ignore
					sortBy: sort.sortBy === 'minTime' ? SortOptionComments.time : sort.sortBy,
				},
			})
	);

	const { isLoading } = useQuery(
		[
			'commandGroupsById',
			'commandGroups',
			store.campaign.id,
			data?.commandGroupIds,
			Math.trunc(state.visibleRange.endIndex / pageSize),
			store.router.params,
		],
		async () => {
			if (data?.commandGroupIds?.length) {
				const index = Math.trunc(state.visibleRange.endIndex / pageSize);
				const start = index * pageSize;
				const ids = data.commandGroupIds.slice(start, start + pageSize);
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
			enabled: !!data?.commandGroupIds?.length,
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
	}, [data]);

	// Fetch presentationData again when refreshing browser @comments_list-[currentItemId] and changing sort
	const { data: presentationData } = useQuery(
		[
			'presentation-items',
			store.campaign.id,
			store.campaign.sortMemory.comments_list,
			store.campaign.sortMemory.comments,
		],
		async () =>
			await store.graphqlStore.queryPresentationItems(
				{
					campaignId: store.campaign.id!,
					hidden: store.settings.showHidden,
					forOverviewComments: true,
					commentsTabSort: sort as SortTypeCommentsTab,
				},
				presentationItemModelPrimitives.commandGroups(presentationCommandGroupModelPrimitives).toString(),
				undefined,
				true
			)
	);
	useEffect(() => {
		if (store.router.params.currentItem === 'comments_list' && store.router.params.currentItemId) {
			const filteredData = presentationData?.presentationItems.find(
				(item) => item.id === store.router.params.currentItemId
			);
			store.campaign?.setCommentsList({
				commandGroupIds: Array.from(filteredData?.commandGroupIds || []),
			});
		}
	}, [store.campaign.commentsList.commandGroupIds]);

	return (
		<VirtualizedList
			rangeChanged={(visibleRange) => state.update('visibleRange', visibleRange)}
			listRef={listRef}
			cy-test="comments-view"
		>
			{data?.commandGroupIds.length === 0 ? (
				<MessageRow>No comments</MessageRow>
			) : isLoading ? (
				<ProgressBar intent={Intent.PRIMARY} />
			) : store.router.params.currentItem === 'comments_list' ? (
				store.campaign.commentsList.commandGroupIds.map((commandGroupId) => (
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
			) : (
				data?.commandGroupIds.map((commandGroupId) => (
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

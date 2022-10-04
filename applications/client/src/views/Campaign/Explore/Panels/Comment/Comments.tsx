import { Intent, ProgressBar } from '@blueprintjs/core';
import { createSorter, isDefined, VirtualizedList } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandGroupModel } from '@redeye/client/store';
import { commandGroupQuery, commandQuery, SortDirection, useStore } from '@redeye/client/store';
import { CommentFilterOptions, CommentGroup, MessageRow } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

type CommentsProps = ComponentProps<'div'> & {
	sort: {
		sortBy: string;
		direction: SortDirection;
	};
};

export const Comments = observer<CommentsProps>(({ sort }) => {
	const store = useStore();
	const listRef = useRef<VirtuosoHandle | null>(null);

	const query = useQuery(
		[
			'commandGroups',
			store.campaign?.id,
			store.campaign?.interactionState.selectedBeacon?.id,
			store.campaign?.interactionState.selectedHost?.id,
			store.campaign?.interactionState.selectedOperator?.id,
			store.campaign?.interactionState.selectedCommandType?.id,
		],
		async () =>
			await store.graphqlStore.queryCommandGroups(
				{
					campaignId: store.campaign?.id!,
					beaconId: store.campaign?.interactionState.selectedBeacon?.id as string,
					hostId: store.campaign?.interactionState.selectedHost?.id as string,
					operatorId: store.campaign?.interactionState.selectedOperator?.id!,
					commandType: store.campaign?.interactionState.selectedCommandType?.id!,
					hidden: store.settings.showHidden,
				},
				commandGroupQuery
			)
	);

	useQuery(
		['commandsById', 'commandGroups', store.campaign.id, query?.data?.commandGroups.length],
		async () => {
			if (query?.data?.commandGroups.length) {
				return await store.graphqlStore.queryCommands(
					{
						campaignId: store.campaign?.id!,
						commandIds: query?.data?.commandGroups.flatMap((cg) => cg.commandIds).filter<string>(isDefined),
						hidden: store.settings.showHidden,
					},
					commandQuery
				);
			}
		},
		{
			enabled: !!query?.data?.commandGroups.length,
		}
	);

	const state = createState({
		newComment: '' as string | undefined,
		scrollToIndex: undefined as undefined | number,
		toggleNewComment(id?: string) {
			this.newComment = id;
		},
		commandGroups: [] as CommandGroupModel[],
	});

	useEffect(() => {
		const commandGroups: CommandGroupModel[] = Array.from(query?.data?.commandGroups || []);
		// Sort items
		const { sortBy, direction } = sort;
		commandGroups.sort(
			createSorter((commandGroup) => {
				if (sortBy === CommentFilterOptions.FAVORITE) {
					return commandGroup.annotations.some((annotation) => annotation.current.favorite);
				} else if (sortBy === CommentFilterOptions.TIME) {
					return commandGroup.minMaxTime.minTime?.valueOf();
				} else if (sortBy === CommentFilterOptions.OPERATOR) {
					return commandGroup.annotations?.[0]?.current.user;
				}
			}, direction === SortDirection.ASC)
		);
		// Prevents re-ordering elements from getting garbled in the virtual list
		state.update('commandGroups', commandGroups);
	}, [query?.data?.commandGroups.length, sort.sortBy, sort.direction]);

	useEffect(() => {
		if (store.campaign?.commentStore.scrollToComment) {
			state.update(
				'scrollToIndex',
				state.commandGroups?.findIndex((commandGroup) => commandGroup.id === store.campaign?.commentStore.scrollToComment)
			);
			if (state.scrollToIndex !== -1) {
				setTimeout(() => {
					listRef?.current?.scrollToIndex({ index: state.scrollToIndex!, align: 'start', behavior: 'smooth' });
					setTimeout(() => {
						state.update('scrollToIndex', undefined);
						store.campaign.commentStore.setScrollToComment(undefined);
					}, 1000);
				}, 250);
			}
		}
	}, [store.campaign?.commentStore.scrollToComment, state.commandGroups?.length]);
	return (
		<VirtualizedList listRef={listRef} cy-test="comments-view">
			{query.isLoading ? (
				<ProgressBar intent={Intent.PRIMARY} />
			) : state.commandGroups.length === 0 ? (
				<MessageRow>No comments</MessageRow>
			) : (
				state.commandGroups.map((commandGroup) => (
					<CommentGroup
						cy-test="comment-group"
						key={commandGroup.id}
						commandGroup={commandGroup}
						toggleNewComment={state.toggleNewComment}
						newComment={state.newComment}
					/>
				))
			)}
		</VirtualizedList>
	);
});

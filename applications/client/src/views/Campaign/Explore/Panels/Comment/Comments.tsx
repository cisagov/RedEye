import { Intent, ProgressBar } from '@blueprintjs/core';
import { VirtualizedList } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandGroupModel, SortDirection } from '@redeye/client/store';
import { commandGroupModelPrimitives, SortOptionComments, useStore } from '@redeye/client/store';
import { CommentGroup, MessageRow } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

type CommentsProps = ComponentProps<'div'> & {
	sort: {
		sortBy: string;
		direction: SortDirection;
	};
};

const pageSize = 4;

export const Comments = observer<CommentsProps>(({ sort }) => {
	const store = useStore();
	const listRef = useRef<VirtuosoHandle | null>(null);
	const state = createState({
		newComment: '' as string | undefined,
		scrollToIndex: undefined as undefined | number,
		toggleNewComment(id?: string) {
			this.newComment = id;
		},
		commandGroups: [] as CommandGroupModel[],
		visibleRange: {
			startIndex: 0,
			endIndex: 0,
		},
	});
	const { data, isLoading } = useQuery(
		[
			'commandGroups',
			store.campaign?.id,
			store.campaign?.interactionState.selectedBeacon?.id,
			store.campaign?.interactionState.selectedHost?.id,
			store.campaign?.interactionState.selectedOperator?.id,
			store.campaign?.interactionState.selectedCommandType?.id,
			sort,
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

	useQuery(
		[
			'commandGroupsById',
			'commandGroups',
			store.campaign.id,
			data?.commandGroupIds,
			Math.trunc(state.visibleRange.endIndex / pageSize),
		],
		async () => {
			if (data?.commandGroupIds?.length) {
				const index = Math.trunc(state.visibleRange.endIndex / pageSize);
				const start = index * pageSize;
				const ids = data.commandGroupIds.slice(start, start + pageSize);
				await store.graphqlStore.queryCommandGroups(
					{
						campaignId: store.campaign?.id!,
						commandGroupIds: ids,
						hidden: store.settings.showHidden,
					},
					commandGroupModelPrimitives
						.commands((command) =>
							command
								.beacon((beacon) => beacon.meta((meta) => meta.ip.pid.startTime.endTime).host((host) => host.beaconIds))
								.input((commandInput) => commandInput.dateTime.blob.logType)
								.operator((operator) => operator)
								.output((log) => log.blob)
						)
						.annotations((anno) => anno.text.user.commandIds.commandGroupId.date.favorite.tags((tag) => tag.text))
						.toString()
				);
			}
		},
		{
			enabled: !!data?.commandGroupIds?.length,
		}
	);

	return (
		<VirtualizedList
			rangeChanged={(visibleRange) => state.update('visibleRange', visibleRange)}
			listRef={listRef}
			cy-test="comments-view"
		>
			{isLoading ? (
				<ProgressBar intent={Intent.PRIMARY} />
			) : data?.commandGroupIds.length === 0 ? (
				<MessageRow>No comments</MessageRow>
			) : (
				data?.commandGroupIds.map((commandGroupId) => (
					<CommentGroup
						cy-test="comment-group"
						key={commandGroupId}
						commandGroupId={commandGroupId}
						toggleNewComment={state.toggleNewComment}
						newComment={state.newComment}
					/>
				))
			)}
		</VirtualizedList>
	);
});

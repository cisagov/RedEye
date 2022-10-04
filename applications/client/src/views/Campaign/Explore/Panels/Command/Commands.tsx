import { Intent, ProgressBar } from '@blueprintjs/core';
import { createState, VirtualizedList } from '@redeye/client/components';
import { commandQuery, SortOption, useStore } from '@redeye/client/store';
import { CommandContainer, initialCommandRowHeight, MessageRow } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import type { VirtuosoHandle } from 'react-virtuoso';

type CommandsProps = ComponentProps<'div'> & {
	showPath?: boolean;
	sort: SortOption;
};

const pageSize = 20;

export const Commands = observer<CommandsProps>(({ sort, showPath = true }) => {
	const store = useStore();
	const listRef = useRef<VirtuosoHandle | null>(null);
	const state = createState({
		visibleRange: {
			startIndex: 0,
			endIndex: 0,
		},
		scrollToCommand(commandId: string, commandIds: string[], behavior: ScrollBehavior = 'smooth') {
			const commandIndex = commandIds.findIndex((id) => commandId === id);
			if (commandIndex > -1) {
				listRef?.current?.scrollToIndex({ index: commandIndex, align: 'start', behavior });
			}
		},
	});
	const { data, isLoading } = useQuery(
		[
			'commands',
			store.campaign.id,
			store.campaign?.interactionState.selectedServer?.id,
			store.campaign?.interactionState.selectedBeacon?.id,
			store.campaign?.interactionState.selectedOperator?.id,
			store.campaign?.interactionState.selectedHost?.id,
			store.campaign?.interactionState.selectedCommandType?.id,
			sort,
		],
		async () =>
			await store.graphqlStore.queryCommandIds({
				hidden: store.settings.showHidden,
				beaconId: store.campaign?.interactionState.selectedBeacon?.id,
				hostId: store.campaign?.interactionState.selectedHost?.id,
				campaignId: store.campaign?.id!,
				operatorId: store.campaign?.interactionState.selectedOperator?.id,
				commandType: store.campaign?.interactionState.selectedCommandType?.maybeCurrent?.text,
				// @ts-ignore
				sort: { ...sort, sortBy: sort.sortBy === 'minTime' ? SortOption.time : sort.sortBy },
			})
	);

	useQuery(
		['commandsById', store.campaign.id, data?.commandIds, Math.trunc(state.visibleRange.endIndex / pageSize)],
		async () => {
			if (data?.commandIds?.length) {
				const index = Math.trunc(state.visibleRange.endIndex / pageSize);
				const start = index * pageSize;
				const ids = data.commandIds.slice(start, start + pageSize);
				return await store.graphqlStore.queryCommands(
					{
						campaignId: store.campaign?.id!,
						commandIds: ids,
						hidden: store.settings.showHidden,
					},
					commandQuery
				);
			}
		},
		{
			enabled: !!data?.commandIds?.length,
		}
	);

	useEffect(() => {
		if (data && store.router.params.activeItem === 'command' && store.router.params.activeItemId) {
			setTimeout(() => {
				state.scrollToCommand(store.router.params.activeItemId as string, data.commandIds);
			}, 250);
		}
	}, [data]);

	useEffect(() => {
		if (data && store.campaign.commentStore.commentsOpen && store.campaign.commentStore.newGroupComment) {
			const commandId = store.campaign.commentStore.commentsOpen;
			state.scrollToCommand(commandId, data.commandIds, 'auto');
			setTimeout(() => {
				store.campaign?.commentStore.setCommentsOpen(commandId);
			}, 250);
		}
	}, [store.campaign.commentStore.commentsOpen]);

	return (
		<VirtualizedList
			rangeChanged={(visibleRange) => state.update('visibleRange', visibleRange)}
			listRef={listRef}
			defaultItemHeight={initialCommandRowHeight}
		>
			{isLoading ? (
				<ProgressBar intent={Intent.PRIMARY} />
			) : data?.commandIds.length === 0 ? (
				<MessageRow>No Commands</MessageRow>
			) : (
				data?.commandIds?.map((commandId) => (
					<CommandContainer commandId={commandId} key={commandId} data-command-id={commandId} showPath={showPath} />
				))
			)}
		</VirtualizedList>
	);
});

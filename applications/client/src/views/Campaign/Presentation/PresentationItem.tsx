import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { CommentGroup } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { ComponentProps } from 'react';
import { PresentationItemHeader } from './PresentationItemHeader';

type PresentationItemProps = ComponentProps<'div'> & {
	commandGroupId?: string;
};

export const PresentationItem = observer<PresentationItemProps>(({ commandGroupId, ...props }) => {
	const store = useStore();
	const state = createState({
		newComment: '' as string | undefined,
		toggleNewComment() {
			if (this.newComment) this.newComment = '';
			else this.newComment = commandGroupId;
		},
		expandedCommandIDs: store.router.params.activeItemId
			? observable.array([store.router.params.activeItemId])
			: observable.array<string>([]),
		removeExpandedCommandID(commandId: string) {
			this.expandedCommandIDs.remove(commandId);
		},
	});
	const { data } = useQuery(
		['command-group', store.campaign.id, commandGroupId],
		async () =>
			await store.graphqlStore.queryCommandGroup({
				campaignId: store.campaign.id!,
				commandGroupId: commandGroupId!,
				hidden: store.settings.showHidden,
			})
	);

	useQuery(
		['commandsById', store.campaign.id, commandGroupId],
		async () => {
			if (data?.commandGroup?.commandIds) {
				return await store.graphqlStore.queryCommands({
					campaignId: store.campaign.id!,
					commandIds: data?.commandGroup.commandIds,
					hidden: store.settings.showHidden,
				});
			}
		},
		{
			enabled: !!data?.commandGroup?.commandIds?.length,
		}
	);

	useEffect(() => {
		store.campaign?.interactionState.onHoverOut({});
		return () => store.campaign?.interactionState.onHoverOut({});
	}, [commandGroupId]);

	if (!data?.commandGroup) return null;
	return (
		<>
			<PresentationItemHeader />
			<CommentGroup
				cy-test="presentation-item-root"
				showPath="server"
				commandGroupId={data.commandGroup.id}
				toggleNewComment={state.toggleNewComment}
				newComment={state.newComment}
				expandedCommandIDs={state.expandedCommandIDs}
				removeExpandedCommandID={state.removeExpandedCommandID}
				css={{ border: 'unset' }}
				{...props}
			/>
		</>
	);
});

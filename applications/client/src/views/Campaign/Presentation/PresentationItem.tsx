import { css } from '@emotion/react';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { CommentGroup } from '@redeye/client/views';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { ComponentProps } from 'react';

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
		<CommentGroup
			cy-test="presentation-item-root"
			showPath
			commandGroup={data.commandGroup}
			toggleNewComment={state.toggleNewComment}
			newComment={state.newComment}
			css={css`
				border: unset;
			`}
			{...props}
		/>
	);
});

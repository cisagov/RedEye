import { css } from '@emotion/react';
import { Flex } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { AnnotationModel, CommandGroupModel, CommandModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { UUID } from '@redeye/client/types/uuid';
import { CommandContainer, CommentBox, NavBreadcrumbs } from '@redeye/client/views';
import { CoreTokens } from '@redeye/ui-styles';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

export type CommentGroupProps = ComponentProps<'div'> & {
	commandGroup?: CommandGroupModel;
	commandGroupId?: string | null;
	toggleNewComment: (id?: string) => void;
	newComment: string | undefined;
	measure?: any;
	showPath?: boolean;
	hideCommands?: boolean;
	expandedCommandIDs?: string[];
	removeExpandedCommandID?: (commandId: string) => void;
};
export const CommentGroup = observer<CommentGroupProps>(
	({
		commandGroup,
		commandGroupId,
		toggleNewComment,
		newComment,
		showPath,
		hideCommands,
		expandedCommandIDs = [],
		removeExpandedCommandID,
		...props
	}) => {
		const store = useStore();
		const state = createState({
			localCommand: undefined as undefined | CommandModel,
			get commandGroupId(): UUID | undefined {
				return (commandGroup?.id ?? commandGroupId!) as UUID;
			},
			get commandGroup(): CommandGroupModel | undefined {
				return state.commandGroupId ? store.graphqlStore.commandGroups.get(state.commandGroupId!) : undefined;
			},
		});
		const firstCommandId = state.commandGroup?.commandIds?.[0];
		const firstCommand = firstCommandId && store.graphqlStore.commands.get(firstCommandId);

		return (
			<div
				css={[
					css`
						flex-direction: column;
						width: 100%; // For host meta tab;
					`,
					!hideCommands &&
						css`
							border-bottom: 1px solid ${CoreTokens.BorderMuted}; //ask ryan how to remove this
						`,
				]}
				// id={commandGroupId} // @SEBASTIAN: is this a testing hook?
				{...props}
			>
				<Flex
					column
					css={css`
						margin: 1rem;
					`}
				>
					{state.commandGroup?.annotations?.map((annotation: Ref<AnnotationModel>) => (
						<CommentBox
							key={annotation.id}
							css={commentBoxStyle}
							reply={() => toggleNewComment(state.commandGroup?.id)}
							annotation={annotation?.maybeCurrent}
							commandGroup={state.commandGroup}
							isFullList
						/>
					))}
					{newComment === state.commandGroup?.id && (
						<CommentBox newComment commandGroupId={state.commandGroupId} cancel={toggleNewComment} css={commentBoxStyle} />
					)}
				</Flex>
				<Flex column>
					{showPath && firstCommand && (
						// TODO: what in case of Multi-Beacon Comment?
						<NavBreadcrumbs
							command={firstCommand}
							hideRoot
							css={css`
								padding: 0.5rem 1.5rem;
								font-size: ${CoreTokens.FontSizeMedium};
							`}
						/>
					)}
					{!hideCommands &&
						state.commandGroup?.commandIds?.map((commandId) => (
							<CommandContainer
								commandGroupId={state.commandGroupId}
								commandId={commandId}
								css={css`
									border-bottom: none !important;
								`}
								key={`${state.commandGroup?.id}${commandId}`}
								hideCommentButton
								showPath={!showPath} // configurable
								expandedCommandIDs={expandedCommandIDs}
								removeExpandedCommandID={removeExpandedCommandID}
							/>
						))}
				</Flex>
			</div>
		);
	}
);

const commentBoxStyle = css`
	border-bottom: none !important;
	background: ${CoreTokens.Background1};
	margin-bottom: 1px;
`;

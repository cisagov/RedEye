import { css } from '@emotion/react';
import { Flex } from '@redeye/client/components';
import type { AnnotationModel, CommandGroupModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { CommandContainer, CommentBox, NavBreadcrumbs } from '@redeye/client/views';
import { Tokens, TokensAll } from '@redeye/ui-styles';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

export type CommentGroupProps = ComponentProps<'div'> & {
	commandGroup: CommandGroupModel;
	toggleNewComment: (id?: string) => void;
	newComment: string | undefined;
	measure?: any;
	showPath?: boolean;
	hideCommands?: boolean;
};
export const CommentGroup = observer<CommentGroupProps>(
	({ commandGroup, toggleNewComment, newComment, showPath, hideCommands, ...props }) => {
		const store = useStore();
		const commandGroupId = commandGroup?.id;
		const firstCommandId = commandGroup?.commandIds?.[0];
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
							border-bottom: 1px solid ${Tokens.CoreTokens.BorderMuted}; //ask ryan how to remove this
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
					{commandGroup?.annotations?.map((annotation: Ref<AnnotationModel>) => (
						<CommentBox
							key={annotation.id}
							css={commentBoxStyle}
							reply={() => toggleNewComment(commandGroup.id)}
							annotation={annotation?.maybeCurrent}
							commandGroup={commandGroup}
							isFullList
						/>
					))}
					{newComment === commandGroup?.id && (
						<CommentBox newComment commandGroupId={commandGroupId} cancel={toggleNewComment} css={commentBoxStyle} />
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
								font-size: ${TokensAll.PtFontSize};
							`}
						/>
					)}
					{!hideCommands &&
						commandGroup?.commandIds?.map((commandId) => (
							<CommandContainer
								commandGroupId={commandGroupId}
								commandId={commandId}
								css={css`
									border-bottom: none !important;
								`}
								key={`${commandGroup.id}${commandId}`}
								hideCommentButton
								showPath={!showPath} // configurable
							/>
						))}
				</Flex>
			</div>
		);
	}
);

const commentBoxStyle = css`
	border-bottom: none !important;
	background: ${TokensAll.Background2};
	margin-bottom: 1px;
`;

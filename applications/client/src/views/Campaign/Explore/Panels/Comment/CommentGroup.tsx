import { css } from '@emotion/react';
import type { AnnotationModel, CommandGroupModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { UUID } from '@redeye/client/types/uuid';
import { CommandContainer, CommentBox, NavBreadcrumbs } from '@redeye/client/views';
import { CoreTokens, ThemeClasses, Flex } from '@redeye/ui-styles';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

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
		const [commandGroupId1, setCommandGroupId1] = useState<string | null | undefined>(commandGroupId);
		const [commandGroup1, setCommandGroup1] = useState<CommandGroupModel | undefined>(commandGroup);
		const firstCommandId = commandGroup1?.commandIds?.[0];
		const firstCommand = firstCommandId && store.graphqlStore.commands.get(firstCommandId);
		useEffect(() => {
			if (commandGroupId) {
				// For Comments Tab
				setCommandGroupId1(commandGroupId as UUID);
				setCommandGroup1(store.graphqlStore.commandGroups.get(commandGroupId));
			}
			if (commandGroup) {
				// For Presentation Tab
				setCommandGroupId1(commandGroup?.id as UUID);
				setCommandGroup1(commandGroup);
			}
		}, [commandGroupId, commandGroup]);

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
				{...props}
			>
				<Flex column css={{ margin: 16 }}>
					{commandGroup1?.annotations?.map((annotation: Ref<AnnotationModel>) => (
						<CommentBox
							key={annotation.id}
							css={commentBoxStyle}
							reply={() => toggleNewComment(commandGroup1?.id)}
							annotation={annotation?.maybeCurrent}
							commandGroup={commandGroup1}
							isFullList
						/>
					))}
					{newComment === commandGroup1?.id && (
						<CommentBox newComment commandGroupId={commandGroupId1} cancel={toggleNewComment} css={commentBoxStyle} />
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
						commandGroup1?.commandIds?.map((commandId) => (
							<CommandContainer
								commandGroupId={commandGroupId1}
								commandId={commandId}
								css={css`
									border-bottom: none !important;
								`}
								key={`${commandGroup1?.id}${commandId}`}
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
	.${ThemeClasses.DARK} & {
		background: ${CoreTokens.transparentWhite(0.05)};
	}
	.${ThemeClasses.LIGHT} & {
		background: ${CoreTokens.transparentBlack(0.04)};
	}
	margin-bottom: 1px;
`;

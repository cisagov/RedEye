import { css } from '@emotion/react';
import type { AnnotationModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { CommandProps } from '@redeye/client/views';
import { CommandContainer, CommentBox, NavBreadcrumbs } from '@redeye/client/views';
import { CoreTokens, ThemeClasses, Flex } from '@redeye/ui-styles';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

export type CommentGroupProps = ComponentProps<'div'> & {
	commandGroupId: string;
	toggleNewComment: (id?: string) => void;
	newComment: string | undefined;
	measure?: any;
	showPath?: CommandProps['showPath'];
	hideCommands?: boolean;
	expandedCommandIDs?: string[];
	removeExpandedCommandID?: (commandId: string) => void;
	refetchComments?: () => void;
};
export const CommentGroup = observer<CommentGroupProps>(
	({
		commandGroupId,
		toggleNewComment,
		newComment,
		showPath,
		hideCommands,
		expandedCommandIDs = [],
		removeExpandedCommandID,
		refetchComments,
		...props
	}) => {
		const store = useStore();
		const commandGroup = store.graphqlStore.commandGroups.get(commandGroupId);
		const firstCommandId = commandGroup?.commandIds?.[0];
		const firstCommand = firstCommandId && store.graphqlStore.commands.get(firstCommandId);

		// `showPath === 'server'` in this case means show the header path for presentation mode
		// TODO: what in case of Multi-Beacon Comment?
		const showNavPath = !!(showPath === 'server' && firstCommand);

		return (
			<div
				css={[
					css`
						display: flex;
						flex-direction: column;
						width: 100%; // For host meta tab;
						padding: 1px 0; // to force impossibility of block layout margin
					`,
					!hideCommands &&
						css`
							border-bottom: 1px solid ${CoreTokens.BorderMuted};
						`,
				]}
				{...props}
			>
				<Flex column css={{ padding: 16 }}>
					{!commandGroup && <div css={[commentBoxStyle, { height: 300 }]} />}
					{commandGroup?.annotations?.map((annotation: Ref<AnnotationModel>) => (
						<CommentBox
							key={annotation.id}
							css={commentBoxStyle}
							reply={() => toggleNewComment(commandGroup?.id)}
							annotation={annotation?.maybeCurrent}
							commandGroup={commandGroup}
							isFullList
							refetchComments={refetchComments}
						/>
					))}
					{newComment === commandGroup?.id && (
						<CommentBox newComment commandGroupId={commandGroupId} cancel={toggleNewComment} css={commentBoxStyle} />
					)}
				</Flex>
				<Flex column>
					{showNavPath && (
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
						commandGroup?.commandIds?.map((commandId) => (
							<CommandContainer
								commandGroupId={commandGroupId}
								commandId={commandId}
								css={{ borderBottom: 'none !important' }}
								key={`${commandGroup?.id}${commandId}`}
								hideCommentButton
								showPath={!showNavPath && showPath}
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

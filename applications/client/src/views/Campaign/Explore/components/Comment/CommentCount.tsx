import { AddComment16, Chat16 } from '@carbon/icons-react';
import styled from '@emotion/styled';
import { CarbonIcon } from '@redeye/client/components';
import type { CommandModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { CommentPopoverProps } from '@redeye/client/views';
import { CommentList, CommentPopover } from '@redeye/client/views';
import { hoverRevealClassName, AdvancedTokens, CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useCallback, useEffect, useRef } from 'react';

type CommentCountProps = CommentPopoverProps & {
	command?: CommandModel;
	commandGroupId?: string | null;
	annotationId?: string | null;
};

export const CommentCount = observer<CommentCountProps>(
	({ annotationId, commandGroupId, command, children, ...props }) => {
		const store = useStore();
		const commentCount = command?.commandGroups?.length || 0;
		const hasComments = commentCount > 0;

		const isOpen =
			store.campaign?.commentStore.commentsOpen === command?.id &&
			(!commandGroupId ? true : store.campaign?.commentStore.commentGroupOpen === commandGroupId) &&
			(!annotationId ? true : store.campaign?.commentStore.annotationOpen === annotationId);

		const closeComments = useCallback(() => {
			store.campaign?.commentStore.setCommentsOpen('');
		}, [store.campaign?.commentStore]);

		const handleClick = useCallback(() => {
			if (isOpen) {
				closeComments();
			} else {
				if (command) store.campaign?.commentStore?.setCommentsOpen(command.id);
				if (commandGroupId) store.campaign?.commentStore?.setCommentGroupOpen(commandGroupId);
				if (annotationId) store.campaign?.commentStore?.setAnnotationOpen(annotationId);
			}
		}, [command, commandGroupId, annotationId, closeComments, isOpen]);

		useEffect(
			() => () => {
				// only fires on "unmount"
				// this will close the CommentPopover when it scrolls out of view in a VirtualizedList
				if (isOpen) closeComments();
			},
			[closeComments, isOpen]
		);
		const container = useRef<HTMLDivElement>(null);

		return store.appMeta.blueTeam && !hasComments ? null : (
			<CommentPopover
				isOpen={isOpen}
				popoverRef={container}
				content={<CommentList popoverRef={container} command={command} onClose={closeComments} />}
				onInteraction={(nextOpenState) => {
					if (!nextOpenState) closeComments();
				}}
				renderTarget={({ onClick, className, ...targetProps }) => (
					<CommentButton
						children={<CarbonIcon cy-test="add-comment" icon={hasComments ? Chat16 : AddComment16} />}
						onClick={handleClick}
						className={[
							className,
							!hasComments && !isOpen ? hoverRevealClassName : undefined,
							isOpen ? 'open' : undefined,
						].join(' ')}
						{...(targetProps as ComponentProps<'button'>)}
					/>
				)}
				{...props}
			/>
		);
	}
);

export const CommentButton = styled.button`
	appearance: none;
	border: none;
	background: none;
	height: 2rem;
	width: 2rem;
	position: relative;
	cursor: pointer;

	// Firefox needs this for extra specificity
	color: ${CoreTokens.TextBody};

	&:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 99px;
		background-color: ${AdvancedTokens.PtIntentPrimary};
		z-index: -1;
		transform: scale(0.8);
		transform-origin: center;
		transition-property: transform, opacity, box-shadow;
		transition: 150ms ease;
		opacity: 0;
		box-shadow: ${CoreTokens.Elevation0};
	}

	&:hover,
	&.open {
		&:before {
			transform: scale(1);
			box-shadow: ${CoreTokens.Elevation4};
			opacity: 1;
		}
	}

	&:active {
		&:before {
			transform: scale(0.9);
			background-color: ${AdvancedTokens.PtIntentPrimaryActive};
			transition-duration: 50ms;
		}
	}
`;

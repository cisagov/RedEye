import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandModel, LinkModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { UUID } from '@redeye/client/types/uuid';
import { Command, CommandOutput, CommentCount, InfoRow } from '@redeye/client/views';
import { UtilityStyles, CoreTokens } from '@redeye/ui-styles';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { Suspense, useEffect } from 'react';
import { Tabs } from '@redeye/client/types';
import { MitreTechniqueIcons } from '../../components/MitreTechniqueIcons';
import { getManualCommandLinks } from '../../components/Comment/CheckForAddedLink';

type CommandContainerProps = ComponentProps<'div'> & {
	command?: CommandModel;
	commandId?: string;
	commandGroupId?: string | null;
	annotationId?: string | null;
	measure?: any;
	setCommand?: (cmd: any) => any;
	hideCommentButton?: boolean;
	showPath?: boolean;
	expandedCommandIDs?: string[];
	removeExpandedCommandID?: (commandId: string) => void;
	scrollTarget?: boolean;
};

export const CommandContainer = observer<CommandContainerProps>(
	({
		annotationId,
		commandGroupId,
		command,
		commandId,
		setCommand,
		hideCommentButton = false,
		showPath = false,
		expandedCommandIDs = [],
		removeExpandedCommandID,
		scrollTarget = false,
		...props
	}) => {
		const store = useStore();
		const state = createState({
			manualLink: getManualCommandLinks(commandId, Array.from(store?.graphqlStore.links.values()))[0] as
				| LinkModel
				| undefined,
			get active() {
				return store.router.params.activeItem === 'command' && store.router.params.activeItemId === state.commandId;
			},
			get expanded() {
				return expandedCommandIDs.includes(state.commandId);
			},
			setCollapsed() {
				if (!state.expanded) {
					expandedCommandIDs.push(state.commandId);
					if (
						!(
							store.router.params.tab === Tabs.COMMENTS &&
							(store.router.params.currentItem === 'host' || store.router.params.currentItem === 'beacon')
						)
					) {
						store.router.updateRoute({
							path: store.router.currentRoute,
							params: {
								activeItem: 'command',
								activeItemId: state.commandId,
							},
							replace: true,
						});
					}
				} else if (expandedCommandIDs?.length >= 1) {
					if (
						expandedCommandIDs[expandedCommandIDs.length - 1] === state.commandId &&
						!(
							store.router.params.tab === Tabs.COMMENTS &&
							(store.router.params.currentItem === 'host' || store.router.params.currentItem === 'beacon')
						)
					) {
						store.router.updateRoute({
							path: store.router.currentRoute,
							params: {
								activeItem: expandedCommandIDs.length > 1 ? 'command' : undefined,
								activeItemId:
									expandedCommandIDs.length > 1
										? (expandedCommandIDs[expandedCommandIDs.length - 2] as UUID)
										: undefined,
							},
							replace: true,
						});
					}
					removeExpandedCommandID?.(state.commandId);
				}
			},
			localCommand: undefined as undefined | CommandModel,
			get commandId(): UUID | undefined {
				return (command?.id ?? commandId!) as UUID;
			},
			get command(): CommandModel | undefined {
				return state.commandId ? store.graphqlStore.commands.get(state.commandId!) : undefined;
			},
			get skeletonClass() {
				return state?.command?.inputText ? undefined : Classes.SKELETON;
			},
		});

		useEffect(
			() =>
				reaction(
					() => state.command,
					() => {
						state.command?.updateCurrentCommandGroups();
						setCommand?.(state.command);
					},
					{ fireImmediately: true }
				),
			[]
		);

		return (
			<div cy-test="command-info" css={wrapperStyle} {...props}>
				<div css={[UtilityStyles.hoverRevealChildrenVisibility, gridWrapperStyle]}>
					<InfoRow
						cy-test="info-row"
						css={[interactiveRowStyle, gridFillStyle, { height: state.expanded ? 'auto' : initialCommandRowHeight }]}
						scrollTarget={scrollTarget}
						onClick={state.setCollapsed}
						onMouseEnter={() =>
							store.campaign?.interactionState.onHover(state.command?.beacon?.current?.hierarchy || {})
						}
					>
						<Suspense fallback={<Command store={store} skeletonClass={Classes.SKELETON} />}>
							<Command
								store={store}
								commandId={state.commandId}
								skeletonClass={state.skeletonClass}
								collapsed={!state.expanded}
								className={state.skeletonClass}
								command={state.command}
								showPath={showPath}
							/>
						</Suspense>
						<MitreTechniqueIcons mitreAttackIds={state.command?.mitreTechniques} />
						{/* BLDSTRIKE-591 Finish implementing creating/commenting on links
						{store.router.params.currentItem === 'beacon' && state.manualLink != null && (
							<CarbonIcon icon={semanticIcons.link} />
						)} */}
					</InfoRow>
					{!hideCommentButton && (
						<CommentCount
							className={state.skeletonClass}
							command={state.command}
							commandGroupId={commandGroupId}
							annotationId={annotationId}
							css={[
								gridFillStyle,
								commentCountStyle,
								!!store.campaign?.commentStore.groupSelect &&
									!store.campaign?.commentStore.newGroupComment &&
									hideCommentCount,
							]}
						/>
					)}
				</div>
				{(state.expanded || state.active) && <CommandOutput command={state.command} />}
			</div>
		);
	}
);

const wrapperStyle = css`
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${CoreTokens.BorderMuted};
	min-height: 3rem;
`;
const gridWrapperStyle = css`
	display: grid;
`;
const gridFillStyle = css`
	grid-row: 1/2;
	grid-column: 1/2;
`;

const hideCommentCount = css`
	display: none;
`;
const commentCountStyle = css`
	justify-self: end;
	align-self: center;
	margin-right: 0.5rem;
`;
const interactiveRowStyle = css`
	justify-self: stretch;
	align-self: stretch;
	padding: 0.5rem 3rem 0.5rem 1rem;
`;
export const initialCommandRowHeight = 56;

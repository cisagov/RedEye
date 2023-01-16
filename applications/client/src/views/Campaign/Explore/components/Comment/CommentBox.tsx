import {
	Alert,
	Alignment,
	Button,
	ButtonGroup,
	Classes,
	Intent,
	MenuItem,
	Position,
	TextArea,
} from '@blueprintjs/core';
import type { ItemPredicate } from '@blueprintjs/select';
import { MultiSelect } from '@blueprintjs/select';
import {
	AddComment16,
	ArrowRight16,
	Bookmark16,
	BookmarkFilled16,
	Chat16,
	Checkmark16,
	Connect16,
	Edit16,
	TrashCan16,
} from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, createState, customIconPaths, isDefined } from '@redeye/client/components';
import type { AnnotationModel, CommandGroupModel, LinkModel } from '@redeye/client/store';
import { beaconQuery, commandQuery, useStore, linkQuery } from '@redeye/client/store';
import { MitreTechniques } from '@redeye/client/store/graphql/MitreTechniquesEnum';
import { CampaignViews } from '@redeye/client/types';
import { FlexSplitter, Spacer, TokensAll, Txt } from '@redeye/ui-styles';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps, MouseEventHandler, RefObject } from 'react';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddBeaconSelectOrSuggest, CheckForAddedLink } from '.';

type CommentBoxProps = ComponentProps<'div'> & {
	commandId?: string | null;
	commandGroupId?: string | null;
	commandText?: string | null;
	popoverRef?: RefObject<HTMLElement>;
	commandGroup?: CommandGroupModel;
	annotation?: AnnotationModel;
	newComment?: boolean;
	cancel?: () => void;
	reply?: () => void;
	isAddingCommandToComment?: boolean;
	isFullList?: boolean;
};

export const CommentBox = observer<CommentBoxProps>(
	({
		commandId,
		commandGroupId,
		commandText,
		commandGroup,
		annotation,
		newComment,
		cancel,
		reply,
		// refetch,
		popoverRef,
		isAddingCommandToComment = false,
		isFullList = false,
		...props
	}) => {
		const store = useStore();

		const deleteAnnotation = useMutation(
			async (id: string) =>
				await store.graphqlStore.mutateDeleteAnnotation({
					campaignId: store.campaign?.id!,
					annotationId: id,
				}),
			{
				onSuccess: (annotationData) => {
					state.refetch();
					if (annotationData) {
						store.graphqlStore.annotations.delete(annotationData.deleteAnnotation.id);
						if (annotationData.deleteAnnotation.commandGroupId) {
							const cG = store.graphqlStore.commandGroups.get(annotationData.deleteAnnotation.commandGroupId);
							if (!cG?.annotations.length)
								store.graphqlStore.commandGroups.delete(annotationData.deleteAnnotation.commandGroupId);
						}
						store.graphqlStore.queryBeacons(
							{
								campaignId: store.campaign?.id!,
								hidden: store.settings.showHidden,
							},
							beaconQuery
						);
					}
				},
			}
		);

		const deleteLink = useMutation(
			async (id: string) =>
				await store.graphqlStore.mutateDeleteLink({
					campaignId: store.campaign?.id!,
					id,
				}),
			{
				onSuccess: (linkData) => {
					state.refetch();
					if (linkData) {
						store.graphqlStore.links.delete(linkData.deleteLink.id);
						store.graphqlStore
							.queryLinks(
								{
									campaignId: store.campaign?.id!,
									hidden: store.settings.showHidden,
								},
								linkQuery
							)
							.then(() => store.campaign.updateGraph());
						state.flagIfManualLinkHasBeenCreated(false, null);
					}
				},
			}
		);

		const editLink = useMutation(
			async (destinationId: string) =>
				await store.graphqlStore.mutateEditLink({
					campaignId: store.campaign?.id!,
					commandId: state.commandIds[0],
					destinationId,
					id: state.manuallyCreatedLink?.id,
					name: state.nameText,
					originId: store.campaign.interactionState.selectedBeacon?.id as string,
				}),
			{
				onSuccess: (linkData) => {
					state.refetch();
					if (linkData) {
						store.graphqlStore
							.queryLinks(
								{
									campaignId: store.campaign?.id!,
									hidden: store.settings.showHidden,
								},
								linkQuery
							)
							.then(() => store.campaign.updateGraph());
						state.flagIfManualLinkHasBeenCreated(true, store.graphqlStore.links.get(linkData.editLink.id));
					}
				},
			}
		);

		const createLink = useMutation(
			async (destinationId: string) =>
				await store.graphqlStore.mutateCreateLink({
					campaignId: store.campaign?.id!,
					commandId: state.commandIds[0],
					destinationId,
					name: state.nameText,
					originId: store.campaign.interactionState.selectedBeacon?.id as string,
				}),
			{
				onSuccess: (linkData) => {
					state.refetch();
					if (linkData) {
						store.graphqlStore
							.queryLinks(
								{
									campaignId: store.campaign?.id!,
									hidden: store.settings.showHidden,
								},
								linkQuery
							)
							.then(() => store.campaign.updateGraph());
						state.flagIfManualLinkHasBeenCreated(true, store.graphqlStore.links.get(linkData.createLink.id));
					}
				},
			}
		);

		const queryClient = useQueryClient();

		const state = createState({
			editMode: newComment || false,
			text: annotation?.text || '',
			nameText: '',
			displayName: '',
			destinationBeacon: '',
			addOrChangeLinkButtonText: 'Add beacon link',
			manuallyCreatedLink: null as LinkModel | null,
			manualLinkFlag: false,
			tags: observable.array<string>(),
			favorite: annotation?.favorite,
			deleteAnnotationPrompt: false,
			tagQuery: '',
			loading: false,
			showBeaconSearch: false,
			get commandIds(): string[] {
				return (
					store.campaign?.commentStore.selectedCommands.size
						? Array.from(store.campaign?.commentStore.selectedCommands.keys())
						: commandGroup?.commandIds ?? annotation?.commandIds ?? (commandId ? [commandId] : [])
				) as string[];
			},
			get commandGroupId(): string | undefined | null {
				return commandGroup?.id ?? commandGroupId;
			},
			get commandGroup(): CommandGroupModel | undefined {
				return (
					commandGroup ||
					(this.commandGroupId ? store.graphqlStore.commandGroups.get(this.commandGroupId) : undefined) ||
					(this.commandGroupId ? store.campaign?.currentCommandGroups.get(this.commandGroupId)?.current : undefined)
				);
			},
			get currentCommandIds(): Array<string | null> | undefined | null {
				return this.commandGroup?.commandIds || this.annotation?.commandIds;
			},
			get annotation(): undefined | AnnotationModel {
				return annotation && store.graphqlStore.annotations.get(annotation.id);
			},
			get defaultTags(): Array<string> {
				return this.annotation?.tags?.map((d) => d?.current?.text).filter<string>(isDefined) || [];
			},
			get autoTags(): Array<string> {
				const tags = new Set<string>();
				[...(Array.from(store.graphqlStore?.tags.values(), (tag) => tag.text!) || []), ...Object.values(MitreTechniques)]
					?.filter((tag) => !this.tags.includes(tag))
					.sort()
					.map((tag) => tags.add(tag));
				return Array.from(tags);
			},
			toggleBoolBeaconSearch() {
				this.showBeaconSearch = !this.showBeaconSearch;
			},
			storeNewDestinationBeaconForLinkCreation(newDestBeacon) {
				this.destinationBeacon = newDestBeacon;
			},

			// Doesn't change graph
			flagIfManualLinkHasBeenCreated(linkExists: boolean, manuallyCreatedLink): void {
				this.manualLinkFlag = linkExists;
				if (manuallyCreatedLink) {
					this.manuallyCreatedLink = manuallyCreatedLink;
					this.nameText = manuallyCreatedLink.name;
					this.addOrChangeLinkButtonText = `Edit link to ${this.manuallyCreatedLink?.destination?.current.displayName}`;
				} else {
					this.manuallyCreatedLink = null;
					this.addOrChangeLinkButtonText = 'Add beacon link';
				}
			},
			handleTagsChange(value: unknown) {
				this.tagQuery = '';
				this.tags.push(value as any);
			},
			handleTagsRemove(value: unknown) {
				this.tags.remove(value as any);
			},
			handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
				this.text = e.target.value;
			},
			handleDisplayNameFieldChange(e: ChangeEvent<HTMLTextAreaElement>) {
				this.nameText = e.target.value;
			},
			toggleFavorite() {
				this.favorite = !this.favorite;
				if (!this.editMode) this.submitAnnotation(true);
			},

			deleteAnnotation() {
				if (this.deleteAnnotationPrompt && annotation?.id) {
					deleteAnnotation.mutate(annotation.id);
					if (this.manuallyCreatedLink) {
						deleteLink.mutate(this.manuallyCreatedLink.id);
					}
				}
			},
			cancelAnnotationEdit() {
				this.text = annotation?.text || '';
				this.tags.replace(this.defaultTags);
				this.editMode = false;
				this.loading = false;
				this.destinationBeacon = '';
				store.campaign?.commentStore.clearSelectedCommand();
				store.campaign?.commentStore.setNewGroupComment(false);
				store.campaign?.commentStore.setGroupSelect(false);
				cancel?.();
			},
			*submitAnnotation(update?: boolean) {
				const campaignId: string = store.campaign?.id!;
				this.loading = true;
				try {
					if (!this.commandGroupId && !update) {
						yield store.graphqlStore.mutateAddCommandGroupAnnotation({
							campaignId,
							commandIds: this.commandIds,
							favorite: this.favorite,
							text: this.text,
							tags: this.tags,
							user: store.auth.userName!,
						});
					} else if ((this.editMode || update) && annotation) {
						yield store.graphqlStore.mutateUpdateAnnotation({
							campaignId,
							annotationId: annotation.id,
							favorite: this.favorite,
							tags: this.tags,
							text: this.text,
							user: update ? '' : store.auth.userName!,
						});
					} else {
						yield store.graphqlStore.mutateAddAnnotationToCommandGroup({
							campaignId,
							commandGroupId: this.commandGroupId!,
							favorite: this.favorite,
							text: this.text,
							tags: this.tags,
							user: store.auth.userName!,
						});
					}
					// editing an existing link
					if (state.manualLinkFlag && state.manuallyCreatedLink) {
						editLink.mutate(this.destinationBeacon.id);
						// beacon selected not a currently existing link
					} else if (state.destinationBeacon) {
						createLink.mutate(this.destinationBeacon.id);
					}
				} catch (e) {
					window.console.error(e);
				}
				this.refetch();
				this.cancelAnnotationEdit();
			},
			*addCommandToAnnotation() {
				const campaignId: string | undefined = store.campaign?.id;
				if (commandGroupId && commandId && campaignId) {
					yield store.graphqlStore.mutateAddCommandToCommandGroup({
						campaignId,
						commandId,
						commandGroupId,
					});
				}

				state.refetch();
			},
			refetch() {
				store.graphqlStore.queryCommands(
					{
						campaignId: store.campaign?.id!,
						commandIds: state.commandIds,
						hidden: store.settings.showHidden,
					},
					commandQuery
				);
				queryClient.invalidateQueries({
					predicate: (query) =>
						(query.queryKey as string[])?.join?.('-') ===
						[
							'commandGroups',
							store.campaign?.id,
							store.campaign?.interactionState.selectedBeacon?.id,
							store.campaign?.interactionState.selectedOperator?.id,
							store.campaign?.interactionState.selectedHost?.id,
							store.campaign?.interactionState.selectedCommandType?.id,
						].join('-'),
				});
			},
		});

		useEffect(() => {
			state.update('editMode', !!newComment);
		}, [newComment]);

		useEffect(
			() =>
				reaction(
					() => annotation?.tags,
					() => {
						if (state.annotation) state.tags.replace(state.defaultTags);
					},
					{ fireImmediately: true }
				),
			[]
		);

		const isRedTeam = !store.appMeta.blueTeam;
		const isPresentationMode = store.router.params.view === CampaignViews.PRESENTATION;
		const showEditButtons = !isPresentationMode && isRedTeam;
		const allowReply = isFullList && isRedTeam;
		const allowEdit =
			(store.auth.userName === annotation?.user || !annotation?.user) && !isAddingCommandToComment && isRedTeam;
		const isGrouped = (state.currentCommandIds?.length || 0) > 1;
		const showGroupLink = isGrouped && !isFullList && !isPresentationMode && !isAddingCommandToComment && isRedTeam;
		const isCurrentCommandInAnnotation = commandId && commandGroup?.commandIds?.includes(commandId);

		return (
			<div {...props}>
				<div css={headerWrapperStyle}>
					<span>
						<CarbonIcon cy-test="comment-icon" icon={Chat16} />
						<Spacer />
						<Txt>
							{annotation?.user !== undefined ? (
								annotation?.user
							) : (
								<span>
									<Txt cy-test="new-comment-header" bold>
										New Comment
									</Txt>
									{state.commandIds.length > 1 && <Txt muted> on {state.commandIds.length} Commands</Txt>}
								</span>
							)}
						</Txt>
					</span>
					<Button
						cy-test="fav-comment"
						minimal
						small
						icon={<CarbonIcon icon={state.favorite ? BookmarkFilled16 : Bookmark16} />}
						onClick={state.toggleFavorite}
						disabled={!isRedTeam || isPresentationMode}
					/>
				</div>

				{state.editMode ? (
					<form
						css={formWrapperStyle}
						onKeyDownCapture={(e) => {
							if (e.metaKey && e.key === 'Enter') state.submitAnnotation();
						}}
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						{(state.destinationBeacon || state.manuallyCreatedLink) && store.router.params.currentItem === 'beacon' && (
							<div css={formInputStyle}>
								<TextArea
									css={css`
										resize: vertical;
									`}
									growVertically
									fill
									onChange={state.handleDisplayNameFieldChange}
									value={state.nameText}
									placeholder="Link Display Name (<50ch)"
									autoFocus
								/>
							</div>
						)}
						<div css={formInputStyle}>
							<TextArea
								cy-test="comment-input"
								css={css`
									resize: vertical;
								`}
								growVertically
								fill
								onChange={state.handleTextChange}
								value={state.text}
								placeholder="..."
								autoFocus
							/>
							<MultiSelect
								cy-test="tag-input1"
								createNewItemPosition="first"
								tagInputProps={{
									tagProps: { minimal: true },
									leftIcon: (
										<Txt
											cy-test="tag-input"
											css={css`
												align-self: center;
											`}
											bold
											muted
										>
											Tags:
										</Txt>
									),
									disabled: !state.editMode,
									addOnBlur: true,
									values: state.tags,
								}}
								popoverProps={{
									minimal: true,
									usePortal: true,
									captureDismiss: true,
									isOpen: state.tagQuery === '' && !state.tags.length ? undefined : !!state.tagQuery.length,
									portalContainer: popoverRef?.current?.parentElement || document.body,
									position: Position.RIGHT_TOP,
									modifiers: {
										preventOverflow: {
											enabled: true,
										},
										offset: {
											enabled: true,
										},
										hide: { enabled: false },
									},
									onInteraction: (nextOpenState: boolean) => {
										if (!nextOpenState) state.update('tagQuery', '');
									},
									onClose: (e) => {
										if (e) e.stopPropagation();
									},
								}}
								query={state.tagQuery}
								onQueryChange={(query) => state.update('tagQuery', query)}
								css={formTagInputStyle}
								items={state.autoTags}
								fill
								itemPredicate={filterTags}
								selectedItems={state.tags}
								onRemove={state.handleTagsRemove}
								onItemSelect={state.handleTagsChange}
								createNewItemFromQuery={(query) => query}
								createNewItemRenderer={(item, active, handleClick: MouseEventHandler<HTMLElement>) => (
									<MenuItem
										cy-test="add-tag"
										icon="add"
										disabled={state.tags.includes(item)}
										text={`#${item}`}
										active={active}
										onClick={handleClick}
										shouldDismissPopover={false}
									/>
								)}
								itemRenderer={(item, { modifiers, handleClick }) => (
									<MenuItem
										cy-test="tag-list-item"
										active={modifiers.active}
										key={item}
										onClick={handleClick}
										disabled={modifiers.disabled}
										text={`#${item}`}
										shouldDismissPopover={false}
									/>
								)}
								tagRenderer={(item) => item}
								// onKeyUp={state.addTagIfSpaceBar}
							/>
						</div>
						{!state.showBeaconSearch && store.router.params.currentItem === 'beacon' && (
							<Button
								text={state.addOrChangeLinkButtonText}
								onClick={state.toggleBoolBeaconSearch}
								icon={<CarbonIcon icon={Connect16} />}
								alignText={Alignment.RIGHT}
								intent={Intent.PRIMARY}
								minimal
							/>
						)}
						{state.showBeaconSearch && store.router.params.currentItem === 'beacon' && (
							<AddBeaconSelectOrSuggest
								onClick={state.toggleBoolBeaconSearch}
								commandString={commandText as string}
								onSelectBeacon={state.storeNewDestinationBeaconForLinkCreation}
							/>
						)}
						<ButtonGroup fill css={formSubmitStyle}>
							<Button
								cy-test="cancel-comment"
								text="Cancel"
								onClick={state.cancelAnnotationEdit}
								disabled={state.loading}
								alignText={Alignment.LEFT}
							/>
							<Button
								cy-test="save-comment"
								text="Comment"
								intent={Intent.PRIMARY}
								alignText={Alignment.LEFT}
								loading={state.loading}
								disabled={state.loading}
								// where the added beacon link is created
								onClick={() => state.submitAnnotation()}
								rightIcon={<CarbonIcon icon={AddComment16} />}
							/>
						</ButtonGroup>
					</form>
				) : (
					<div css={isPresentationMode ? displayWrapperPresentationStyle : displayWrapperStyle}>
						{/* <HeaderSmall css={displayTitleStyle}>{state.title}</HeaderSmall> */}

						{state.nameText.length > 0 && (
							<div css={[displayTextStyle, isPresentationMode && displayTextPresentationStyle]}>
								<Txt bold>{state.nameText}</Txt>
							</div>
						)}

						{state.text.length > 0 && (
							<div css={[displayTextStyle, isPresentationMode && displayTextPresentationStyle]}>{state.text}</div>
						)}

						<div css={displayTagsStyle}>
							{state.tags.length > 0 ? (
								state.tags.map((tag) => (
									<Txt muted small css={hashTagBeforeStyle} key={tag}>
										{tag}
									</Txt>
								))
							) : (
								<Txt disabled small italic>
									No Tags
								</Txt>
							)}
						</div>
						<div>
							<CheckForAddedLink
								commandID={state.commandIds[0]}
								containerOrBox="box"
								toggleLinkedFlag={state.flagIfManualLinkHasBeenCreated}
							/>
						</div>
						{/* )} */}
						{/* // TODO: I'm thinking maybe this should be a hover only button group in the top right to conserve space and prevent repetition  */}
						{(showEditButtons || showGroupLink) && (
							<ButtonGroup css={displayOptionStyle}>
								{showEditButtons && (
									<>
										{allowEdit && (
											<Button
												cy-test="edit-comment"
												minimal
												small
												icon={<CarbonIcon icon={Edit16} />}
												intent={Intent.PRIMARY}
												onClick={() => state.update('editMode', true)}
												text="Edit"
											/>
										)}
										{allowReply && <Button cy-test="reply" minimal small onClick={() => reply?.()} text="Reply" />}
										{allowEdit && (
											<>
												<Button
													cy-test="delete-comment"
													minimal
													small
													// intent={Intent.DANGER}
													icon={<CarbonIcon icon={TrashCan16} />}
													onClick={() => state.update('deleteAnnotationPrompt', true)}
												/>
												<Alert
													isOpen={state.deleteAnnotationPrompt}
													onClose={() => state.update('deleteAnnotationPrompt', false)}
													onConfirm={state.deleteAnnotation}
													confirmButtonText="Delete Comment"
													cancelButtonText="Cancel"
													intent={Intent.DANGER}
													canOutsideClickCancel
													canEscapeKeyCancel
												>
													<p>Are you sure you want to delete this comment?</p>
												</Alert>
											</>
										)}
									</>
								)}
								{isAddingCommandToComment &&
									(!isCurrentCommandInAnnotation ? (
										<Button
											cy-test="add-command-this-comment"
											minimal
											small
											icon={<CarbonIcon icon={customIconPaths.multiComment16} />}
											intent={Intent.PRIMARY}
											onClick={state.addCommandToAnnotation}
											text="Add command to this comment"
										/>
									) : (
										<Txt cy-test="command-added" css={addedStyles}>
											<CarbonIcon icon={Checkmark16} />
											Added
										</Txt>
									))}
								<FlexSplitter />
								{isAddingCommandToComment && (
									<Txt cy-test="number-commands" muted>
										{/* TODO: Sometimes this number is messed up? */}
										{state.currentCommandIds?.length} Command
										{(state.currentCommandIds?.length || 0) > 1 && 's'}
									</Txt>
								)}
								{showGroupLink && (
									<Button
										minimal
										small
										rightIcon={<CarbonIcon icon={ArrowRight16} />}
										onClick={() =>
											state.commandGroupId && store.campaign?.commentStore.setSelectedCommentGroup(state.commandGroupId)
										}
										text={`+${(state.currentCommandIds?.length || 0) - 1} Commands`}
									/>
								)}
							</ButtonGroup>
						)}
					</div>
				)}
			</div>
		);
	}
);

const addedStyles = css`
	color: ${TokensAll.PtIntentSuccessTextColor};
`;

const headerWrapperStyle = css`
	display: flex;
	justify-content: space-between;
	margin: 0.5rem;
`;

const hashTagBeforeStyle = css`
	&:before {
		content: '#';
	}
`;
const formWrapperStyle = css``;
const formInputStyle = css`
	margin: 0.5rem;

	& > * {
		margin-bottom: 0.25rem;
	}
`;
const formTagInputStyle = css`
	.${Classes.TAG} span {
		${hashTagBeforeStyle}
	}
`;
const formSubmitStyle = css``;

const displayWrapperStyle = css`
	margin: 0.5rem 1rem;
`;
const displayWrapperPresentationStyle = css`
	margin: 1rem;
	${displayWrapperStyle}
`;
// const displayTitleStyle = css``
const displayTextStyle = css`
	white-space: pre-wrap;
	margin-bottom: 0.5rem;
`;
const displayTextPresentationStyle = css`
	font-size: 20px;
`;
const displayTagsStyle = css`
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	margin-bottom: 0.75rem;
`;
const displayOptionStyle = css`
	margin: 0 -0.25rem;
	margin-top: 0.75rem;
	display: flex;
`;

const filterTags: ItemPredicate<string> = (query, tag, _index, exactMatch) => {
	const normalizedTag = tag?.toLowerCase();
	const normalizedQuery = query.toLowerCase();

	if (exactMatch) {
		return normalizedTag === normalizedQuery;
	} else {
		return normalizedTag?.includes(normalizedQuery);
	}
};

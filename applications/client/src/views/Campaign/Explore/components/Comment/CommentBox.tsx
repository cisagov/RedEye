import { Alignment, Button, ButtonGroup, Classes, Intent, Position, TextArea, MenuItem } from '@blueprintjs/core';
import type { ItemPredicate } from '@blueprintjs/select';
import { MultiSelect } from '@blueprintjs/select';
import {
	Add16,
	ArrowRight16,
	Star16,
	StarFilled16,
	Chat16,
	Checkmark16,
	Edit16,
	TrashCan16,
} from '@carbon/icons-react';
import { css } from '@emotion/react';
import { AlertEx, CarbonIcon, createState, customIconPaths, isDefined, semanticIcons } from '@redeye/client/components';
import type { AnnotationModel, CommandGroupModel, LinkModel, BeaconModel } from '@redeye/client/store';
import { beaconQuery, commandQuery, useStore, linkQuery } from '@redeye/client/store';
import { MitreTechniques } from '@redeye/client/store/graphql/MitreTechniquesEnum';
import { CampaignViews } from '@redeye/client/types';
import { FlexSplitter, Spacer, Txt, CoreTokens, Flex, Header, AdvancedTokens } from '@redeye/ui-styles';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps, MouseEventHandler, RefObject } from 'react';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getManualCommandLinks } from './CheckForAddedLink';
import { BeaconSuggestedRow } from './BeaconSuggestedRow';

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
	refetchComments?: () => void;
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
		refetchComments,
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
					refetchComments?.();
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
						state.updateManualLink(undefined);
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
					id: state.manualLink?.id!,
					name: state.manualLinkName,
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
						state.updateManualLink(store.graphqlStore.links.get(linkData.editLink.id));
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
					name: state.manualLinkName,
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
						state.updateManualLink(store.graphqlStore.links.get(linkData.createLink.id));
					}
				},
			}
		);

		const queryClient = useQueryClient();

		const state = createState({
			editMode: newComment || false,
			text: annotation?.text || window.localStorage.getItem('pendingComments') || '',
			manualLinkName: '',
			displayName: '',
			destinationBeacon: undefined as BeaconModel | undefined,
			manualLink: getManualCommandLinks(commandId, Array.from(store?.graphqlStore.links.values()))[0] as
				| LinkModel
				| undefined,
			tags: observable.array<string>(),
			favorite: annotation?.favorite,
			deleteAnnotationPrompt: false,
			tagQuery: '',
			loading: false,
			showBeaconSuggest: false,
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
				[
					...(Array.from(store.graphqlStore?.tags.values(), (tag) => tag.text!) || []),
					...Object.values(MitreTechniques),
				]
					?.filter((tag) => !this.tags.includes(tag))
					.sort()
					.map((tag) => tags.add(tag));
				return Array.from(tags);
			},
			toggleShowBeaconSuggest(show?: boolean) {
				this.showBeaconSuggest = show ?? !this.showBeaconSuggest;
			},
			setDestinationBeacon(beaconModel: BeaconModel | undefined) {
				this.destinationBeacon = beaconModel;
			},
			// Doesn't change graph
			updateManualLink(manualLink?: LinkModel): void {
				if (manualLink) {
					this.manualLink = manualLink;
					this.manualLinkName = manualLink.name || '';
					this.destinationBeacon = manualLink?.destination?.current;
				} else {
					this.manualLink = undefined;
					this.destinationBeacon = undefined;
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
				if (!this.commandGroupId && !!this.editMode) {
					const pendingComments = JSON.parse(window.localStorage.getItem('pendingComments') || '{}');
					delete pendingComments[this.commandIds[0]];
					window.localStorage.setItem(
						'pendingComments',
						JSON.stringify({ ...pendingComments, [this.commandIds[0]]: e.target.value })
					);
				}
			},
			handleManualLinkNameChange(e: ChangeEvent<HTMLInputElement>) {
				this.manualLinkName = e.target.value;
			},
			toggleFavorite() {
				this.favorite = !this.favorite;
				if (!this.editMode) this.submitAnnotation(true);
			},

			deleteAnnotation() {
				if (this.deleteAnnotationPrompt && annotation?.id) {
					deleteAnnotation.mutate(annotation.id);
					if (this.manualLink) {
						deleteLink.mutate(this.manualLink.id);
					}
				}
			},
			cancelAnnotationEdit() {
				if (!state.commandGroupId && !!state.editMode && state.text[0] === '{') {
					const pendingComments = JSON.parse(window.localStorage.getItem('pendingComments') || '{}');
					delete pendingComments[this.commandIds[0]];
					window.localStorage.setItem('pendingComments', JSON.stringify(pendingComments));
				}
				this.text = annotation?.text || '';
				this.tags.replace(this.defaultTags);
				this.editMode = false;
				this.loading = false;
				this.destinationBeacon = undefined;
				this.manualLink = getManualCommandLinks(commandId, Array.from(store?.graphqlStore.links.values()))[0];
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
							text: JSON.parse(window.localStorage.getItem('pendingComments') || '{}')[this.commandIds[0]],
							tags: this.tags,
							user: store.auth.userName!,
						});
						const pendingComments = JSON.parse(window.localStorage.getItem('pendingComments') || '{}');
						delete pendingComments[this.commandIds[0]];
						window.localStorage.setItem('pendingComments', JSON.stringify(pendingComments));
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
					if (state.manualLink && this.destinationBeacon) {
						// editing an existing link
						editLink.mutate(this.destinationBeacon.id);
					} else if (this.destinationBeacon) {
						// beacon selected not a currently existing link
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

		useQuery(
			[
				'comments',
				store.campaign.id,
				store.router.params.currentItem,
				store.router.params.currentItemId,
				annotation?.text,
			],
			async () =>
				store.graphqlStore.querySearchAnnotations({
					campaignId: store.campaign.id!,
					searchQuery: annotation?.text ?? '',
					hidden: store.settings.showHidden,
				})
		);

		const isPresentationMode = store.router.params.view === CampaignViews.PRESENTATION;

		const handleCommentClick = useCallback(() => {
			if (!isPresentationMode) annotation?.searchSelect();
		}, [annotation]);

		const isRedTeam = !store.appMeta.blueTeam;
		const showEditButtons = isRedTeam;
		const allowReply = !isPresentationMode && isFullList && isRedTeam;
		const allowEdit =
			(store.auth.userName === annotation?.user || !annotation?.user) && !isAddingCommandToComment && isRedTeam;
		const isGrouped = (state.currentCommandIds?.length || 0) > 1;
		const showGroupLink = isGrouped && !isFullList && !isPresentationMode && !isAddingCommandToComment && isRedTeam;
		const isCurrentCommandInAnnotation = commandId && commandGroup?.commandIds?.includes(commandId);

		const Tags = () => (
			<Flex gap={4} align="center">
				<CarbonIcon cy-test="tag-icon" icon={semanticIcons.tags} css={{ color: CoreTokens.TextMuted }} />
				{state.tags.length > 0 ? (
					state.tags.map((tag) => (
						<Txt cy-test="tags" muted small css={hashTagBeforeStyle} key={tag}>
							{tag}
						</Txt>
					))
				) : (
					<Txt disabled small italic>
						No Tags
					</Txt>
				)}
			</Flex>
		);

		return (
			<div {...props}>
				<div css={headerWrapperStyle}>
					<span>
						<CarbonIcon cy-test="comment-icon" icon={Chat16} />
						<Spacer />
						<Txt cy-test="user-that-commented" muted={annotation?.user === ''} italic={annotation?.user === ''}>
							{annotation?.user !== undefined ? (
								annotation?.user || 'parser-generated'
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
						icon={<CarbonIcon icon={state.favorite ? StarFilled16 : Star16} />}
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
						<div css={formInputStyle}>
							{/* { // store.router.params.currentItem === 'beacon' && // why is this check necessary? 
							
							// BLDSTRIKE-591 Finish implementing creating/commenting on links
							// TODO: This should be the Comment title, not just the Link title
							{(state.destinationBeacon || state.manualLink) && (
								<InputGroup
									fill
									onChange={state.handleManualLinkNameChange}
									value={state.manualLinkName}
									maxLength={50}
									placeholder="Link Display Name (<50ch)"
								/>
							)} */}
							<TextArea
								cy-test="comment-input"
								css={css`
									resize: vertical;
								`}
								growVertically
								fill
								onChange={state.handleTextChange}
								value={
									!!state.editMode && state.text[0] === '{'
										? JSON.parse(state.text || '{}')[state.commandIds[0]]
										: state.text
								}
								placeholder="..."
								autoFocus
							/>
							{!isPresentationMode ? (
								<MultiSelect
									cy-test="tag-input1"
									css={formTagInputStyle}
									placeholder="#Tags..."
									tagInputProps={{
										tagProps: { minimal: true },
										leftIcon: (
											<Flex css={{ height: 30, width: 30 }} alignSelf="center" align="center" justify="center">
												<CarbonIcon cy-test="tag-input" icon={semanticIcons.tags} />
											</Flex>
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
									query={state.tagQuery && formatTag(state.tagQuery)}
									onQueryChange={(query) => state.update('tagQuery', validateTag(query))}
									items={state.autoTags}
									fill
									createNewItemPosition="last"
									itemPredicate={filterTags}
									selectedItems={state.tags}
									onRemove={state.handleTagsRemove}
									onItemSelect={state.handleTagsChange}
									createNewItemFromQuery={(query) => validateTag(query)}
									createNewItemRenderer={(item, active, handleClick: MouseEventHandler<HTMLElement>) => (
										<MenuItem
											cy-test="add-tag"
											icon={<CarbonIcon icon={Add16} />}
											disabled={state.tags.includes(item)}
											text={formatTag(validateTag(item))}
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
											text={formatTag(item)}
											shouldDismissPopover={false}
										/>
									)}
									tagRenderer={(item) => item}
									// onKeyUp={state.addTagIfSpaceBar}
								/>
							) : (
								<Tags />
							)}
							{/* {store.router.params.currentItem === 'beacon' && ( <> // why is this check necessary? 

							// BLDSTRIKE-591 Finish implementing creating/commenting on links
							{!state.showBeaconSuggest && state.manualLink == null ? (
								<Button
									text="Link to another beacon"
									onClick={() => state.toggleShowBeaconSuggest(true)}
									icon={<CarbonIcon icon={semanticIcons.linkTo} />}
									alignText={Alignment.LEFT}
									intent={Intent.PRIMARY}
									minimal
									fill
								/>
							) : (
								<BeaconSuggest
									defaultSelectedItem={state.manualLink?.destination?.current}
									onItemSelect={state.setDestinationBeacon}
									inputProps={{
										placeholder: 'Select a beacon to link to...',
										leftElement: <CarbonIcon icon={semanticIcons.linkTo} />,
										// this will focus the input if the button is pressed and there is no input
										autoFocus: state.showBeaconSuggest,
										rightElement: (
											<Button
												icon={<CarbonIcon icon={Close16} />}
												onClick={() => {
													state.toggleShowBeaconSuggest(false);
													state.updateManualLink(undefined);
												}}
												minimal
											/>
										),
									}}
								/>
							)}
							</> )} */}
						</div>
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
								disabled={
									state.loading ||
									!(!!state.editMode && state.text[0] === '{'
										? JSON.parse(state.text || '{}')[state.commandIds[0]]
										: state.text)
								}
								// where the added beacon link is created
								onClick={() => state.submitAnnotation()}
								rightIcon={<CarbonIcon icon={semanticIcons.addComment} />}
							/>
						</ButtonGroup>
					</form>
				) : (
					<Flex column gap={4} css={displayWrapperStyle}>
						{state.manualLinkName.length > 0 && <Header>{state.manualLinkName}</Header>}

						{state.text.length > 0 && (
							<Txt
								cy-test="comment-text"
								running
								css={[
									displayTextStyle,
									!isPresentationMode && commentInteractionStyles,
									isPresentationMode && displayTextPresentationStyle,
								]}
								onClick={handleCommentClick}
							>
								{state.text}
							</Txt>
						)}

						<Tags />
						{state.manualLink?.destination?.current && (
							<Flex gap={4} align="center">
								<CarbonIcon icon={semanticIcons.link} css={{ color: CoreTokens.TextMuted }} />
								<BeaconSuggestedRow beaconModel={state.manualLink.destination?.current} small ellipsize muted />
							</Flex>
						)}
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
										{allowEdit && !isPresentationMode && (
											<>
												<Button
													cy-test="delete-comment"
													minimal
													small
													// intent={Intent.DANGER}
													icon={<CarbonIcon icon={TrashCan16} />}
													onClick={() => state.update('deleteAnnotationPrompt', true)}
												/>
												<AlertEx
													isOpen={state.deleteAnnotationPrompt}
													onClose={() => state.update('deleteAnnotationPrompt', false)}
													onConfirm={state.deleteAnnotation}
													confirmButtonText="Delete Comment"
													cancelButtonText="Cancel"
													intent={Intent.DANGER}
													canOutsideClickCancel
													canEscapeKeyCancel
												>
													Are you sure you want to delete this comment?
												</AlertEx>
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
					</Flex>
				)}
			</div>
		);
	}
);

const addedStyles = css`
	color: ${CoreTokens.TextIntentSuccess};
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
	.${Classes.INPUT} {
		padding: 0;
	}
`;
const formSubmitStyle = css``;

const displayWrapperStyle = css`
	margin: 0.5rem 1rem;
`;
const displayTextStyle = css`
	white-space: pre-wrap;
	margin-bottom: 0.5rem;
`;
const displayTextPresentationStyle = css`
	font-size: 20px;
`;
const displayOptionStyle = css`
	margin: 0 -0.25rem;
	margin-top: 0.75rem;
	display: flex;
`;
const commentInteractionStyles = css`
	cursor: pointer;
	&:hover {
		background: ${AdvancedTokens.MinimalButtonBackgroundColorHover};
	}
`;

const filterTags: ItemPredicate<string> = (query, tag, _index, exactMatch) => {
	const normalizedTag = validateTag(tag?.toLowerCase());
	const normalizedQuery = validateTag(query.toLowerCase());

	if (exactMatch) {
		return normalizedTag === normalizedQuery;
	} else {
		return normalizedTag?.includes(normalizedQuery);
	}
};

const validateTag = (tag: string) => tag.replaceAll('#', ''); // maybe remove special chars?
const formatTag = (tag: string) => `#${tag}`;

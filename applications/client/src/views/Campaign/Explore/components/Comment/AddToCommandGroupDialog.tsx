import type { DialogProps } from '@blueprintjs/core';
import { Button, InputGroup, NonIdealState } from '@blueprintjs/core';
import { Error16, Search16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, DialogCustom, escapeRegExpChars, ScrollBox, VirtualizedList } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandGroupModel } from '@redeye/client/store';
import { commandGroupQuery, useStore } from '@redeye/client/store';
import { CommentBox, MessageRow } from '@redeye/client/views';
import { Header, CoreTokens } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent } from 'react';

type AddToCommandGroupDialogProps = Omit<DialogProps, 'isOpen' | 'onClose'>;

export const AddToCommandGroupDialog = observer<AddToCommandGroupDialogProps>(({ ...props }) => {
	const store = useStore();
	const campaignId = store.campaign?.id;
	const addToCommandGroup = store.campaign.addCommandToCommandGroup;

	const commandId = addToCommandGroup.commandId;
	const isOpen = addToCommandGroup.isCommandSelected;

	const onClose = () => {
		addToCommandGroup.closeAddToCommandGroupDialog();
	};

	const state = createState({
		searchVal: '',
		commandGroups: [] as CommandGroupModel[],
		handleOnChange(e: ChangeEvent<HTMLInputElement>) {
			this.searchVal = e.target.value;
		},
		get filteredCommandGroups() {
			const commandGroups = this.commandGroups;
			if (this.searchVal.length > 0) {
				const regex = new RegExp(escapeRegExpChars(this.searchVal), 'gi');
				return commandGroups.filter((commandGroup) =>
					commandGroup.annotations.some((annotation) => {
						const text = annotation.maybeCurrent?.text;
						return text && regex.test(text);
					})
				);
			} else {
				return commandGroups;
			}
		},
	});

	// Fetch full comment list
	const { isError, isSuccess } = useQuery(
		['command-groups', campaignId],
		async () => {
			if (campaignId) {
				const resp = await store.graphqlStore.queryCommandGroups(
					{ campaignId, hidden: store.settings.showHidden },
					commandGroupQuery
				);
				if (resp.commandGroups) state.update('commandGroups', resp.commandGroups);
				return resp;
			}
		},
		{ enabled: isOpen && !!campaignId }
	);

	return (
		<DialogCustom
			css={{ padding: 0 }}
			fixedHeight
			isOpen={isOpen}
			onClose={onClose}
			transitionDuration={0}
			title={
				<Header medium>
					Add Command to Existing Comment
				</Header>
			}
			{...props}
		>
			<InputGroup
				cy-test="search-comments"
				value={state.searchVal}
				onChange={state.handleOnChange}
				leftIcon={<CarbonIcon icon={Search16} />}
				placeholder="Search comments"
				large
			/>
			<ScrollBox>
				{isSuccess && (
					<VirtualizedList defaultItemHeight={160}>
						{state.commandGroups.length === 0 ? (
							<MessageRow>No Commands</MessageRow>
						) : state.filteredCommandGroups.length === 0 ? (
							<MessageRow>No matching commands</MessageRow>
						) : (
							state.filteredCommandGroups.map((commandGroup) => (
								<CommentBox
									key={commandGroup?.annotations[0]?.current?.id}
									annotation={commandGroup?.annotations[0]?.current}
									commandGroup={commandGroup}
									commandGroupId={commandGroup?.id}
									commandId={commandId}
									isAddingCommandToComment
									css={css`
										padding: 0.5rem;
										border-bottom: 1px solid ${CoreTokens.BorderNormal};
									`}
								/>
							))
						)}
					</VirtualizedList>
				)}
				{/* {isLoading && <LoadingOverlay />} */}
				{isError && <NonIdealState title="Unable to fetch Comments" icon={<CarbonIcon icon={Error16} />} />}
			</ScrollBox>
			<Button cy-test="done-button" text="Done" onClick={onClose} intent="primary" />
		</DialogCustom>
	);
});

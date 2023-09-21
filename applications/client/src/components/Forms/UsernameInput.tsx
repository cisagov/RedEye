import { Classes, MenuItem } from '@blueprintjs/core';
import type { ItemPredicate, SuggestProps } from '@blueprintjs/select';
import { Suggest, getCreateNewItem } from '@blueprintjs/select';
import { User16, UserFollow16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, createState, escapeRegExpChars } from '@redeye/client/components';
import type { GlobalOperatorModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { UtilityStyles, Txt, CoreTokens } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';

type UsernameInputProps = Omit<
	SuggestProps<GlobalOperatorModel>,
	'itemRenderer' | 'items' | 'inputValueRenderer' | 'onItemSelect'
> & {
	username: string;
	password: string;
	softDisable: boolean;
	refetch: () => any;
	users?: GlobalOperatorModel[];
	onUsernameUpdate: (username) => void;
};

export const UsernameInput = observer<UsernameInputProps>(
	({ username, password, softDisable, refetch, users = [], onUsernameUpdate, ...props }) => {
		const store = useStore();

		const state = createState({
			activeItem: null as null | GlobalOperatorModel,
			query: username,
		});

		const { mutate: addUser } = useMutation(
			async () =>
				await store.graphqlStore.mutateCreateGlobalOperator({
					username: state.query,
					password,
				}),
			{
				onSuccess(op) {
					if (op?.createGlobalOperator) {
						refetch();
						onUsernameUpdate(state.query);
					}
				},
			}
		);

		return (
			<Suggest
				cy-test="username"
				query={state.query}
				createNewItemFromQuery={(query) => ({ name: query, id: query } as any)}
				selectedItem={
					store.graphqlStore.globalOperators.get(state.query) ||
					({ name: state.query, id: state.query } as GlobalOperatorModel)
				}
				itemPredicate={filterUsers}
				activeItem={state.activeItem || getCreateNewItem()}
				onItemSelect={(item) => {
					state.update('query', item?.name);
					onUsernameUpdate(item.name);
				}}
				onActiveItemChange={(activeItem) => {
					state.update('activeItem', activeItem);
					// if there is a plausible matching username, use it.
					// otherwise, used the typed text
					onUsernameUpdate(activeItem ? activeItem.name : state.query);
				}}
				onQueryChange={(query) => {
					state.update('query', query);
				}}
				items={users || []}
				inputValueRenderer={(item) => item.name as string}
				css={menuParentStyle}
				fill
				popoverProps={{
					minimal: true,
					matchTargetWidth: true,
				}}
				inputProps={{
					type: 'text',
					name: 'username',
					autoComplete: 'username',
					placeholder: 'user',
					leftIcon: <CarbonIcon icon={User16} />,
					large: true,
				}}
				itemRenderer={(user, { handleClick, modifiers }) => {
					if (!modifiers.matchesPredicate) return null;
					return (
						<MenuItem
							text={highlightText(user.name as string, state.query)}
							active={modifiers.active}
							disabled={modifiers.disabled}
							// label={user.campaign} // TODO: add campaign the user comes from
							key={user.name}
							onClick={handleClick}
						/>
					);
				}}
				createNewItemRenderer={
					store.appMeta.blueTeam
						? undefined
						: (_, isActive: boolean) =>
								softDisable ? (
									<div css={{ padding: '4px 12px' }}>
										<Txt small bold block css={password && { color: CoreTokens.TextIntentDanger }}>
											{password ? 'Invalid Server Password' : 'No Server Password'}
										</Txt>
										<Txt small italic muted block>
											Enter a valid password to see user options
										</Txt>
									</div>
								) : (
									<MenuItem
										icon={<CarbonIcon icon={UserFollow16} />}
										text={state.query}
										disabled={store.graphqlStore.globalOperators.has(state.query)}
										label="Add new user"
										active={isActive}
										onClick={() => addUser()}
										shouldDismissPopover={false}
										intent="primary"
										css={newUserStyle}
									/>
								)
				}
				{...props}
			/>
		);
	}
);

const menuParentStyle = css`
	.${Classes.MENU} {
		min-width: 240px;
	}
`;

const newUserStyle = css`
	border-top: 1px solid ${CoreTokens.BorderMuted};
`;

function highlightText(text: string, query: string) {
	let lastIndex = 0;
	const words = query
		.split(/\s+/)
		.filter((word) => word.length > 0)
		.map(escapeRegExpChars);
	if (words.length === 0) {
		return [text];
	}
	const regexp = new RegExp(words.join('|'), 'gi');
	const tokens: React.ReactNode[] = [];
	// eslint-disable-next-line
	while (true) {
		const match = regexp.exec(text);
		if (!match) {
			break;
		}
		const length = match[0].length;
		const before = text.slice(lastIndex, regexp.lastIndex - length);
		if (before.length > 0) {
			tokens.push(before);
		}
		lastIndex = regexp.lastIndex;
		tokens.push(
			<Txt css={UtilityStyles.textHighlight} key={lastIndex}>
				{match[0]}
			</Txt>
		);
	}
	const rest = text.slice(lastIndex);
	if (rest.length > 0) {
		tokens.push(rest);
	}
	return tokens;
}

export const filterUsers: ItemPredicate<GlobalOperatorModel> = (query, user, _index, exactMatch) => {
	const normalizedTitle = user.name?.toLowerCase();
	const normalizedQuery = query.toLowerCase();

	if (exactMatch) {
		return normalizedTitle === normalizedQuery;
	} else {
		return !!normalizedTitle?.includes(normalizedQuery);
	}
};

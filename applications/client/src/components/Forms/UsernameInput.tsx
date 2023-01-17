import { Classes, MenuItem } from '@blueprintjs/core';
import type { ItemPredicate, SuggestProps } from '@blueprintjs/select';
import { Suggest2, getCreateNewItem } from '@blueprintjs/select';
import { Add16, User16 } from '@carbon/icons-react';
import { ClassNames, css } from '@emotion/react';
import { CarbonIcon, createState, escapeRegExpChars } from '@redeye/client/components';
import type { GlobalOperatorModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { Styles, TokensAll, Txt } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';

type UsernameInputProps = Omit<
	SuggestProps<GlobalOperatorModel>,
	'itemRenderer' | 'items' | 'inputValueRenderer' | 'onItemSelect'
> & {
	username: string;
	password: string;
	disableCreateUser: boolean;
	refetch: () => any;
	users?: GlobalOperatorModel[];
	updateUser: (userName) => void;
};

export const UsernameInput = observer<UsernameInputProps>(
	({ username, password, disableCreateUser, refetch, users = [], updateUser, ...props }) => {
		const store = useStore();

		const state = createState({
			active: null as null | GlobalOperatorModel,
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
						updateUser(state.query);
					}
				},
			}
		);

		return (
			<ClassNames>
				{({ css: classCss }) => (
					// for the popoverProps.className
					<Suggest2
						cy-test="username"
						openOnKeyDown
						query={state.query}
						createNewItemFromQuery={(query) => ({ name: query, id: query } as any)}
						selectedItem={
							store.graphqlStore.globalOperators.get(state.query) ||
							({ name: state.query, id: state.query } as GlobalOperatorModel)
						}
						itemPredicate={filterUsers}
						activeItem={state.active || getCreateNewItem()}
						onItemSelect={(item) => {
							state.update('query', item?.name);
							updateUser(item.name);
						}}
						onActiveItemChange={(active) => state.update('active', active)}
						onQueryChange={(query) => state.update('query', query)}
						items={users || []}
						inputValueRenderer={(item) => item.name as string}
						css={menuParentStyle}
						fill
						popoverProps={
							{
								minimal: true,
								popoverClassName: classCss(menuParentStyle),
							} as any
						}
						inputProps={{
							value: state.query,
							onBlur: () => updateUser(state.query),
							type: 'text',
							name: 'username',
							autoComplete: 'username',
							placeholder: 'user',
							leftIcon: <CarbonIcon icon={User16} />,
							large: true,
							fill: true,
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
						createNewItemRenderer={(_, isActive: boolean) => (
							<MenuItem
								icon={<CarbonIcon icon={Add16} />}
								text="New User"
								disabled={disableCreateUser || store.graphqlStore.globalOperators.has(state.query)}
								label={state.query}
								active={isActive}
								onClick={() => addUser()}
								shouldDismissPopover={false}
								css={newUserStyle}
							/>
						)}
						{...props}
					/>
				)}
			</ClassNames>
		);
	}
);

const menuParentStyle = css`
	.${Classes.MENU} {
		min-width: 240px;
	}
`;

const newUserStyle = css`
	border-top: 1px solid ${TokensAll.BorderMuted};
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
			<Txt css={Styles.textHighlight} key={lastIndex}>
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

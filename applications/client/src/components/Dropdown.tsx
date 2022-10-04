import type { Intent, MaybeElement } from '@blueprintjs/core';
import { Button, MenuItem } from '@blueprintjs/core';
import type { ItemRenderer } from '@blueprintjs/select';
import { Select } from '@blueprintjs/select';
import { css } from '@emotion/react';
import { Txt } from '@redeye/ui-styles';
import type { FC } from 'react';

const renderSort: ItemRenderer<{ key: string; label: string }> = (item, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}
	return (
		<MenuItem
			css={css`
				text-transform: capitalize;
			`}
			active={modifiers.active}
			key={item.key}
			onClick={handleClick}
			text={item.label}
			cy-test={item.label}
		/>
	);
};

export type DropdownItem = {
	key: string;
	label: string;
	enumKey: any;
};

interface DropdownProps {
	items: DropdownItem[];
	activeItem?: DropdownItem;
	onSelect: (a: DropdownItem) => unknown;
	text?: React.ReactNode;
	labelText?: React.ReactNode;
	defaultText?: React.ReactNode;
	['cy-test']: string;
	className?: string;
	intent?: Intent;
	icon?: MaybeElement;
	disabled?: boolean;
}

export const Dropdown: FC<DropdownProps> = ({
	items,
	activeItem,
	onSelect,
	text,
	labelText,
	defaultText,
	'cy-test': cyTest,
	className,
	intent,
	icon,
	disabled,
}) => (
	<Select
		popoverProps={{ minimal: true }}
		filterable={false}
		activeItem={activeItem}
		itemRenderer={renderSort}
		items={items}
		onItemSelect={onSelect}
		disabled={disabled}
	>
		<Button
			cy-test={cyTest}
			text={
				<span>
					<Txt bold>{labelText}</Txt> <Txt css={valueStyle}>{text || defaultText}</Txt>
				</span>
			}
			minimal
			className={className}
			intent={intent}
			rightIcon={icon}
			disabled={disabled}
			small
		/>
	</Select>
);

const valueStyle = css`
	text-transform: capitalize;
	/* margin-left: 0.5rem; */
`;

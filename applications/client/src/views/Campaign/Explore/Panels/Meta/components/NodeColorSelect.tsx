import type { ButtonProps } from '@blueprintjs/core';
import { Button, MenuItem } from '@blueprintjs/core';
import type { ItemRenderer, SelectProps } from '@blueprintjs/select';
import { Select } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import type { NodeColor, NodeIconProps } from '@redeye/client/views/Campaign/Graph';
import { nodeColor } from '@redeye/client/views/Campaign/Graph';
import { largePopoverClassName } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { NodePreview } from './NodePreview';

type NodeColorSelectProps = Partial<SelectProps<NodeColorOption>> & {
	onItemSelect: SelectProps<NodeColorOption>['onItemSelect'];
	buttonProps?: ButtonProps;
	nodeIconProps?: NodeIconProps;
	value?: NodeColor;
};

export const NodeColorSelect = observer<NodeColorSelectProps>(
	({ buttonProps, nodeIconProps, popoverContentProps, ...props }) => {
		const itemRenderer: ItemRenderer<NodeColorOption> = ({ name }, { handleClick, handleFocus, modifiers }) => (
			<MenuItem
				active={modifiers.active}
				disabled={modifiers.disabled}
				key={name}
				onClick={handleClick}
				onFocus={handleFocus}
				text={<NodePreview color={name} {...nodeIconProps} shape="circle" text="color" />}
			/>
		);

		return (
			<Select
				items={nodeColorOptions}
				itemRenderer={itemRenderer}
				filterable={false}
				activeItem={nodeColorOptions.find(({ name }) => name === props.value)}
				fill
				popoverContentProps={{
					className: largePopoverClassName,
					...popoverContentProps,
				}}
				{...props}
			>
				<Button text="Color" alignText="left" rightIcon={<CarbonIcon icon={CaretDown16} />} fill {...buttonProps} />
			</Select>
		);
	}
);

export type NodeColorOption = {
	name: NodeColor;
	className: string;
	token: string;
};

const nodeColorOptions = Object.entries(nodeColor).map(([name, value]) => ({ name, ...value })) as NodeColorOption[];

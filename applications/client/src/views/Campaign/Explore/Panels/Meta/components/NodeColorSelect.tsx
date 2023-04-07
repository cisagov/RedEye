import type { ButtonProps } from '@blueprintjs/core';
import { Button, MenuItem } from '@blueprintjs/core';
import type { ItemRenderer, Select2Props } from '@blueprintjs/select';
import { Select2 } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import type { NodeColor } from '@redeye/client/views/Campaign/Graph';
import { nodeColor } from '@redeye/client/views/Campaign/Graph';
import { observer } from 'mobx-react-lite';
import { NodePreview } from './NodePreview';

type NodeColorSelectProps = Partial<Select2Props<NodeColorOption>> & { buttonProps?: ButtonProps };

export const NodeColorSelect = observer<NodeColorSelectProps>(({ buttonProps, ...props }) => (
	<Select2
		items={nodeColorOptions}
		itemRenderer={itemRenderer}
		onItemSelect={() => {}}
		filterable={false}
		fill
		{...props}
	>
		<Button text="Color" alignText="left" rightIcon={<CarbonIcon icon={CaretDown16} />} fill {...buttonProps} />
	</Select2>
));

export type NodeColorOption = {
	name: NodeColor;
	className: string;
	token: string;
};

const nodeColorOptions = Object.entries(nodeColor).map(([name, value]) => ({ name, ...value })) as NodeColorOption[];

const itemRenderer: ItemRenderer<NodeColorOption> = ({ name }, { handleClick, handleFocus, modifiers }) => (
	<MenuItem
		active={modifiers.active}
		disabled={modifiers.disabled}
		key={name}
		onClick={handleClick}
		onFocus={handleFocus}
		text={<NodePreview color={name} shape="circle" text="color" />}
	/>
);

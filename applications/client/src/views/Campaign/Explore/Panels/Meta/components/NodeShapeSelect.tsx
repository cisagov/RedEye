import type { ButtonProps } from '@blueprintjs/core';
import { Button, MenuItem } from '@blueprintjs/core';
import type { ItemRenderer, Select2Props } from '@blueprintjs/select';
import { Select2 } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import type { NodeShape } from '@redeye/graph';
import { nodeShapes } from '@redeye/graph';
import { observer } from 'mobx-react-lite';
import { NodePreview } from './NodePreview';

type NodeShapeSelectProps = Partial<Select2Props<NodeShape>> & { buttonProps?: ButtonProps };

export const NodeShapeSelect = observer<NodeShapeSelectProps>(({ buttonProps, ...props }) => (
	<Select2
		items={graphShapeOptions}
		itemRenderer={itemRenderer}
		onItemSelect={() => {}}
		filterable={false}
		fill
		css={{ color: 'red!important' }}
		{...props}
	>
		<Button text="Shape" alignText="left" rightIcon={<CarbonIcon icon={CaretDown16} />} fill {...buttonProps} />
	</Select2>
));

const graphShapeOptions = nodeShapes;

const itemRenderer: ItemRenderer<NodeShape> = (shape, { handleClick, handleFocus, modifiers }) => (
	<MenuItem
		active={modifiers.active}
		disabled={modifiers.disabled}
		key={shape}
		onClick={handleClick}
		onFocus={handleFocus}
		text={<NodePreview color="default" shape={shape} text="shape" />}
	/>
);

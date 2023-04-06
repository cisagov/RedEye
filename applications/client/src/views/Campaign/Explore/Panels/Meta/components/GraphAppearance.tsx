import { Button, MenuItem } from '@blueprintjs/core';
import type { Select2Props } from '@blueprintjs/select';
import { Select2 } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';

export const GraphColorSelect = observer<Partial<Select2Props<string>>>(({ ...props }) => {
	const itemRenderer = (item, itemProps) => <MenuItem text={item} />;
	return (
		<Select2
			items={['red', 'green', 'blue']}
			itemRenderer={itemRenderer}
			onItemSelect={(e) => console.log(e)}
			filterable={false}
			fill
			{...props}
		>
			<Button text="Color" alignText="left" rightIcon={<CarbonIcon icon={CaretDown16} />} fill />
		</Select2>
	);
});

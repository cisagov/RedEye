import { Button, Classes, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import type { TxtProps } from '@redeye/ui-styles';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

export const SlideSelector = observer<TxtProps>(({ ...props }) => {
	const store = useStore();

	return (
		<Txt cy-test="slide-count" block muted css={{ display: 'flex', alignItems: 'baseline' }} {...props}>
			{/* <span>Slide:</span> */}
			<Select
				// TODO: maybe set activeItem onActiveItemChange so keyboard works
				activeItem={store.campaign.presentation.index}
				items={Array.from(Array(store.campaign.presentation.selectedItem?.commandGroups?.length).keys(), (x) => x++)}
				onItemSelect={(item) => store.campaign.presentation.changeIndex(item)}
				itemRenderer={(item, { handleClick, modifiers }) => (
					<MenuItem
						cy-test="slide-number-selector"
						active={modifiers.active}
						onClick={handleClick}
						key={item + 1}
						text={item + 1}
					/>
				)}
				filterable={false}
				popoverProps={{
					minimal: true,
					// matchTargetWidth: true,
				}}
				css={css`
					display: inline-flex;
					align-content: baseline;
				`}
			>
				<Button
					cy-test="slide-selector"
					rightIcon={<CarbonIcon icon={CaretDown16} />}
					minimal
					intent="primary"
					small
					text={store.campaign.presentation.index + 1}
					css={css`
						&&& {
							padding: 2px 2px 2px 4px;
						}
						.${Classes.BUTTON_TEXT} {
							margin-right: 1px;
						}
					`}
				/>
			</Select>
			<span cy-test="total-slides">of {store.campaign.presentation.selectedItem?.commandGroups?.length}</span>
		</Txt>
	);
});

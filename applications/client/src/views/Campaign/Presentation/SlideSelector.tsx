import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, dateTimeFormat, timeFormat } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type SlideSelectorProps = ComponentProps<'div'> & {};

export const SlideSelector = observer<SlideSelectorProps>(({}) => {
	const store = useStore();

	const state = createState({
		get min() {
			return store.settings.momentTz(store.campaign.presentation.currentSlide?.minDate);
		},
		get max() {
			return store.settings.momentTz(store.campaign.presentation.currentSlide?.maxDate);
		},
	});

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				align-items: baseline;
				margin: 0 1.5rem;
			`}
		>
			<Txt monospace cy-test="slide-header">
				{store.campaign.presentation.currentSlide?.minDate ? state.min.format(`ddd ${dateTimeFormat}`) : 'Unknown'}
				{store.campaign.presentation.currentSlide?.commandIds?.length! > 1 && (
					<>
						<span> &mdash; </span>
						{store.campaign.presentation.currentSlide?.maxDate
							? state.max.format(state.max.dayOfYear() > state.min.dayOfYear() ? dateTimeFormat : timeFormat)
							: 'Unknown'}
					</>
				)}
			</Txt>
			<Txt cy-test="slide-count" muted>
				<span>Slide:</span>
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
					// matchTargetWidth
					popoverProps={{
						minimal: true,
					}}
					css={css`
						display: inline-block;
					`}
				>
					<Button
						cy-test="slide-selector"
						rightIcon={<CarbonIcon icon={CaretDown16} />}
						minimal
						small
						text={store.campaign.presentation.index + 1}
						css={css`
							margin-top: -3px;
						`}
					/>
				</Select>
				<span cy-test="total-slides">of {store.campaign.presentation.selectedItem?.commandGroups?.length}</span>
			</Txt>
		</div>
	);
});

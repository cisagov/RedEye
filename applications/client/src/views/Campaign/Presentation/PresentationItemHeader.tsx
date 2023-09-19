import { dateTimeFormat, timeFormat } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { Flex, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type PresentationItemHeaderProps = ComponentProps<'div'> & {};

export const PresentationItemHeader = observer<PresentationItemHeaderProps>(({}) => {
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
		<Flex css={{ padding: '2px 1rem' }}>
			<Txt monospace cy-test="slide-header">
				{store.campaign.presentation.currentSlide?.minDate ? state.min.format(`ddd ${dateTimeFormat}`) : 'Unknown'}
				{store.campaign.presentation.currentSlide?.commandIds?.length! > 1 && (
					<>
						<span> &mdash; </span>
						{store.campaign.presentation.currentSlide?.maxDate
							? state.max.format(state.max.dayOfYear() > state.min.dayOfYear() ? `ddd ${dateTimeFormat}` : timeFormat)
							: 'Unknown'}
					</>
				)}
			</Txt>
		</Flex>
	);
});

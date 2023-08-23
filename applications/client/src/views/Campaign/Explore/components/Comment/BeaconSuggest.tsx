import type { ItemPredicate, ItemRenderer, SuggestProps } from '@blueprintjs/select';
import { Suggest } from '@blueprintjs/select';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { MenuItem } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { Txt } from '@redeye/ui-styles';
import { BeaconSuggestedRow } from './BeaconSuggestedRow';

export type BeaconSuggestProps = Partial<SuggestProps<BeaconModel>>;

export const BeaconSuggest = observer<BeaconSuggestProps>(
	({ onItemSelect: _onItemSelect, popoverProps, ...suggestProps }: BeaconSuggestProps) => {
		const store = useStore();
		const beacons = Array.from(store.graphqlStore.beacons.values() || []);

		const onItemSelect: BeaconSuggestProps['onItemSelect'] = (item) => {
			_onItemSelect?.(item);
		};

		const findBeacon: ItemPredicate<BeaconModel> = (query, beaconModel) => {
			const { displayName = '', beaconName = '', host } = beaconModel;
			const { hostName = '' } = host?.current || {};
			const beaconContext = beaconModel.meta[0]?.current.username || '';
			// add serverName too?
			return [hostName, displayName, beaconName, beaconContext].join(' ').toLowerCase().includes(query.toLowerCase());
		};

		const renderMenuItem: ItemRenderer<BeaconModel> = (beaconModel, { handleClick, modifiers, query }) => {
			if (!modifiers.matchesPredicate) {
				return null;
			}
			return (
				<MenuItem
					key={beaconModel.id}
					onClick={handleClick}
					shouldDismissPopover={false}
					text={<BeaconSuggestedRow beaconModel={beaconModel} query={query} />}
					{...modifiers}
				/>
			);
		};

		const inputValueRenderer: BeaconSuggestProps['inputValueRenderer'] = (item) => item.computedNameWithHost;

		return (
			<Suggest
				items={beacons}
				itemPredicate={findBeacon}
				itemRenderer={renderMenuItem}
				inputValueRenderer={inputValueRenderer}
				popoverProps={{
					minimal: true,
					hasBackdrop: true,
					...popoverProps,
				}}
				onItemSelect={onItemSelect}
				noResults={noResults}
				resetOnQuery
				fill
				{...suggestProps}
			/>
		);
	}
);

const noResults = (
	<MenuItem
		disabled
		text={
			<Txt disabled italic>
				No Results
			</Txt>
		}
	/>
);

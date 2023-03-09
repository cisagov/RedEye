import type { ItemPredicate, ItemRenderer, Suggest2Props } from '@blueprintjs/select';
import { Suggest2 } from '@blueprintjs/select';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { MenuItem2 } from '@blueprintjs/popover2';
import { observer } from 'mobx-react-lite';
import { Txt } from '@redeye/ui-styles';
import { BeaconSuggestedRow } from './BeaconSuggestedRow';

export type BeaconSuggestProps = Partial<Suggest2Props<BeaconModel>> & {
	commandString: string;
};

export const BeaconSuggest = observer<BeaconSuggestProps>(
	({ commandString, onItemSelect: _onItemSelect, popoverProps, ...suggestProps }: BeaconSuggestProps) => {
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
				<MenuItem2
					key={beaconModel.id}
					onClick={handleClick}
					labelElement={commandString}
					shouldDismissPopover={false}
					text={<BeaconSuggestedRow beaconModel={beaconModel} query={query} />}
					{...modifiers}
				/>
			);
		};

		const inputValueRenderer: BeaconSuggestProps['inputValueRenderer'] = (item) =>
			`${item.host?.current.displayName} / ${item.displayName}`;

		return (
			<Suggest2
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
	<MenuItem2
		disabled
		text={
			<Txt disabled italic>
				No Results
			</Txt>
		}
	/>
);

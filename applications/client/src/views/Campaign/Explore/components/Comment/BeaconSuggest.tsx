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
	({ commandString, onItemSelect: _onItemSelect, popoverProps, inputProps, ...suggestProps }: BeaconSuggestProps) => {
		const store = useStore();
		const beacons = Array.from(store.graphqlStore.beacons.values() || []);

		const onItemSelect: BeaconSuggestProps['onItemSelect'] = (item) => {
			_onItemSelect?.(item);
		};

		const findBeacon: ItemPredicate<BeaconModel> = (query, beaconModel) => {
			const { displayName = '', beaconName = '', host } = beaconModel;
			const { hostName = '' } = host?.current || {};
			// add serverName too?
			return [hostName, displayName, beaconName].join(' ').toLowerCase().includes(query.toLowerCase());
		};

		const renderMenuItem: ItemRenderer<BeaconModel> = (beaconModel, { handleClick, modifiers }) => {
			if (!modifiers.matchesPredicate) {
				return null;
			}
			return (
				<MenuItem2
					key={beaconModel.id}
					onClick={handleClick}
					labelElement={commandString}
					shouldDismissPopover={false}
					text={
						<BeaconSuggestedRow
							targetHost={beaconModel.host?.current.displayName}
							targetBeacon={beaconModel.displayName}
							icon={false}
						/>
					}
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
				inputProps={{
					// autoFocus: true,
					...inputProps,
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

import type { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { Suggest2, Select2 } from '@blueprintjs/select';
import type { ComponentProps, FC } from 'react';
import { useState } from 'react';
import { Button, ButtonGroup, InputGroup, MenuItem } from '@blueprintjs/core';
import { Connect16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { BeaconSuggestedRow } from '../..';

export type AddBeaconSelectOrSuggestProps = ComponentProps<'div'> & {
	onClick: () => any;
	commandString: string;
	onSelectBeacon: (id) => any;
};

export const AddBeaconSelectOrSuggest: FC<AddBeaconSelectOrSuggestProps> = ({
	onClick,
	commandString,
	onSelectBeacon,
}: AddBeaconSelectOrSuggestProps) => {
	const initialvalue = (
		<BeaconSuggestedRow targetHost="HOST  " targetBeacon="Beacon  " reason={commandString} icon={false} />
	);

	const [selectedItem, setSelectedItem] = useState(initialvalue);

	// output is beacon suggested row object
	const handleItemSelect = (item) => {
		const newValue = (
			<BeaconSuggestedRow
				targetHost={item.host.current.displayName as string}
				targetBeacon={item.displayName as string}
				reason={commandString as string}
				icon={false}
			/>
		);
		onSelectBeacon(item);
		setSelectedItem(newValue);
	};

	const store = useStore();
	const beacons = Array.from(store.graphqlStore.beacons.values() || []);

	// checks displayName and beaconName
	const filterFilm: ItemPredicate<BeaconModel> = (query, to_beacon) => {
		const dispNameText = to_beacon.displayName;
		const nameText = to_beacon.beaconName;
		if (dispNameText) {
			return (
				nameText.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
				dispNameText?.toLowerCase().indexOf(query.toLowerCase()) >= 0
			);
		}
		return nameText.toLowerCase().indexOf(query.toLowerCase()) >= 0;
	};

	const renderMenuItem: ItemRenderer<BeaconModel> = (to_beacon, { handleClick, modifiers }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem
				multiline
				key={to_beacon.id}
				onClick={handleClick}
				shouldDismissPopover={false}
				labelElement={
					<BeaconSuggestedRow
						targetHost={to_beacon.host?.current.displayName as string}
						targetBeacon={to_beacon.displayName as string}
						reason={commandString as string}
						icon={false}
					/>
				}
			/>
		);
	};

	const suggestOrSelect = 'suggest';

	return (
		<ButtonGroup fill css={beaconSelectStyle} style={{ backgroundColor: 'black' }}>
			<Button disabled icon={<CarbonIcon icon={Connect16} />} />
			{suggestOrSelect === 'suggest' ? (
				<Suggest2
					items={beacons}
					itemPredicate={filterFilm}
					itemRenderer={renderMenuItem}
					// popoverProps={{ boundary: 'window' }}
					onItemSelect={handleItemSelect}
					noResults={<MenuItem disabled text="No results." />}
					fill
					resetOnQuery
					inputValueRenderer={(item) => `${item.host?.current.displayName as string} / ${item.displayName}` as string}
				/>
			) : (
				<Select2
					items={beacons}
					filterable
					itemPredicate={filterFilm}
					itemRenderer={renderMenuItem}
					// popoverProps={{ boundary: 'window' }}
					onItemSelect={handleItemSelect}
					// matchTargetWidth
					noResults={<MenuItem disabled text="No results." />}
					resetOnQuery
					scrollToActiveItem
				>
					<ButtonGroup>
						<InputGroup leftElement={selectedItem} rightElement={<Button icon="cross" onClick={() => onClick()} />} />
					</ButtonGroup>
				</Select2>
			)}
		</ButtonGroup>
	);
};

const beaconSelectStyle = css`
	width: 300px;
`;

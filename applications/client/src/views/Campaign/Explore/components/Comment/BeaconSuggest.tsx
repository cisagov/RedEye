import type { ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import { Suggest2 } from '@blueprintjs/select';
import type { ComponentProps, FC } from 'react';
// import { useState } from 'react';
// import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core';
// import { Connect16 } from '@carbon/icons-react';
// import { css } from '@emotion/react';
// import { CarbonIcon } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { MenuItem2 } from '@blueprintjs/popover2';
import { BeaconSuggestedRow } from './BeaconSuggestedRow';

export type BeaconSuggestProps = ComponentProps<'div'> & {
	// onClick: () => any;
	commandString: string;
	onSelectBeacon: (beacon: BeaconModel) => any;
};

export const BeaconSuggest: FC<BeaconSuggestProps> = ({
	// onClick,
	commandString,
	onSelectBeacon,
}: BeaconSuggestProps) => {
	// const initialValue = (
	// 	<BeaconSuggestedRow targetHost="HOST  " targetBeacon="Beacon  " reason={commandString} icon={false} />
	// );

	// const [selectedItem, setSelectedItem] = useState(initialValue);

	// output is beacon suggested row object
	const handleItemSelect = (item) => {
		// const newValue = (
		// 	<BeaconSuggestedRow
		// 		targetHost={item.host.current.displayName as string}
		// 		targetBeacon={item.displayName as string}
		// 		reason={commandString as string}
		// 		icon={false}
		// 	/>
		// );
		onSelectBeacon(item);
		// setSelectedItem(newValue);
	};

	const store = useStore();
	const beacons = Array.from(store.graphqlStore.beacons.values() || []);

	// checks displayName and beaconName
	const findBeacon: ItemPredicate<BeaconModel> = (query, beaconModel) => {
		const { displayName, beaconName } = beaconModel;
		if (displayName) {
			return (
				beaconName.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
				displayName?.toLowerCase().indexOf(query.toLowerCase()) >= 0
			);
		}
		return beaconName.toLowerCase().indexOf(query.toLowerCase()) >= 0;
	};

	const renderMenuItem: ItemRenderer<BeaconModel> = (beaconModel, { handleClick, modifiers }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem2
				key={beaconModel.id}
				onClick={handleClick}
				// shouldDismissPopover={false}
				{...modifiers}
				labelElement={commandString as string}
				text={
					<BeaconSuggestedRow
						targetHost={beaconModel.host?.current.displayName as string}
						targetBeacon={beaconModel.displayName as string}
						// reason={commandString as string}
						icon={false}
					/>
				}
			/>
		);
	};

	// const suggestOrSelect = 'suggest'; // Why?

	return (
		// <ButtonGroup fill css={beaconSelectStyle} style={{ backgroundColor: 'black' }}>
		// 	<Button disabled icon={<CarbonIcon icon={Connect16} />} />
		// 	{suggestOrSelect === 'suggest' ? (
		<Suggest2
			items={beacons}
			itemPredicate={findBeacon}
			itemRenderer={renderMenuItem}
			inputValueRenderer={(item) => `${item.host?.current.displayName as string} / ${item.displayName}` as string}
			popoverProps={{
				// boundary: 'window',
				minimal: true,
				hasBackdrop: true,
			}}
			inputProps={{
				autoFocus: true,
			}}
			onItemSelect={handleItemSelect}
			noResults={<MenuItem2 disabled text="No results." />}
			fill
			resetOnQuery
		/>
		// 	) : (
		// 		<Select2
		// 			items={beacons}
		// 			filterable
		// 			itemPredicate={filterFilm}
		// 			itemRenderer={renderMenuItem}
		// 			// popoverProps={{ boundary: 'window' }}
		// 			onItemSelect={handleItemSelect}
		// 			// matchTargetWidth
		// 			noResults={<MenuItem2 disabled text="No results." />}
		// 			resetOnQuery
		// 			scrollToActiveItem
		// 		>
		// 			<ButtonGroup>
		// 				<InputGroup leftElement={selectedItem} rightElement={<Button icon="cross" onClick={() => onClick()} />} />
		// 			</ButtonGroup>
		// 		</Select2>
		// 	)}
		// </ButtonGroup>
	);
};

// const beaconSelectStyle = css`
// 	width: 300px;
// `;

import { createSorter, VirtualizedList } from '@redeye/client/components';
import type { BeaconModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import type { InfoType } from '@redeye/client/types/explore';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type BeaconsProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const Beacons = observer<BeaconsProps>(({ ...props }) => {
	const store = useStore();
	const beacons = Array.from<BeaconModel>(
		store.campaign?.interactionState[`selected${props.type}`]?.current?.beacons?.values() || []
	)
		.filter((beacon: BeaconModel | Ref<BeaconModel>) => {
			const cBeacon = store.graphqlStore.beacons.get(beacon?.id as string);
			return !(!cBeacon || !!cBeacon?.host?.current?.cobaltStrikeServer);
		})
		.sort((beacon1, beacon2) =>
			'current' in beacon1 && 'current' in beacon2
				? createSorter(
						(beacon: BeaconModel | Ref<BeaconModel>) =>
							'current' in beacon ? beacon?.current[props.sort.sortBy || 'id'] : props.sort.sortBy,
						props.sort.direction === SortDirection.ASC
				  )(beacon1, beacon2)
				: createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)(beacon1, beacon2)
		);

	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight}>
			{beacons.length === 0 ? (
				<MessageRow>No Beacons</MessageRow>
			) : (
				beacons.map((beacon: BeaconModel | Ref<BeaconModel>) => (
					<BeaconRow key={beacon.id} beacon={'current' in beacon ? beacon?.current : beacon} />
				))
			)}
		</VirtualizedList>
	);
});

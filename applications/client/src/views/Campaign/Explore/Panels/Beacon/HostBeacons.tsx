import { createSorter, VirtualizedList } from '@redeye/client/components';
import type { BeaconModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import type { InfoType } from '@redeye/client/types/explore';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type BeaconsProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const HostBeacons = observer<BeaconsProps>(({ ...props }) => {
	const store = useStore();
	const beacons = (store.campaign?.interactionState.selectedHost?.current?.beaconIds
		?.map((beaconId: string | number | symbol) => store.graphqlStore.beacons.get(beaconId as string))
		.filter(
			(beacon: BeaconModel | undefined) => beacon != null && !(!beacon || !!beacon?.host?.current?.cobaltStrikeServer)
		)
		.sort(createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)) || []) as BeaconModel[];

	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight}>
			{beacons.length === 0 ? (
				<MessageRow>No Beacons</MessageRow>
			) : (
				beacons.map((beacon) => <BeaconRow key={beacon.id} beacon={beacon} />)
			)}
		</VirtualizedList>
	);
});

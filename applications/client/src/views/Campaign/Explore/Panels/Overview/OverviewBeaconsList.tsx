import { createSorter, isDefined, VirtualizedList } from '@redeye/client/components';
import type { BeaconModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OverviewProps = ComponentProps<'div'> & {
	sort: SortType;
};
export const OverviewBeaconsList = observer<OverviewProps>(({ sort }) => {
	const store = useStore();
	const beacons = Array.from(store.graphqlStore.beacons.values() || [])
		?.filter((b) => b?.host?.current?.cobaltStrikeServer === false)
		?.filter<BeaconModel>(isDefined)
		.sort(createSorter(sort.sortBy, sort.direction === SortDirection.ASC));
	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight} cy-test="beacons-view">
			{beacons.length === 0 ? (
				<MessageRow>No Beacons</MessageRow>
			) : (
				beacons.map((beacon) => <BeaconRow cy-test="beacons-row" key={beacon.id} beacon={beacon} />)
			)}
		</VirtualizedList>
	);
});

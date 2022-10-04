import { createSorter, isDefined, VirtualizedList } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OverviewProps = ComponentProps<'div'> & {
	sort: {
		sortBy: string;
		isAscending: boolean;
	};
};
export const OverviewMetadata = observer<OverviewProps>(({ sort: { sortBy: sort, isAscending } }) => {
	const store = useStore();
	const beacons = Array.from(store.graphqlStore.beacons.values() || [])
		?.filter((b) => !b?.host?.current?.cobaltStrikeServer)
		?.filter<BeaconModel>(isDefined)
		.sort(createSorter(sort, isAscending));
	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight} cy-test="beacons-view">
			{beacons.length === 0 ? (
				<MessageRow>No Beacons</MessageRow>
			) : (
				beacons.map((beacon) => <BeaconRow cy-test="beacons" key={beacon.id} beacon={beacon} />)
			)}
		</VirtualizedList>
	);
});

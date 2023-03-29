import { VirtualizedList } from '@redeye/client/components';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@redeye/client/store';
import type { BeaconsProps } from '../hooks/use-beacons';
import { useBeacons } from '../hooks/use-beacons';

export const HostBeacons = observer<BeaconsProps>(({ ...props }) => {
	const { beacons } = useBeacons(props);
	const store = useStore();
	useQuery(['beacons', 'can-hide', store.campaign?.id], async () => {
		store.graphqlStore.queryNonHideableEntities({
			campaignId: store.campaign.id!,
			beaconIds: beacons.map((beacon) => beacon.id),
		});
	});
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

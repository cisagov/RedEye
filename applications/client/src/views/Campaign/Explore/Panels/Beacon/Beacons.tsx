import { VirtualizedList } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import { useStore } from '@redeye/client/store';
import { useQuery } from '@tanstack/react-query';
import type { BeaconsProps } from '../hooks/use-beacons';
import { useBeacons } from '../hooks/use-beacons';

export const Beacons = observer<BeaconsProps>(({ ...props }) => {
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
				beacons.map((beacon: BeaconModel | Ref<BeaconModel>) => (
					<BeaconRow key={beacon.id} beacon={'current' in beacon ? beacon?.current : beacon} />
				))
			)}
		</VirtualizedList>
	);
});

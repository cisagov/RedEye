import { VirtualizedList } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { BeaconsProps } from '../hooks/use-beacons';
import { useBeacons } from '../hooks/use-beacons';

export const Beacons = observer<BeaconsProps>(({ ...props }) => {
	const { beacons } = useBeacons(props);

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

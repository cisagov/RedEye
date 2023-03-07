import { VirtualizedList } from '@redeye/client/components';
import { BeaconRow, defaultInfoRowHeight, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { BeaconsProps } from '../hooks/use-beacons';
import { useBeacons } from '../hooks/use-beacons';

export const HostBeacons = observer<BeaconsProps>(({ ...props }) => {
	const { beacons } = useBeacons(props);

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

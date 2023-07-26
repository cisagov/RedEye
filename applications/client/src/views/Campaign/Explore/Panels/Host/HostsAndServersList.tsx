import { VirtualizedList } from '@redeye/client/components';
import { defaultInfoRowHeight, HostOrServerRow, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { HostsAndServersListProps } from '../hooks/use-hosts';
import { current, useHosts } from '../hooks/use-hosts';

export const HostsAndServersList = observer<HostsAndServersListProps>(({ ...props }) => {
	const { hosts } = useHosts(props);

	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight}>
			{hosts.length === 0 ? (
				<MessageRow>No Hosts</MessageRow>
			) : (
				hosts.map((host) => <HostOrServerRow key={host.id} host={current(host)} />)
			)}
		</VirtualizedList>
	);
});

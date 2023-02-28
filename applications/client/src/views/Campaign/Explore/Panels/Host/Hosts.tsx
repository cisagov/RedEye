import { VirtualizedList } from '@redeye/client/components';
import { defaultInfoRowHeight, HostRow, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { HostsProps } from '../hooks/use-hosts';
import { current, useHosts } from '../hooks/use-hosts';

export const Hosts = observer<HostsProps>(({ ...props }) => {
	const { hosts } = useHosts(props);

	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight}>
			{hosts.length === 0 ? (
				<MessageRow>No Hosts</MessageRow>
			) : (
				hosts.map((host) => <HostRow key={host.id} host={current(host)} />)
			)}
		</VirtualizedList>
	);
});

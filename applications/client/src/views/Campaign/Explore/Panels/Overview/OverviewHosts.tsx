import { createSorter, isDefined, VirtualizedList } from '@redeye/client/components';
import type { HostModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import { defaultInfoRowHeight, HostRow, MessageRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OverviewProps = ComponentProps<'div'> & {
	sort: SortType;
};

export const OverviewHosts = observer<OverviewProps>(({ sort }) => {
	const store = useStore();
	const hosts = Array.from(store.graphqlStore?.hosts.values() || [])
		?.filter<HostModel>(isDefined)
		.sort((host1, host2) =>
			// put all servers at the top of the list, regardless of sort setting
			host1.cobaltStrikeServer === host2.cobaltStrikeServer
				? createSorter(sort.sortBy, sort.direction === SortDirection.ASC)(host1, host2)
				: host1.cobaltStrikeServer
				? -1
				: 1
		);
	return (
		<VirtualizedList fixedItemHeight={defaultInfoRowHeight}>
			{hosts.length === 0 ? <MessageRow>No Hosts</MessageRow> : hosts.map((host) => <HostRow key={host.id} host={host} />)}
		</VirtualizedList>
	);
});

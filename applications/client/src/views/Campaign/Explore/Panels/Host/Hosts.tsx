import { createSorter, VirtualizedList } from '@redeye/client/components';
import type { HostModel, SortType } from '@redeye/client/store';
import { useStore, SortDirection } from '@redeye/client/store';
import type { InfoType } from '@redeye/client/types/explore';
import { defaultInfoRowHeight, HostRow, MessageRow } from '@redeye/client/views';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HostsProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const Hosts = observer<HostsProps>(({ ...props }) => {
	const store = useStore();
	const hosts = Array.from<HostModel | Ref<HostModel>>(
		store.campaign?.interactionState[`selected${props.type}`]?.current?.hosts?.values() || []
	)
		.filter((host) => !current(host).cobaltStrikeServer) // remove servers from 'Hosts' list
		.sort(
			createSorter(
				(host: HostModel | Ref<HostModel>) => ('current' in host ? host?.current[props.sort.sortBy || 'id'] : host.id),
				props.sort.direction === SortDirection.ASC
			)
		);

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

const current = (host: HostModel | Ref<HostModel>) => ('current' in host ? host?.current : host);

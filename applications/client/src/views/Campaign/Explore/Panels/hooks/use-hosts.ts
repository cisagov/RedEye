import { createSorter } from '@redeye/client/components';
import { useStore, SortDirection } from '@redeye/client/store';
import type { HostModel, SortType } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import type { Ref } from 'mobx-keystone';
import type { ComponentProps } from 'react';

export type HostsProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const useHosts = (props?: HostsProps) => {
	const store = useStore();
	const hosts = props
		? Array.from<HostModel | Ref<HostModel>>(
				store.campaign?.interactionState[`selected${props.type}`]?.current?.hosts?.values() || []
		  )
				.filter((host) => !current(host).cobaltStrikeServer) // remove servers from 'Hosts' list
				.sort(
					createSorter(
						(host: HostModel | Ref<HostModel>) =>
							'current' in host ? host?.current[props.sort.sortBy || 'id'] : host.id,
						props.sort.direction === SortDirection.ASC
					)
				)
		: Array.from<HostModel | Ref<HostModel>>(
				store.campaign?.interactionState[`selected${InfoType.SERVER}`]?.current?.hosts?.values() || []
		  ).filter((host) => !current(host).cobaltStrikeServer); // remove servers from 'Hosts' list;

	const tabHostCount =
		window.localStorage.getItem('showHidden') === 'true'
			? hosts?.length
			: hosts?.filter((beacon) => !current(beacon).hidden).length;

	const lastTabHostToHide = tabHostCount === 1 && !current(hosts?.[0]).hidden && !store.settings.showHidden;

	return { hosts, tabHostCount, lastTabHostToHide };
};

export const current = (host: HostModel | Ref<HostModel>) => ('current' in host ? host?.current : host);

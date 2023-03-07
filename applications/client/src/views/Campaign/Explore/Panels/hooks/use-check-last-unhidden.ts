import { isDefined } from '@redeye/client/components';
import type { HostModel, BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { useMemo } from 'react';

export const useCheckLastUnhidden = (typeName: string, hidden: boolean) => {
	const store = useStore();

	const unhiddenServerCount = useMemo(
		() =>
			Array.from(store.graphqlStore?.hosts.values() || [])
				?.filter<HostModel>(isDefined)
				.filter((s) => s.cobaltStrikeServer)
				.filter((s) => !s.hidden).length,
		[store.graphqlStore?.hosts.values(), isDefined]
	);

	const unhiddenHostCount = useMemo(
		() =>
			Array.from(store.graphqlStore?.hosts.values() || [])
				?.filter<HostModel>(isDefined)
				.filter((h) => !h.cobaltStrikeServer)
				.filter((h) => !h.hidden).length,
		[store.graphqlStore?.hosts.values(), isDefined]
	);

	const unhiddenBeaconCount = useMemo(
		() =>
			Array.from(store.graphqlStore?.beacons.values() || [])
				?.filter((b) => b?.host?.current?.cobaltStrikeServer === false)
				?.filter<BeaconModel>(isDefined)
				.filter((b) => !b.hidden).length,
		[store.graphqlStore?.hosts.values(), isDefined]
	);

	const last = useMemo(
		() =>
			typeName === 'server'
				? unhiddenServerCount === 1
				: typeName === 'host'
				? unhiddenHostCount === 1
				: typeName === 'beacon'
				? unhiddenBeaconCount === 1
				: false,
		[typeName, unhiddenServerCount, unhiddenHostCount, unhiddenBeaconCount]
	);

	const isDialogDisabled = useMemo(
		() => window.localStorage.getItem('disableDialog') === 'true' && (!last || (last && hidden)),
		[window.localStorage.getItem('disableDialog'), last, hidden]
	);

	return { last, isDialogDisabled };
};

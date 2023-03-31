import { isDefined } from '@redeye/client/components';
import type { HostModel, BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useCheckNonHideableEntities = (typeName: string, hidden: boolean, beaconIds: string[]) => {
	const store = useStore();

	// const last = useMemo(
	// 	() => data?.nonHideableEntities?.beacons?.[0] === beaconIds?.[0] || false,
	// 	// typeName === 'server'
	// 	// 	? unhiddenServerCount === 1
	// 	// 	: typeName === 'host'
	// 	// 	? unhiddenHostCount === 1
	// 	// 	: typeName === 'beacon'
	// 	// 	? unhiddenBeaconCount === 1
	// 	// 	: false,
	// 	[typeName, unhiddenServerCount, unhiddenHostCount, unhiddenBeaconCount, data?.nonHideableEntities]
	// );

	const { data } = useQuery(
		['beacons', 'can-hide', store.campaign?.id],
		async () =>
			await store.graphqlStore.queryNonHideableEntities({
				campaignId: store.campaign.id!,
				// beaconIds,
				// beaconIds: ['COMPUTER02-330588776'],
				// beaconIds: ['COMPUTER03-500978634', 'COMPUTER03-1042756528'],
				beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
				// beaconIds: ['COMPUTER02-1166658656', 'COMPUTER02-2146137244'],
			})
	);
	if (data?.nonHideableEntities) {
		console.log(
			'2',
			store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
			beaconIds,
			data?.nonHideableEntities?.beacons,
			beaconIds[0] === ['COMPUTER02-330588776'][0],
			data?.nonHideableEntities?.beacons?.[0] === beaconIds?.[0]
		);
	}

	// const last = (data?.nonHideable/Entities?.beacons?.length || 0) > 0;
	const cantHideEntities = useMemo(() => (data?.nonHideableEntities?.beacons?.length || 0) > 0, [beaconIds, data]);

	const isDialogDisabled = useMemo(
		() =>
			window.localStorage.getItem('disableDialog') === 'true' && (!cantHideEntities || (cantHideEntities && hidden)),
		[window.localStorage.getItem('disableDialog'), cantHideEntities, hidden]
	);

	console.log('cantHideEntities: ', cantHideEntities, 'isDialogDisabled: ', isDialogDisabled);
	return { data, cantHideEntities, isDialogDisabled };
};

import type { HostModel, BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useCheckNonHideableEntities = async (typeName: 'Beacon' | 'Host', hidden: boolean, ids: string[]) => {
	const store = useStore();

	const entityIds = typeName === 'Beacon' ? 'beaconIds' : 'hostIds';
	const { data } = useQuery(
		['beacons', 'can-hide', store.campaign?.id],
		async () =>
			await store.graphqlStore.queryNonHideableEntities({
				campaignId: store.campaign.id!,
				[entityIds]: ids,
				// beaconIds:ids,
				// beaconIds: ['COMPUTER02-330588776'],
				// beaconIds: ['COMPUTER03-500978634', 'COMPUTER03-1042756528'],
				// beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
				// beaconIds: ['COMPUTER02-1166658656', 'COMPUTER02-2146137244'],
			})
	);

	// // Uncaught (in promise) Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
	// const data = await store.graphqlStore.queryNonHideableEntities({
	// 	campaignId: store.campaign.id!,
	// 	// ids,
	// 	// beaconIds: ['COMPUTER02-330588776'],
	// 	// beaconIds: ['COMPUTER03-500978634', 'COMPUTER03-1042756528'],
	// 	// beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
	// 	// beaconIds: ['COMPUTER02-1166658656', 'COMPUTER02-2146137244'],
	// 	[entityIds]: ids,
	// });

	if (data?.nonHideableEntities) {
		console.log(
			'2',
			store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
			ids,
			data?.nonHideableEntities?.beacons,
			ids[0] === ['COMPUTER02-330588776'][0],
			data?.nonHideableEntities?.beacons?.[0] === ids?.[0]
		);
	}

	const cantHideEntities = useMemo(() => (data?.nonHideableEntities?.beacons?.length || 0) > 0, [ids, data]);

	const isDialogDisabled = useMemo(
		() =>
			window.localStorage.getItem('disableDialog') === 'true' && (!cantHideEntities || (cantHideEntities && hidden)),
		[window.localStorage.getItem('disableDialog'), cantHideEntities, hidden]
	);

	console.log('cantHideEntities: ', cantHideEntities, 'isDialogDisabled: ', isDialogDisabled);
	return { data, cantHideEntities, isDialogDisabled };
};

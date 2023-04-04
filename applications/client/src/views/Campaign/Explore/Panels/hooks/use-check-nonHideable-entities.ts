import { useStore } from '@redeye/client/store';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useCheckNonHideableEntities = (
	typeName: 'beacons' | 'hosts' | 'servers',
	hidden: boolean,
	ids: string[]
) => {
	const store = useStore();

	const entityIds = typeName === 'beacons' ? 'beaconIds' : 'hostIds';
	const { data } = useQuery(
		[typeName, 'can-hide', store.campaign?.id, ids],
		async () =>
			await store.graphqlStore.queryNonHideableEntities({
				campaignId: store.campaign.id!,
				[entityIds]: ids,
				// beaconIds: ids,
				// beaconIds: ['COMPUTER02-330588776'],
				// beaconIds: ['COMPUTER03-500978634', 'COMPUTER03-1042756528'],
				// beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons.map((beaconId) => beaconId),
				// beaconIds: ['COMPUTER02-1166658656', 'COMPUTER02-330588776', 'COMPUTER02-2146137244'],
			})
	);

	const cantHideEntities = useMemo(() => (data?.nonHideableEntities?.[typeName]?.length || 0) > 0, [ids, data]);

	const isDialogDisabled = useMemo(
		() =>
			window.localStorage.getItem('disableDialog') === 'true' && (!cantHideEntities || (cantHideEntities && hidden)),
		[window.localStorage.getItem('disableDialog'), cantHideEntities, hidden]
	);

	// console.log('data', data, 'cantHideEntities: ', cantHideEntities, 'isDialogDisabled: ', isDialogDisabled);
	return { data, cantHideEntities, isDialogDisabled };
};

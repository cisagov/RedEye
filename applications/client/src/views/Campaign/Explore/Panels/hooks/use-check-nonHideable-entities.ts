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
			})
	);

	const cantHideEntities = useMemo(() => (data?.nonHideableEntities?.[typeName]?.length || 0) > 0, [ids, data]);

	const isDialogDisabled = useMemo(
		() =>
			window.localStorage.getItem('disableDialog') === 'true' && (!cantHideEntities || (cantHideEntities && hidden)),
		[window.localStorage.getItem('disableDialog'), cantHideEntities, hidden]
	);

	return { data, cantHideEntities, isDialogDisabled };
};

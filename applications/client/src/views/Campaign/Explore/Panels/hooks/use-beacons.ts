import { createSorter } from '@redeye/client/components';
import { SortDirection, useStore } from '@redeye/client/store';
import type { SortType, BeaconModel } from '@redeye/client/store';
import type { Ref } from 'mobx-keystone';
import { InfoType } from '@redeye/client/types';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

export type BeaconsProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const useBeacons = (props?: BeaconsProps) => {
	const store = useStore();

	const beacons =
		store.router.params.currentItem === 'server'
			? props
				? Array.from<BeaconModel>(
						store.campaign?.interactionState[`selected${props.type}`]?.current?.beacons?.values() || []
				  )
						.filter((beacon: BeaconModel | Ref<BeaconModel>) => {
							const cBeacon = store.graphqlStore.beacons.get(beacon?.id as string);
							return !(!cBeacon || !!cBeacon?.host?.current?.cobaltStrikeServer);
						})
						.sort((beacon1, beacon2) =>
							'current' in beacon1 && 'current' in beacon2
								? createSorter(
										(beacon: BeaconModel | Ref<BeaconModel>) =>
											'current' in beacon ? beacon?.current[props.sort.sortBy || 'id'] : props.sort.sortBy,
										props.sort.direction === SortDirection.ASC
								  )(beacon1, beacon2)
								: createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)(beacon1, beacon2)
						)
				: Array.from<BeaconModel>(
						// @ts-ignore
						store.campaign?.interactionState[`selected${InfoType.SERVER}`]?.current?.beacons?.values() || []
				  ).filter((beacon: BeaconModel | Ref<BeaconModel>) => {
						const cBeacon = store.graphqlStore.beacons.get(beacon?.id as string);
						return !(!cBeacon || !!cBeacon?.host?.current?.cobaltStrikeServer);
				  })
			: props
			? ((store.campaign?.interactionState.selectedHost?.current?.beaconIds
					?.map((beaconId: string | number | symbol) => store.graphqlStore.beacons.get(beaconId as string))
					.filter(
						(beacon: BeaconModel | undefined) => beacon != null && !(!beacon || !!beacon?.host?.current?.cobaltStrikeServer)
					)
					.sort(createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)) || []) as BeaconModel[])
			: ((store.campaign?.interactionState.selectedHost?.current?.beaconIds
					?.map((beaconId: string | number | symbol) => store.graphqlStore.beacons.get(beaconId as string))
					.filter(
						(beacon: BeaconModel | undefined) => beacon != null && !(!beacon || !!beacon?.host?.current?.cobaltStrikeServer)
					) || []) as BeaconModel[]);

	const tabBeaconCount = useMemo(
		() =>
			window.localStorage.getItem('showHidden') === 'true'
				? beacons?.length
				: beacons?.filter((beacon) => !currentBeacon(beacon).hidden).length,
		[window.localStorage.getItem('showHidden'), beacons]
	);

	const lastTabBeaconToHide = tabBeaconCount === 1 && !currentBeacon(beacons?.[0]).hidden && !store.settings.showHidden;

	return { beacons, tabBeaconCount, lastTabBeaconToHide };
};

export const currentBeacon = (beacon: BeaconModel | Ref<BeaconModel>) =>
	'current' in beacon ? beacon?.current : beacon;

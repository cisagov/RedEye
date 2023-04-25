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

	const getBeacons = () => {
		if (store.router.params.currentItem === 'server') {
			if (props) {
				return Array.from<BeaconModel>(
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
					);
			} else {
				return Array.from<BeaconModel>(
					// @ts-ignore
					store.campaign?.interactionState[`selected${InfoType.SERVER}`]?.current?.beacons?.values() || []
				).filter((beacon: BeaconModel | Ref<BeaconModel>) => {
					const cBeacon = store.graphqlStore.beacons.get(beacon?.id as string);
					return !(!cBeacon || !!cBeacon?.host?.current?.cobaltStrikeServer);
				});
			}
		} else if (props) {
			return (store.campaign?.interactionState.selectedHost?.current?.beaconIds
				?.map((beaconId: string | number | symbol) => store.graphqlStore.beacons.get(beaconId as string))
				.filter(
					(beacon: BeaconModel | undefined) =>
						beacon != null && !(!beacon || !!beacon?.host?.current?.cobaltStrikeServer)
				)
				.sort(createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)) || []) as BeaconModel[];
		} else {
			return (store.campaign?.interactionState.selectedHost?.current?.beaconIds
				?.map((beaconId: string | number | symbol) => store.graphqlStore.beacons.get(beaconId as string))
				.filter(
					(beacon: BeaconModel | undefined) =>
						beacon != null && !(!beacon || !!beacon?.host?.current?.cobaltStrikeServer)
				) || []) as BeaconModel[];
		}
	};

	const tabBeaconCount = useMemo(
		() =>
			store.settings.showHidden
				? getBeacons()?.length
				: getBeacons()?.filter((beacon) => !currentBeacon(beacon).hidden).length,
		[store.settings.showHidden, getBeacons]
	);

	const lastTabBeaconToHide = useMemo(
		() =>
			((tabBeaconCount === 1 && !currentBeacon(getBeacons()?.[0]).hidden) ||
				tabBeaconCount === store.campaign.beaconGroupSelect.selectedBeacons.length) &&
			!store.settings.showHidden,
		[store.settings.showHidden, tabBeaconCount, store.campaign.beaconGroupSelect.selectedBeacons]
	);

	return { beacons: getBeacons(), tabBeaconCount, lastTabBeaconToHide };
};

export const currentBeacon = (beacon: BeaconModel | Ref<BeaconModel>) =>
	'current' in beacon ? beacon?.current : beacon;

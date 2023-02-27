import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { Tabs } from '@redeye/client/types';
import { useMutation } from '@tanstack/react-query';
import { useBeacons } from './use-beacons';
import { useHosts } from './use-hosts';

export function useToggleHidden(mutation: () => Promise<any>) {
	const store = useStore();

	const { lastTabBeaconToHide } = useBeacons();
	const { lastTabHostToHide } = useHosts();

	const lastTabItem =
		store.router.params.tab === Tabs.BEACONS
			? lastTabBeaconToHide
			: store.router.params.tab === Tabs.HOSTS
			? lastTabHostToHide
			: false;

	const state = createState({
		showHide: false,
		refreshHiddenState() {
			this.showHide = false;
			store.router.updateRoute({
				path: store.router.currentRoute,
				params:
					store.router.params.tab === Tabs.METADATA
						? {
								currentItem: 'all',
								currentItemId: undefined,
								tab: store.router.params.currentItem === 'beacon' ? Tabs.BEACONS : Tabs.HOSTS,
						  }
						: {
								currentItem: lastTabItem ? 'all' : store.router.params.currentItem,
								currentItemId: lastTabItem ? undefined : store.router.params.currentItemId,
								tab: lastTabItem ? Tabs.HOSTS : store.router.params.tab || Tabs.HOSTS,
						  },
			});

			store.reset(false);
			store.campaign.refetch();
			store.campaign.search.clearSearch();
		},
	});

	const mutate = useMutation(async () => await mutation(), {
		onSuccess: () => {
			state.refreshHiddenState();
		},
	});
	return [state, mutate] as const;
}

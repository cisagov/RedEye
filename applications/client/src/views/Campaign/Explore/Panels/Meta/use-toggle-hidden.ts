import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { Tabs } from '@redeye/client/types';
import { useMutation } from '@tanstack/react-query';

export function useToggleHidden(mutation: () => Promise<any>) {
	const store = useStore();

	const state = createState({
		showHide: false,
		refreshHiddenState() {
			this.showHide = false;
			store.router.updateRoute({
				path: store.router.currentRoute,
				params: {
					currentItem: 'all',
					currentItemId: undefined,
					tab:
						store.router.params.tab === Tabs.METADATA
							? store.router.params.currentItem === 'beacon'
								? Tabs.BEACONS
								: Tabs.HOSTS
							: store.router.params.tab || Tabs.HOSTS,
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

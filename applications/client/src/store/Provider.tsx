import { observer } from 'mobx-react-lite';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { AppStore } from './app-store';

const StoreContext = createContext<null | AppStore>(null);

export function useStore(): AppStore {
	const rootStore = useContext(StoreContext);
	if (rootStore === null) {
		throw new Error('store cannot be null, please add a context provider');
	}
	return rootStore;
}

export const AppStoreProvider = observer((props: PropsWithChildren<{ store: AppStore }>) => (
	<StoreContext.Provider value={props.store}>{props.children}</StoreContext.Provider>
));

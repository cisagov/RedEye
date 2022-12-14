import { Global } from '@emotion/react';
import { globalStyle } from '@redeye/ui-styles';
import { QueryClientProvider } from '@tanstack/react-query';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { updateAppTheme } from './components';
import { CustomRouter } from './CustomRouter';
import { AppStoreProvider, store } from './store';

// necessary for blueprint to function
import 'blueprint-styler/base/blueprint-tokens.css';
import 'blueprint-styler/base/blueprint.css';
import 'blueprint-styler/overrides/carbon/override-tokens.css';
import 'blueprint-styler/overrides/carbon/override.css';

updateAppTheme();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Global styles={globalStyle} />
		<AppStoreProvider store={store}>
			<QueryClientProvider client={store.queryClient}>
				<CustomRouter history={store.router.history}>
					<App />
				</CustomRouter>
			</QueryClientProvider>
		</AppStoreProvider>
	</StrictMode>
);

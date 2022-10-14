import type { History, Update } from 'history';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import { useLayoutEffect } from 'react';
import { Router } from 'react-router-dom';
import { createState } from './components/mobx-create-state';

export interface BrowserRouterProps {
	basename?: string;
	children?: ReactNode;
	history: History;
}

export const CustomRouter = observer<BrowserRouterProps>(({ basename, children, history }) => {
	const state = createState({
		action: history.action,
		location: history.location,
		setState(newState: Update) {
			this.action = newState.action;
			this.location = newState.location;
		},
	});

	useLayoutEffect(() => history.listen(state.setState), [history]);

	return (
		<Router
			basename={basename}
			children={children}
			location={state.location}
			navigationType={state.action}
			navigator={history}
		/>
	);
});

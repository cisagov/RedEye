import { ExtendedModel, model, modelAction, modelFlow, prop } from 'mobx-keystone';
import { RedEyeRoutes } from './routing';
import { RedEyeModel } from './util/model';

export const defaultServerUrl = 'http://localhost:4000';

@model('Auth')
export class Auth extends ExtendedModel(RedEyeModel, {
	promptAuth: prop<boolean>(false).withSetter(),
	hasClickedAuthDialog: prop<boolean>(false).withSetter(),
	user: prop<string>(() => localStorage.getItem('user') ?? ''),
	serverUrl: prop<string>(() => (import.meta.env.DEV || globalThis.Cypress ? defaultServerUrl : '')),
}) {
	get userName(): string | null {
		return localStorage.getItem('user');
	}

	@modelAction setUser(username: string) {
		localStorage.setItem('user', username);
		this.user = username;
	}

	@modelFlow *protectedFetch(input: Request | string, init?: RequestInit | undefined) {
		const d: Response = yield fetch(input, init);
		if (d.status === 401) this.logOut();
		return d;
	}

	/**
	 * Logs the user out of the application.
	 * @returns {Generator<Promise<Response>, Response, unknown>}
	 */
	@modelFlow
	*logOut() {
		try {
			yield fetch(`${this.serverUrl}/api/logout`, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'include',
			});
			this.appStore?.router.updateRoute({ path: RedEyeRoutes.LOGIN });
			window.localStorage.removeItem('pendingComments');
		} catch (e) {
			this.appStore?.router.updateRoute({ path: RedEyeRoutes.LOGIN });
			window.console.debug(e);
		}
	}

	/**
	 * Checks if the sever is still returning a response
	 */
	@modelFlow
	*checkServerConnection() {
		if (!this.hasClickedAuthDialog) {
			let canConnect = false;
			try {
				const res = yield fetch(`${this.serverUrl}/api/loginStatus`, { credentials: 'include' });
				const data = yield res.json();
				canConnect = data.auth;
				// eslint-disable-next-line no-empty
			} catch (e) {}
			if (!canConnect) {
				this.setPromptAuth(true);
			}
		}
	}
}

import { Button, Callout, InputGroup, Intent } from '@blueprintjs/core';
import { ArrowRight16, Password16, Warning20 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, UsernameInput } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { routes } from '@redeye/client/store/routing/router';
import { Views } from '@redeye/client/types';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, FormEvent } from 'react';
import { createState } from '../mobx-create-state';

type LoginFormProps = ComponentProps<'form'> & {
	submitText?: string;
};

const isDevelop = import.meta.env.DEV;

export const LoginForm = observer<LoginFormProps>(({ onSubmit, submitText = 'Login', ...props }) => {
	const store = useStore();
	const state = createState({
		username: isDevelop ? store.auth.userName || 'dev' : store.auth.userName || '',
		password: '',
		passwordFocus: false,
		loading: false,
		errorMessage: '',
		*handleSubmit(event: FormEvent<HTMLFormElement>) {
			event.preventDefault();
			this.loading = true;
			if (store.appMeta.blueTeam) {
				store.auth.setUser(this.username);
				store.router.updateRoute({ path: routes[Views.CAMPAIGNS_LIST], params: { id: 'all' } });
				if (onSubmit) onSubmit(event);
			} else {
				// Make login call
				const formData = new FormData();
				formData.append('password', this.password);
				try {
					const loginResponse: Response = yield fetch(`${store.auth.serverUrl}/api/login`, {
						method: 'POST',
						mode: 'cors',
						cache: 'no-cache',
						credentials: 'include',
						body: formData,
					});
					// TODO: could set a state that makes the password and server inputs invalid?
					this.loading = false;
					if (loginResponse.status === 401) {
						if (!this.password) this.errorMessage = 'Password Required';
						else this.errorMessage = 'Incorrect password';
					} else if (loginResponse.status === 400 || loginResponse.status > 401)
						this.errorMessage = 'Error communicating with server';
					else if (loginResponse.status !== 200) this.errorMessage = 'Error logging in';
					else {
						this.errorMessage = '';
						if (this.username !== store.auth.userName) {
							window.localStorage.removeItem('pendingComments');
						}
						store.auth.setUser(this.username);
						store.router.updateRoute({ path: routes[Views.CAMPAIGNS_LIST], params: { id: 'all' } });
						if (onSubmit) onSubmit(event);
					}
				} catch (e) {
					this.loading = false;
					this.errorMessage = 'Error communicating with server';
				}
			}
		},
	});

	const { data, refetch } = useQuery(
		['users', state.password],
		async () => await store.graphqlStore.queryGlobalOperators({ password: state.password }),
		{
			enabled: !!state.password && !state.passwordFocus,
		}
	);

	return (
		<form cy-test="login-form" {...props} onSubmit={state.handleSubmit} autoComplete="on">
			{!store.appMeta.blueTeam && (
				<>
					<InputGroup
						value={state.password}
						onChange={(e) => state.update('password', e.target.value)}
						cy-test="password"
						autoComplete="password"
						type="password"
						name="password"
						placeholder="server password"
						css={inputSpacingTightStyle}
						onFocus={() => state.update('passwordFocus', true)}
						onBlur={() => state.update('passwordFocus', false)}
						leftIcon={<CarbonIcon icon={Password16} />}
						large
					/>
				</>
			)}
			<UsernameInput
				cy-test="username"
				username={state.username}
				password={state.password}
				refetch={refetch}
				softDisable={!data}
				users={data?.globalOperators}
				onUsernameUpdate={(username) => state.update('username', username)}
				css={otherSpacingLooseStyle}
			/>
			{!!state.errorMessage && (
				<Callout
					css={otherSpacingLooseStyle}
					intent={Intent.DANGER}
					icon={<CarbonIcon icon={Warning20} />}
					children={state.errorMessage}
				/>
			)}
			<Button
				cy-test="login-btn"
				text={submitText}
				loading={state.loading}
				intent="primary"
				css={otherSpacingLooseStyle}
				disabled={state.username.length < 1 || state.password.length < 1}
				type="submit"
				rightIcon={<CarbonIcon icon={ArrowRight16} />}
				large
			/>
		</form>
	);
});

const inputSpacingTightStyle = css`
	margin-bottom: 0.5rem;
`;
const otherSpacingLooseStyle = css`
	margin-bottom: 1rem;
`;

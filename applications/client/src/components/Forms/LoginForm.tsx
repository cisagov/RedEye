import { Button, Callout, Collapse, InputGroup, Intent } from '@blueprintjs/core';
import { ArrowRight16, CheckmarkOutline16, Password16, Warning20 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, UsernameInput } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { routes } from '@redeye/client/store/routing/router';
import { Views } from '@redeye/client/types';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, FormEvent } from 'react';
import { createState } from '../mobx-create-state';
import { Flex, flexChild } from '@redeye/ui-styles';

type LoginFormProps = ComponentProps<'form'>;

const isDevelop = import.meta.env.DEV;

export const LoginForm = observer<LoginFormProps>(({ ...props }) => {
	const store = useStore();
	const state = createState({
		username: isDevelop ? store.auth.userName || 'dev' : store.auth.userName || '',
		password: '',
		passwordFocus: false,
		loading: false,
		connected: false,
		errorMessage: '',
		*handleConnect(event: FormEvent<HTMLFormElement>) {
			event.preventDefault();
			console.log('submit');

			this.loading = true;
			// if (store.appMeta.blueTeam) {
			// 	store.auth.setUser(this.username);
			// 	store.router.updateRoute({ path: routes[Views.CAMPAIGNS_LIST], params: { id: 'all' } });
			// 	if (onSubmit) onSubmit(event);
			// } else {

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
				this.loading = false;
				if (loginResponse.status === 401) {
					if (!this.password) this.errorMessage = 'Password Required';
					else this.errorMessage = 'Incorrect password';
				} else if (loginResponse.status === 400 || loginResponse.status > 401) {
					this.errorMessage = 'Error communicating with server';
				} else if (loginResponse.status !== 200) {
					this.errorMessage = 'Error logging in';
				} else {
					this.errorMessage = '';
					this.connected = true;
				}
			} catch (e) {
				this.loading = false;
				this.errorMessage = 'Error communicating with server';
			}
		},
		handleLogin() {
			if (this.username !== store.auth.userName) {
				window.localStorage.removeItem('pendingComments');
			}
			store.auth.setUser(this.username);
			store.router.updateRoute({ path: routes[Views.CAMPAIGNS_LIST], params: { id: 'all' } });
		},
	});

	return (
		<form cy-test="login-form" onSubmit={state.handleConnect} autoComplete="on" {...props}>
			<Flex column gap={4}>
				{!store.appMeta.blueTeam && (
					<Flex gap={1}>
						<InputGroup
							value={state.password}
							onChange={(e) => state.update('password', e.target.value)}
							cy-test="password"
							autoComplete="password"
							type="password"
							name="password"
							placeholder="server password"
							css={inputStyle}
							leftIcon={<CarbonIcon icon={Password16} />}
							large
							disabled={state.connected}
						/>
						<Button
							cy-test="connect-btn"
							text={state.connected ? 'Connected' : 'Connect'}
							css={buttonStyle}
							loading={state.loading}
							disabled={state.connected || state.password.length < 1}
							type="submit" // {!state.connected ? 'submit' : undefined}
							intent={!state.connected ? 'primary' : 'none'}
							rightIcon={<CarbonIcon icon={state.connected ? CheckmarkOutline16 : ArrowRight16} />}
							large
							alignText="left"
						/>
					</Flex>
				)}
				<Flex gap={1}>
					<UsernameInput
						cy-test="username"
						username={state.username}
						password={state.password}
						connected={state.connected}
						// refetch={refetch}
						// disableCreateUser={!data}
						// users={data?.globalOperators}
						onUsernameUpdated={(username) => state.update('username', username)}
						css={inputStyle}
						disabled={!state.connected}
					/>
					<Button
						cy-test="login-btn"
						text="Login"
						intent={state.connected ? 'primary' : 'none'}
						css={buttonStyle}
						// type={state.connected ? 'submit' : undefined}
						disabled={!(state.username.length > 1 && state.connected)}
						rightIcon={<CarbonIcon icon={ArrowRight16} />}
						onClick={state.handleLogin}
						large
						alignText="left"
					/>
				</Flex>
				{!!state.errorMessage && (
					<Callout
						css={inputStyle}
						intent={Intent.DANGER}
						icon={<CarbonIcon icon={Warning20} />}
						children={state.errorMessage}
					/>
				)}
			</Flex>
		</form>
	);
});

const buttonStyle = css`
	flex: 0 0 auto;
	width: 120px;
`;
const inputStyle = css`
	flex: 1 1 auto;
`;

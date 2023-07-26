import type { Request } from 'express';
import type { ConfigDefinition } from './config';
import { decrypt, encrypt, hash } from './crypto';

export const COOKIE_KEY = 'REDEYE';

type ApplicationCookie = {
	[COOKIE_KEY]?: string;
};

type AuthObject = {
	hashKey?: string;
};

export const isAuthRest = (req: Request<any>, config: ConfigDefinition) => {
	const authed = isAuth(config, req?.cookies);
	return authed;
};

export const isAuth = (config: ConfigDefinition, cookies: ApplicationCookie | undefined) => {
	if (cookies && cookies.REDEYE) {
		const decryptedObject = decrypt<AuthObject>(config, cookies.REDEYE);
		const { password } = config;

		const authStatus = decryptedObject?.hashKey === hash(password!);
		return authStatus;
	}
	return false;
};

export const createAuthToken = (config: ConfigDefinition, password: string) => {
	return encrypt(config, { hashKey: hash(password) });
};

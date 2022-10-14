import { COOKIE_KEY, createAuthToken, isAuthRest } from '../auth';
import { Router } from 'express';
import type { EndpointContext } from '../types';

/**
 * Route serving campaign db upload
 *
 *  @name post/login
 *  @route /auth/login
 *  @memberof campaign
 */

type requestBody = { password: string };

export function login(app: Router, context: EndpointContext) {
	const { config } = context;
	const correctPassword = config.password;
	app.post<never, any, requestBody>('/login', async (req, res) => {
		const password = req.body?.password;
		if (!password) return res.status(401).send({ auth: false, token: null });

		if (password === correctPassword) {
			const token = createAuthToken(config, password);
			return res.status(200).cookie(COOKIE_KEY, token, { httpOnly: true }).send({ auth: true, token });
		} else {
			return res.status(401).send({ auth: false, token: null });
		}
	});
	app.post<never, any, requestBody>('/logout', async (_, res) => {
		return res.clearCookie(COOKIE_KEY, { httpOnly: true }).send();
	});
}

export function loginStatus(app: Router, context: EndpointContext) {
	const { config } = context;
	app.get('/loginStatus', async (req, res) => {
		if (isAuthRest(req, config)) {
			return res.status(200).send({ auth: true });
		} else {
			return res.status(401).send({ auth: false });
		}
	});
}

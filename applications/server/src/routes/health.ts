import { isAuthRest } from '../auth';
import type { Router } from 'express';
import type { EndpointContext } from '../types';

/**
 * Route serving campaign db upload
 *
 *  @name get/health
 *  @route /auth/login
 *  @memberof campaign
 */

export function health(app: Router, context: EndpointContext) {
	const { config } = context;
	app.get('/health', async (req, res) => {
		return res.status(200).send({ auth: isAuthRest(req, config) });
	});
}

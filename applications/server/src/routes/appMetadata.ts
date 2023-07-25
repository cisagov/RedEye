import type { Router } from 'express';
import type { EndpointContext } from '../types';

export function appMetadata(app: Router, context: EndpointContext) {
	app.get('/appMetadata', async (_, res) => {
		const { config } = context;
		res.send({
			blueTeam: config.blueTeam,
		});
	});
}

import { isAuthRest } from '../auth';
import { Image } from '@redeye/models';

import { connectToProjectEmOrFail } from '../store/utils/project-db';
import type { Router } from 'express';
import type { EndpointContext } from '../types';

/**
 *  @description Route serving image downloads
 *  @name get/image
 *  @route /api/image/:campaignId/:imageName
 *  @memberof image
 */

type requestParams = { campaignId: string; imageName: string };

export function requestImage(app: Router, context: EndpointContext) {
	const { config } = context;
	const isBlue = !config.redTeam;
	// log file upload
	app.get<requestParams>('/image/:campaignId/:imageName', async (req, res) => {
		const { campaignId, imageName } = req.params;
		if (!isBlue && !isAuthRest(req, config)) return res.sendStatus(401);

		try {
			const imageId = imageName.replace('.jpg', '');
			const em = await connectToProjectEmOrFail(campaignId, context);

			const image = await em.findOneOrFail(Image, imageId);
			res.set('Content-Type', 'image/jpeg');
			res.set('Content-disposition', 'inline');

			return res.send(image.blob);
		} catch (e) {
			return res.sendStatus(404);
		}
	});
}

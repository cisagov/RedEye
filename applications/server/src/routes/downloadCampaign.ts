import path from 'path';
import { isAuthRest } from '../auth';
import { getDbPath } from '../util';
import type { Router, Response } from 'express';
import type { EndpointContext } from '../types';
import { rmSync } from 'fs-extra';

/**
 * Route serving campaign db download
 *
 *  @description This is best hit with an anchor rather than the fetch API
 *  @name get/campaign
 *  @route /campaign/download/:campaignId
 *  @memberof campaign
 */

type requestParams = { fileName: UUID };

export function downloadCampaign(app: Router, context: EndpointContext) {
	const { config } = context;
	const isBlue = config.blueTeam;

	app.get<requestParams>('/campaign/download/:fileName', async (req, res): Promise<void | Response> => {
		const { fileName } = req.params;
		if (!isBlue && !isAuthRest(req, config)) return res.sendStatus(401);
		const tempPath = path.join(getDbPath(config.databaseMode), 'anonymized-campaigns', fileName);
		if (fileName.indexOf('\0') !== -1) return res.status(500).send('illegal operation');
		if (!/campaign-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gm.test(fileName))
			return res.status(500).send('illegal character');
		return res.status(200).download(path.join(tempPath, 'db.redeye'), () => {
			rmSync(tempPath, { recursive: true });
		});
	});
}

import { Campaign } from '@redeye/models';
import { getMigratedCampaignORM } from '@redeye/migrations';
import { UploadedFile } from 'express-fileupload';
import * as path from 'path';
import { getDbPath } from '../util';
import { isAuthRest } from '../auth';
import { updateProjectMetadata } from '../machines/updateProjectMetadata.service';
import fs from 'fs-extra';
import { getMainEmOrFail } from '../store/utils/project-db';

import type { Router } from 'express';
import type { EndpointContext, GraphQLContext } from '../types';

/**
 * Route serving campaign db upload
 *
 *  @name post/campaign
 *  @route /campaign/upload
 *  @memberof campaign
 */

type requestBody = { name: string };

export async function importCampaign(
	name: string,
	file: string | UploadedFile,
	context: EndpointContext | GraphQLContext
): Promise<Campaign | undefined> {
	try {
		const campaign = new Campaign({
			name,
		});
		const em = getMainEmOrFail(context);
		await em.persistAndFlush(campaign);
		const campaignId: string = campaign.id;
		const fileName = path.join(getDbPath(context.config.databaseMode), 'campaign', campaignId, 'db.redeye');

		// move database
		if (typeof file === 'string') {
			await fs.move(file, fileName);
		} else {
			await (file as UploadedFile).mv(fileName);
		}

		const orm = await getMigratedCampaignORM(fileName);
		context.cm.write(campaignId, orm);

		await updateProjectMetadata(campaignId, context);

		return campaign;
	} catch (e) {
		console.error(e);
		return;
	}
}

export function uploadCampaign(app: Router, context: EndpointContext) {
	const { config } = context;
	const isBlue = config.blueTeam;
	// log file upload
	app.post<never, any, requestBody>('/campaign/upload', async (req, res) => {
		if (!isBlue && !isAuthRest(req, config)) return res.sendStatus(401);
		if (!req.files) return res.status(500).send({ msg: 'file is not found' });
		const name = req.body.name;
		const dbFile = !Array.isArray(req.files.file) ? req.files.file : req.files.file[0];
		const campaign = await importCampaign(name, dbFile, context);
		// move database
		if (campaign) return res.send({ campaignId: campaign.id });
		else return res.status(500).send({ msg: 'Campaign import failed' });
	});
}

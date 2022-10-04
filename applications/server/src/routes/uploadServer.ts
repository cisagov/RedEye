import { connectToProjectEmOrFail, getMainEmOrFail } from '../store/utils/project-db';
import { isAuthRest } from '../auth';
import type { Router } from 'express';
import type { EndpointContext } from '../types';
import { Campaign, ParsingStatus, Server } from '@redeye/models';
import { randomUUID } from 'crypto';
import { getRootPath } from '../util';
import path from 'path';

type requestParams = { campaignId: string };
type requestBody = { serverName: string };

/**
 * Route serving upload of a collection of server log files
 *
 *  @name post/server
 *  @route /server/upload/:campaignId
 *  @memberof campaign
 */
export const uploadServer = (app: Router, context: EndpointContext) => {
	const { config } = context;
	// log file upload
	app.post<requestParams, any, requestBody>('/server/upload/:campaignId', async (req, res) => {
		const campaignId = req.params.campaignId;

		if (!isAuthRest(req, config)) return res.sendStatus(401);
		if (!req.files) return res.status(500).send({ msg: 'file is not found' });
		if (!campaignId) return res.status(400).send({ msg: 'campaignId is not found' });

		const globalEm = await getMainEmOrFail(context);

		const campaign = await globalEm.findOneOrFail(Campaign, campaignId);

		if (campaign.parsingStatus === ParsingStatus.NOT_READY_TO_PARSE) {
			campaign.parsingStatus = ParsingStatus.PARSING_NOT_STARTED;
			await globalEm.persistAndFlush(campaign);
		} else if (campaign.parsingStatus !== ParsingStatus.PARSING_NOT_STARTED) {
			res.status(400).send({
				msg: `cannot add additional server to a campaign that is no longer eligible for parsing because it has a status of ${campaign.parsingStatus}`,
			});
		}

		const logFiles = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

		const serverName = req.body.serverName ?? randomUUID();
		const parentDir = path.resolve(getRootPath(), 'campaign', campaignId, serverName);

		// Store Files
		for (const logFile of logFiles) await logFile.mv(`${parentDir}/${logFile.name.replace(/:/gi, '/')}`);

		const em = await connectToProjectEmOrFail(campaignId, context);

		const server = new Server({ name: serverName, parsingPath: parentDir, id: serverName });

		await em.persistAndFlush(server);

		return res.send({ parentDir });
	});
};

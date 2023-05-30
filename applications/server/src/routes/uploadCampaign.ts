import { Campaign, ParsingStatus, Server, MultiParsingPath } from '@redeye/models';
import { getMigratedCampaignORM } from '@redeye/migrations';
import { UploadedFile } from 'express-fileupload';
import * as path from 'path';
import { getDbPath, getRootPath } from '../util';
import { isAuthRest } from '../auth';
import { updateProjectMetadata } from '../machines/updateProjectMetadata.service';
import fs from 'fs-extra';
import { connectToProjectEmOrFail, getMainEmOrFail } from '../store/utils/project-db';

import type { Router } from 'express';
import type { EndpointContext, GraphQLContext } from '../types';

/**
 * Route serving campaign db upload
 *
 *  @name post/campaign
 *  @route /campaign/upload
 *  @memberof campaign
 */

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
type CampaginUploadRequestBody = { name: string };

type RequestParams = { campaignId: string };
type LogsRequestBody = { servers: { name: string; displayName: string }[] };

export function uploadCampaign(app: Router, context: EndpointContext) {
	const { config, parserInfo } = context;
	const isBlue = config.blueTeam;
	// log file upload
	app.post<never, any, CampaginUploadRequestBody>('/campaign/upload', async (req, res) => {
		if (!isBlue && !isAuthRest(req, config)) return res.sendStatus(401);
		if (!req.files) return res.status(500).send({ msg: 'file is not found' });
		const name = req.body.name;
		const dbFile = !Array.isArray(req.files.file) ? req.files.file : req.files.file[0];
		const campaign = await importCampaign(name, dbFile, context);
		// move database
		if (campaign) return res.send({ campaignId: campaign.id });
		else return res.status(500).send({ msg: 'Campaign import failed' });
	});

	app.post<RequestParams, any, LogsRequestBody>('/campaign/:campaignId/upload', async (req, res) => {
		const campaignId = req.params.campaignId;

		if (!isAuthRest(req, config)) return res.sendStatus(401);
		if (!req.files) return res.status(500).send({ msg: 'file is not found' });
		if (!campaignId) return res.status(400).send({ msg: 'campaignId is not found' });

		const globalEm = await getMainEmOrFail(context);

		const campaign = await globalEm.findOneOrFail(Campaign, campaignId);
		if (!campaign.parser) return res.status(400).send({ msg: 'campaign does not have a parser' });

		if (campaign.parsingStatus === ParsingStatus.NOT_READY_TO_PARSE) {
			campaign.parsingStatus = ParsingStatus.PARSING_NOT_STARTED;
			await globalEm.persistAndFlush(campaign);
		} else if (campaign.parsingStatus !== ParsingStatus.PARSING_NOT_STARTED) {
			res.status(400).send({
				msg: `cannot add additional server to a campaign that is no longer eligible for parsing because it has a status of ${campaign.parsingStatus}`,
			});
		}

		const fileServerStructure = parserInfo[campaign.parser]?.uploadForm.serverDelineation;

		const logFiles = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
		const em = await connectToProjectEmOrFail(campaignId, context);
		const parentDir = path.resolve(getRootPath(), 'campaign', campaignId);
		for (const logFile of logFiles) await logFile.mv(path.join(parentDir, logFile.name.replace(/:/gi, '/')));
		const servers: Server[] = [];
		const newServers = JSON.parse(req.body.servers as unknown as string);
		if (!newServers.length) {
			campaign.parsingPaths = parentDir;
		} else {
			const parsingPaths: MultiParsingPath[] = [];
			for (const server of newServers) {
				const serverDir = fileServerStructure === 'database' ? parentDir : path.join(parentDir, server.name);
				parsingPaths.push({
					serverId: server.name,
					path: serverDir,
				});
				servers.push(
					new Server({
						name: server.name,
						displayName: server.displayName,
						parsingPath: serverDir,
						id: server.name,
					})
				);
			}
			campaign.parsingPaths = parsingPaths;
		}
		await globalEm.persistAndFlush(campaign);
		await em.persistAndFlush(servers);

		return res.send({});
	});
}

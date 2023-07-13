import 'reflect-metadata';
import * as path from 'path';
import fs from 'fs-extra';
import type { ServerMachineContext } from './server.machine';
import { getRootPath } from '../util';
import { importCampaign } from '../routes/uploadCampaign';
import type { EndpointContext } from '../types';
import { parserInfo } from './parser.service';

export const importLocalCampaignsDatabasesService = (ctx: ServerMachineContext): Promise<void> => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			const campaignPath = path.join(getRootPath(), 'campaigns');

			fs.ensureDirSync(campaignPath);
			const files = fs.readdirSync(campaignPath);
			if (!files.length) resolve();
			for (const filePath of files) {
				const fileP = filePath.split(path.sep);

				if (filePath.endsWith('redeye')) {
					const endpointContext: EndpointContext = {
						config: ctx.config,
						cm: ctx.cm,
						parserInfo: await parserInfo(ctx.config.parsers),
						messengerMachine: ctx.messagingService,
					};
					importCampaign(
						fileP[fileP.length - 1].replace('.redeye', ''),
						path.join(campaignPath, filePath),
						endpointContext
					).then(() => {
						resolve();
					});
				}
			}
		} catch (e) {
			console.error(e);
			reject();
		}
	});
};

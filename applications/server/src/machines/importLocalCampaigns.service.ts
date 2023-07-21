import 'reflect-metadata';
import * as path from 'path';
import fs from 'fs-extra';
import type { ServerMachineContext } from './server.machine';
import { getRootPath } from '../util';
import { importCampaign } from '../routes/uploadCampaign';
import type { EndpointContext } from '../types';

// When running in electron, move the local databases to where we need them
export const importLocalCampaignsDatabasesService = (ctx: ServerMachineContext): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
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

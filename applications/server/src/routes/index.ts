import { Express, Router } from 'express';
import { appMetadata } from './appMetadata';
import { uploadServer } from './uploadServer';
import { uploadCampaign } from './uploadCampaign';
import { downloadCampaign } from './downloadCampaign';
import { login, loginStatus } from './login';
import { requestImage } from './images';
import { health } from './health';
import type { EndpointContext } from '../types';

export const addRestRoutes = (app: Express, context: EndpointContext) => {
	const router = Router();
	uploadServer(router, context);
	requestImage(router, context);
	uploadCampaign(router, context);
	downloadCampaign(router, context);
	login(router, context);
	loginStatus(router, context);
	appMetadata(router, context);
	health(router, context);
	app.use('/api', router);
};

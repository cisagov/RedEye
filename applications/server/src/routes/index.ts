import type { Express } from 'express';
import { Router } from 'express';
import { appMetadata } from './appMetadata';
import { uploadCampaign } from './uploadCampaign';
import { downloadCampaign } from './downloadCampaign';
import { login, loginStatus } from './login';
import { parserFileValidation } from './parserFileValidation';
import { requestImage } from './images';
import type { EndpointContext } from '../types';

export const addRestRoutes = (app: Express, context: EndpointContext) => {
	const router = Router();
	requestImage(router, context);
	uploadCampaign(router, context);
	downloadCampaign(router, context);
	parserFileValidation(router, context);
	login(router, context);
	loginStatus(router, context);
	appMetadata(router, context);
	app.use('/api', router);
};

import { Campaign, getProjectMikroOrmConfig } from '@redeye/models';
import { MikroORM } from '@mikro-orm/core';
import { getFullCampaignDbPath } from '../../util';
import type { EndpointContext, GraphQLContext, Orm, EntityManager } from '../../types';

type ConnectionOptions = {
	createNewDb?: boolean;
};

export const connectToProjectOrm = async (
	campaignId: string,
	context: GraphQLContext | EndpointContext,
	options: ConnectionOptions = {}
): Promise<Orm> => {
	const { createNewDb = false } = options;
	const config = getProjectMikroOrmConfig(getFullCampaignDbPath(campaignId, context.config.databaseMode));
	const orm = await MikroORM.init({
		...config,
	});

	context.cm.write(campaignId, orm);

	if (createNewDb) {
		const generator = orm.getSchemaGenerator();
		await generator.dropSchema();
		await generator.createSchema();
		await generator.updateSchema();
	}

	return orm;
};

export const connectToProjectEmOrFail = async (
	campaignId: string,
	context: GraphQLContext | EndpointContext
): Promise<EntityManager> => {
	const { cm } = context;

	const projectEm = cm.read(campaignId);
	if (projectEm) return projectEm;

	// if there is no project in the cache, attempt to get it
	const qb = cm.em.createQueryBuilder(Campaign);
	const campaignList = await qb.getResultList();
	const campaignData = campaignList.find((campaign) => campaign.id === campaignId);

	if (campaignData) {
		const orm = await connectToProjectOrm(campaignId, context);
		cm.write(campaignId, orm);
		const projectEm = cm.read(campaignId);
		if (projectEm) return projectEm;
	}

	throw new Error('campaignId is invalid');
};

export const getMainEmOrFail = (context: GraphQLContext | EndpointContext): EntityManager => {
	const em = context?.cm?.em;
	if (em) return em;
	throw new Error('Could not connect to main database, try again. If issue persists, restart server');
};

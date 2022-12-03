import { getCampaignOrm, getMainOrm } from './db-configs';

export const migrateCampaignDb = async (campaignDbPath: string) => {
	const orm = await getCampaignOrm(campaignDbPath);

	const migrator = orm.getMigrator();
	await migrator.up();
	await orm.close(true);
};

export const migrateMainDb = async (dbPath: string) => {
	const orm = await getMainOrm(dbPath);

	const migrator = orm.getMigrator();
	await migrator.up();
	await orm.close(true);
};

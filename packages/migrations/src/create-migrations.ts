import * as path from 'path';
import { getCampaignOrm, getMainOrm } from './db-configs';

export const createCampaignDbMigration = async () => {
	const orm = await getCampaignOrm(path.join(__dirname, '..', 'dbs', 'campaign.redeye'));

	const migrator = orm.getMigrator();
	await migrator.createMigration();
	await orm.close(true);
};

export const createMainDbMigration = async () => {
	const orm = await getMainOrm(path.join(__dirname, '..', 'dbs', 'main.sqlite'));

	const migrator = orm.getMigrator();
	await migrator.createMigration();
	await orm.close(true);
};

createCampaignDbMigration();
createMainDbMigration();

import path from 'path';
import type { ORM } from './db-configs';
import { getCampaignOrm, getMainOrm } from './db-configs';

export const createCampaignDbMigration = async () => {
	const orm = await getCampaignOrm(
		path.join(__dirname, '..', 'dbs', 'campaign.redeye'),
		path.join(__dirname, '..', '..', '..', 'packages', 'migrations', 'src', 'campaign-migrations')
	);

	await createMigration(orm);
};

export const createMainDbMigration = async () => {
	const orm = await getMainOrm(
		false,
		path.join(__dirname, '..', 'dbs', 'main.sqlite'),
		path.join(__dirname, '..', '..', '..', 'packages', 'migrations', 'src', 'main-migrations')
	);

	await createMigration(orm);
};

const createMigration = async (orm: ORM) => {
	const migrator = orm.getMigrator();
	await migrator.createMigration();
	await orm.close(true);
};

createCampaignDbMigration();
createMainDbMigration();

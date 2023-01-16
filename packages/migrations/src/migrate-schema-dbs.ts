import path from 'path';
import { closeAndVacuum } from './db-configs';
import { getMigratedCampaignORM, getMigratedMainORM } from './get-migrated-orm';

const run = async () => {
	const orm1 = await getMigratedCampaignORM(
		path.join(process.cwd(), 'packages', 'migrations', 'dbs', 'campaign.redeye')
	);
	const orm2 = await getMigratedMainORM(false, path.join(process.cwd(), 'packages', 'migrations', 'dbs', 'main.sqlite'));
	await closeAndVacuum(orm1);
	await closeAndVacuum(orm2);
	process.exit(0);
};

run();

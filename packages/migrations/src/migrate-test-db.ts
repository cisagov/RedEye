import path from 'path';
import { closeAndVacuum } from './db-configs';
import { getMigratedCampaignORM } from './get-migrated-orm';

const run = async () => {
	const orm = await getMigratedCampaignORM(
		path.join(__dirname, '..', '..', '..', 'applications', 'redeye-e2e', 'src', 'fixtures', 'gt.redeye')
	);
	await closeAndVacuum(orm);
	process.exit(0);
};

run();

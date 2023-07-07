import { getCampaignOrm, getMainOrm, ORM } from './db-configs';

export const getMigratedCampaignORM = async (campaignDbPath: string) => {
	const orm = await getCampaignOrm(campaignDbPath);
	return await migrate(orm);
};

export const getMigratedMainORM = async (production: boolean, dbPath: string) => {
	const orm = await getMainOrm(production, dbPath);
	return await migrate(orm);
};

const migrate = async (orm: ORM) => {
	const migrator = orm.getMigrator();
	if (await migrator.checkMigrationNeeded()) {
		for (const migration of await migrator.getPendingMigrations()) {
			try {
				await migrator.up(migration.name);
			} catch (e) {
				console.error(`Error migrating ${migration.name} on database ${orm.config.get('dbName')}`);
			}
		}
	}
	return orm;
};

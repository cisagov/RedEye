import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { applicationEntities, getProjectMikroOrmConfig } from '@redeye/models';
import type { Database, Options as BOptions } from 'better-sqlite3';
import path from 'path';
import { Migration20221209003757 } from './campaign-migrations/Migration20221209003757';
import { Migration20230106014154 } from './campaign-migrations/Migration20230106014154';
import { Migration20230530231628 } from './campaign-migrations/Migration20230530231628';

import { Migration20221203042918 } from './main-migrations/Migration20221203042918';
import { Migration20230706221415 } from './main-migrations/Migration20230706221415';
import { Migration20230407200639 } from './campaign-migrations/Migration20230407200639';

export type ORM = MikroORM<BetterSqliteDriver>;
export const getCampaignOrm = (campaignDbPath: string, migrationFolder?: string): Promise<ORM> =>
	MikroORM.init({
		...getProjectMikroOrmConfig(campaignDbPath),
		migrations: {
			migrationsList: [
				{
					name: 'Migration20221209003757.ts',
					class: Migration20221209003757,
				},
				{
					name: 'Migration20230106014154.ts',
					class: Migration20230106014154,
				},
				{
					name: 'Migration20230407200639.ts',
					class: Migration20230407200639,
				},
				{
					name: 'Migration20230530231628.ts',
					class: Migration20230530231628,
				},
			],
			glob: '!(*.d).{js,ts}',
			tableName: 'mikro_orm_migrations',
			path: migrationFolder || path.join(__dirname, 'campaign-migrations'),
			transactional: true,
			disableForeignKeys: true,
			allOrNothing: false,
			emit: 'ts',
		},
	});

export const getMainOrm = (production: boolean, dbName: string, migrationFolder?: string): Promise<ORM> =>
	MikroORM.init({
		type: 'better-sqlite',
		metadataProvider: ReflectMetadataProvider,
		entities: applicationEntities,
		dbName,
		pool: {
			afterCreate(conn, cb) {
				const db = conn as Database;
				db.pragma('journal_mode = WAL');
				db.pragma('synchronous = NORMAL');
				// eslint-disable-next-line @typescript-eslint/ban-types
				(cb as Function)();
			},
		},
		driverOptions: { useNullAsDefault: true, transaction: true } as BOptions,
		debug: !production,
		allowGlobalContext: true,
		migrations: {
			migrationsList: [
				{
					name: 'Migration20221203042918.ts',
					class: Migration20221203042918,
				},
				{
					name: 'Migration20230706221415.ts',
					class: Migration20230706221415,
				},
			],
			glob: '!(*.d).{js,ts}',
			tableName: 'mikro_orm_migrations',
			path: migrationFolder || path.join(__dirname, 'main-migrations'),
			transactional: true,
			disableForeignKeys: true,
			allOrNothing: false,
			emit: 'ts',
		},
	});

export const closeAndVacuum = async (orm: ORM) => {
	const em = orm.em.fork();
	await em.flush();
	await em.getDriver().execute('PRAGMA wal_checkpoint');
	await orm.close(true);
};

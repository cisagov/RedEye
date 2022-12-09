import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { applicationEntities, getProjectMikroOrmConfig } from '@redeye/models';
import { Database, Options as BOptions } from 'better-sqlite3';
import path from 'path';

export type ORM = MikroORM<BetterSqliteDriver>;
export const getCampaignOrm = (campaignDbPath: string, migrationFolder?: string): Promise<ORM> =>
	MikroORM.init({
		...getProjectMikroOrmConfig(campaignDbPath),
		migrations: {
			glob: '!(*.d).{js,ts}',
			tableName: 'mikro_orm_migrations',
			path: migrationFolder || path.join(__dirname, 'campaign-migrations'),
			transactional: true,
			disableForeignKeys: true,
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
			glob: '!(*.d).{js,ts}',
			tableName: 'mikro_orm_migrations',
			path: migrationFolder || path.join(__dirname, 'main-migrations'),
			transactional: true,
			disableForeignKeys: true,
			emit: 'ts',
		},
	});

export const closeAndVacuum = async (orm: ORM) => {
	const em = orm.em.fork();
	await em.flush();
	await em.getDriver().execute('PRAGMA wal_checkpoint');
	await orm.close(true);
};

import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { applicationEntities, getProjectMikroOrmConfig } from '@redeye/models';
import { Options as BOptions } from 'better-sqlite3';
import * as path from 'path';

export const getCampaignOrm = (campaignDbPath: string) =>
	MikroORM.init({
		...getProjectMikroOrmConfig(campaignDbPath),
		pool: {},
		migrations: {
			tableName: 'mikro_orm_migrations',
			path: path.join(__dirname, 'campaign-migrations'),
			transactional: true,
			disableForeignKeys: true,
			emit: 'ts',
		},
	});

export const getMainOrm = (dbPath: string) =>
	MikroORM.init({
		type: 'better-sqlite',
		metadataProvider: ReflectMetadataProvider,
		entities: applicationEntities,
		dbName: dbPath,
		driverOptions: { useNullAsDefault: true, transaction: true } as BOptions,
		allowGlobalContext: true,
		migrations: {
			tableName: 'mikro_orm_migrations',
			path: path.join(__dirname, 'main-migrations'),
			transactional: true,
			disableForeignKeys: true,
			emit: 'ts',
		},
	});

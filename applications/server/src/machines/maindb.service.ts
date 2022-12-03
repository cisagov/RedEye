import 'reflect-metadata';
import fs from 'fs-extra';
import { MikroORM, Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { applicationEntities } from '@redeye/models';
import { migrateMainDb } from '@redeye/migrations';
import { getDbPath } from '../util';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { Database, Options as BOptions } from 'better-sqlite3';
import * as path from 'path';
import { type ConfigDefinition, DatabaseMode } from '../config';

function getMainMikroOrmConfig(config: ConfigDefinition, dbName: string): Options<BetterSqliteDriver> {
	return {
		type: 'better-sqlite',
		metadataProvider: ReflectMetadataProvider,
		entities: applicationEntities,
		dbName,
		pool: {
			afterCreate(conn, cb) {
				const db = conn as Database;
				db.pragma('journal_mode = WAL');
				db.pragma('synchronous = NORMAL');
				(cb as Function)();
			},
		},
		driverOptions: { useNullAsDefault: true, transaction: true } as BOptions,
		debug: !config.production,
		allowGlobalContext: true,
	};
}

export const connectOrCreateDatabase = async (config: ConfigDefinition) => {
	const databaseMode = config.databaseMode;
	const mainDbPath = path.join(getDbPath(databaseMode), 'main.sqlite');
	// Check if a database exists
	const databaseInitialized = fs.existsSync(mainDbPath);
	// If it exists
	const orm = await MikroORM.init(getMainMikroOrmConfig(config, mainDbPath));
	orm.em.execute('PRAGMA synchronous = NORMAL');
	orm.em.execute('PRAGMA journal_mode = WAL');
	if (databaseMode === DatabaseMode.DEV_CLEAN || !databaseInitialized) {
		const generator = orm.getSchemaGenerator();
		await generator.dropSchema();
		await generator.createSchema();
	} else {
		try {
			await migrateMainDb(mainDbPath);
		} catch (e) {
			console.error('Error migrating main database ', e);
		}
	}
	return orm;
};

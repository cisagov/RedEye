import 'reflect-metadata';
import * as path from 'path';
import * as process from 'process';
import { Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

import type { Database } from 'better-sqlite3';

import { campaignEntities } from './projectModels';

export * from './projectModels';
export * from './globalModels';

export function getProjectMikroOrmConfig(dbName: string): Options<BetterSqliteDriver> {
	return {
		type: 'better-sqlite',
		metadataProvider: ReflectMetadataProvider,
		entities: campaignEntities,
		dbName,
		pool: {
			afterCreate(conn, cb) {
				const db = conn as Database;
				db.pragma('journal_mode = WAL');
				db.pragma('synchronous = NORMAL');
				(cb as Function)();
			},
		},
		debug: !!process.env['DATABASE_DEBUG'],
		migrations: {
			tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
			path: path.join(__dirname, 'migrations'), // path to the folder with migrations
			transactional: true, // wrap each migration in a transaction
			disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
			emit: 'js', // migration generation mode
		},
	};
}

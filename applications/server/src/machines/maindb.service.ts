import 'reflect-metadata';
import fs from 'fs-extra';
import { getMigratedMainORM } from '@redeye/migrations';
import { getDbPath } from '../util';
import * as path from 'path';
import type { ConfigDefinition } from '../config';
import { DatabaseMode } from '../config';

export const connectOrCreateDatabase = async (config: ConfigDefinition) => {
	const databaseMode = config.databaseMode;
	const mainDbPath = path.join(getDbPath(databaseMode), 'main.sqlite');
	// Check if a database exists
	const databaseInitialized = fs.existsSync(mainDbPath);
	// If it exists
	const orm = await getMigratedMainORM(config.production, mainDbPath);
	if (databaseMode === DatabaseMode.DEV_CLEAN || !databaseInitialized) {
		const generator = orm.getSchemaGenerator();
		await generator.dropSchema();
		await generator.createSchema();
	}
	return orm;
};

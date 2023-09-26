import { MikroORM } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/better-sqlite';
import { resolve } from 'node:path';

(async () => {
	const orm = await MikroORM.init(
		defineConfig({
			discovery: {
				// we need to disable validation for no entities
				warnWhenNoEntities: false,
			},
			dbName: resolve(
				__dirname,
				'..',
				'..',
				'..',
				'applications',
				'redeye-e2e',
				'src',
				'fixtures',
				'sliver',
				'sliver.db'
			),
			// ...
		})
	);
	const generator = orm.getEntityGenerator();
	await generator.generate({
		// @ts-ignore
		entitySchema: true,
		bidirectionalRelations: true,
		identifiedReferences: true,
		esmImport: true,
		save: true,
		baseDir: resolve(__dirname, 'sliver-entities'),
	});
	await orm.close(true);
})();

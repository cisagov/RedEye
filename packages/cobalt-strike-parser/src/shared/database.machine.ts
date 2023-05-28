import { actions, createMachine, DoneInvokeEvent } from 'xstate';
import { getProjectMikroOrmConfig, Server } from '@redeye/models';
import { MikroORM } from '@mikro-orm/core';
import { resolve as pathResolve } from 'path';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

export type DatabaseMachineContext = { folderPaths?: string[] | undefined; databasePath?: string | undefined };
export type DatabaseConnectionResolution = {
	orm: MikroORM<BetterSqliteDriver>;
	databasePath: string;
};

export const databaseMachine = createMachine(
	{
		tsTypes: {} as import('./database.machine.typegen').Typegen0,
		schema: {
			context: {} as DatabaseMachineContext,
			services: {} as {
				databaseCreate: {
					data: DatabaseConnectionResolution;
				};
				databaseConnect: {
					data: DatabaseConnectionResolution;
				};
			},
		},
		initial: 'determine',
		states: {
			determine: {
				entry: 'sendStart',
				on: {
					START: [
						{
							cond: 'databasePathDefined',
							target: 'connectingDatabase',
						},
						{
							target: 'creatingDatabase',
						},
					],
				},
			},
			creatingDatabase: {
				invoke: {
					src: 'databaseCreate',
					onDone: 'connected',
				},
			},
			connectingDatabase: {
				invoke: {
					src: 'databaseConnect',
					onDone: 'connected',
				},
			},
			connected: {
				type: 'final',
				data: {
					orm: (_ctx: DatabaseMachineContext, event: DoneInvokeEvent<DatabaseConnectionResolution>) => event.data.orm,
					databasePath: (_ctx: DatabaseMachineContext, event: DoneInvokeEvent<DatabaseConnectionResolution>) =>
						event.data.databasePath,
				},
			},
		},
	},
	{
		actions: {
			sendStart: actions.send('START'),
		},
		guards: {
			databasePathDefined: (ctx) => !!ctx.databasePath,
		},
		services: {
			databaseConnect: (ctx) => {
				return new Promise<DatabaseConnectionResolution>((resolve, reject) => {
					const path = ctx.databasePath;
					try {
						if (path) {
							MikroORM.init(getProjectMikroOrmConfig(path)).then((orm) => {
								resolve({ orm, databasePath: path });
							});
						} else {
							reject('databasePath undefined');
						}
					} catch (e) {
						reject(e);
					}
				});
			},
			databaseCreate: (ctx) => {
				return new Promise<DatabaseConnectionResolution>((resolve, reject) => {
					const folderPaths = ctx.folderPaths;
					try {
						if (folderPaths) {
							const databasePath = pathResolve('./test.sqlite');
							MikroORM.init(getProjectMikroOrmConfig(databasePath)).then(async (orm) => {
								const generator = orm.getSchemaGenerator();
								await generator.dropSchema();
								await generator.createSchema();
								await generator.updateSchema();

								orm.em.fork().transactional(async (em) => {
									const promises = folderPaths.map((path) => {
										const newServer = new Server({ name: path, parsingPath: path });
										return em.nativeInsert(newServer);
									});

									await Promise.allSettled(promises);
									resolve({ orm, databasePath });
								});
							});
						} else {
							reject('FolderPaths undefined');
						}
					} catch (e) {
						reject(e);
					}
				});
			},
		},
	}
);

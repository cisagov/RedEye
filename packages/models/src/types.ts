import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

export type MainDatabase = MikroORM<BetterSqliteDriver>;
export type EntityManager = MainDatabase['em'];

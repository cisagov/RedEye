import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { Request, Response } from 'express';
import type { SpawnedMessengerMachine } from './machines/messenger.machine';
import type { ConfigDefinition } from './config';
import type { EntityCacheManager } from './cache';

export type Orm = MikroORM<BetterSqliteDriver>;
export type EntityManager = Orm['em'];

export interface EndpointContext {
	messengerMachine: SpawnedMessengerMachine;
	config: ConfigDefinition;
	cm: EntityCacheManager;
}

export interface GraphQLContext extends EndpointContext {
	req: Request;
	res: Response;
}

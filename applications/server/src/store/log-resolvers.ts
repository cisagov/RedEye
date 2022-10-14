import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Beacon, LogEntry } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(LogEntry)
export class LogResolvers {
	@Authorized()
	@Query(() => [LogEntry], { nullable: 'itemsAndList', description: 'Get log entries by ids' })
	async logs(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<LogEntry>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string
	): Promise<LogEntry[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let logs: LogEntry[];
		if (beaconId) {
			logs = await em.find(LogEntry, { beacon: beaconId }, { populate: relationPaths });
		} else if (hostId) {
			const beacons = await em.find(Beacon, { host: hostId });
			const ids = beacons.map((beacon: Beacon) => beacon.id);
			logs = await em.find(LogEntry, { beacon: ids }, { populate: relationPaths });
		} else {
			logs = await em.find(LogEntry, {}, { populate: relationPaths });
		}
		return logs;
	}

	@Authorized()
	@Query(() => [LogEntry], {
		description: 'Get logs from beacon sorted by time. The goal is to be able to re-create the full log for that beacon.',
	})
	async logsByBeaconId(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<LogEntry>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('beaconId', () => String) beaconId: string
	): Promise<LogEntry[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const logs: LogEntry[] = await em.find(
			LogEntry,
			{ beacon: beaconId },
			{
				populate: relationPaths,
				orderBy: {
					dateTime: 'asc',
					lineNumber: 'asc',
				},
			}
		);

		return logs;
	}
}

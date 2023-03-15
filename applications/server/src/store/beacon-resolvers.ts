import { Arg, Authorized, Ctx, Query, Resolver, Mutation } from 'type-graphql';
import { Beacon, BeaconType } from '@redeye/models';
import { ensureTreeHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath, type Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Beacon)
export class BeaconResolvers {
	@Authorized()
	@Query(() => [Beacon], { nullable: 'itemsAndList', description: 'Get all the beacons for a project' })
	async beacons(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false,
		@RelationPath() relationPaths: Relation<Beacon>
	): Promise<Beacon[] | null> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		return await em.find(Beacon, !hidden ? { hidden, host: { hidden } } : {}, { populate: relationPaths });
	}

	@Authorized()
	@Mutation(() => Beacon, { description: 'Update existing Beacon Metadata' })
	async updateBeaconMetadata(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Beacon>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('beaconId', () => String) beaconId: string,
		@Arg('beaconDisplayName', { nullable: true }) beaconDisplayName?: string,
		@Arg('beaconTimeOfDeath', { nullable: true }) beaconTimeOfDeath?: Date,
		@Arg('beaconType', { nullable: true }) beaconType?: BeaconType
	): Promise<Beacon> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const beacon = await em.findOneOrFail(Beacon, beaconId, { populate: relationPaths });
		if (beaconDisplayName) {
			beacon.displayName = beaconDisplayName;
		}
		if (beaconTimeOfDeath) {
			beacon.meta[0].endTime = beaconTimeOfDeath;
		}
		if (beaconType) {
			beacon.meta[0].type = beaconType;
		}
		await em.persistAndFlush(beacon);
		ctx.cm.forkProject(campaignId);
		return beacon;
	}

	@Authorized()
	@Mutation(() => Beacon, { description: 'Toggle beacon hidden state' })
	async toggleBeaconHidden(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Beacon>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('beaconIds', () => [String], { nullable: true }) beaconIds?: Array<string>,
		@Arg('setHidden', () => Boolean, { nullable: true }) setHidden?: boolean
	): Promise<Beacon[] | undefined> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);

		if (beaconId) {
			const beacon = await em.findOneOrFail(Beacon, beaconId, { populate: relationPaths });
			beacon.hidden = !beacon.hidden;
			await em.persistAndFlush(beacon);
			await ensureTreeHidden(em, beacon.id, beacon.hidden, []);
			ctx.cm.forkProject(campaignId);
			return [beacon];
		} else if (beaconIds) {
			const beacons = await em.find(Beacon, beaconIds, { populate: relationPaths });
			for (const beacon of beacons) {
				if (beacon.hidden !== setHidden && setHidden !== undefined) {
					beacon.hidden = setHidden;
					await em.persistAndFlush(beacon);
					await ensureTreeHidden(em, beacon.id, beacon.hidden, []);
				}
			}
			ctx.cm.forkProject(campaignId);
			return beacons;
		}
		return undefined;
	}
}

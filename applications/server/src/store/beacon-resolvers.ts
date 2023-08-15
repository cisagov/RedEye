import { Arg, Authorized, Ctx, Query, Resolver, Mutation } from 'type-graphql';
import { Beacon, BeaconType, Shapes, NodeColors } from '@redeye/models';
import { ensureTreeHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { Relation } from './utils/relation-path';
import { RelationPath } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Beacon)
export class BeaconResolvers {
	@Authorized()
	@Query(() => [Beacon], { nullable: 'itemsAndList', description: 'Get all the beacons for a project' })
	async beacons(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false,
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
		@Arg('beaconDisplayName', () => String, { nullable: true }) beaconDisplayName?: string,
		@Arg('beaconTimeOfDeath', () => Date, { nullable: true }) beaconTimeOfDeath?: Date,
		@Arg('beaconType', () => BeaconType, { nullable: true }) beaconType?: BeaconType,
		@Arg('shape', () => Shapes, { nullable: true }) shape?: Shapes,
		@Arg('color', () => NodeColors, { nullable: true }) color?: NodeColors
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
		if (shape) {
			beacon.meta[0].shape = shape;
		}
		if (color) {
			beacon.meta[0].color = color;
		}

		await em.persistAndFlush(beacon);
		ctx.cm.forkProject(campaignId);
		return beacon;
	}

	@Authorized()
	@Mutation(() => [Beacon], { description: 'Toggle beacon hidden state' })
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
			await ensureTreeHidden(em, beacon.id, !!beacon.hidden, []);
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

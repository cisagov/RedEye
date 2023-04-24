import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Beacon, Host } from '@redeye/models';
import { defaultHidden, ensureTreeHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath, type Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Host)
export class HostResolvers {
	@Authorized()
	@Query(() => [Host], { nullable: 'itemsAndList', description: 'Get all the hosts for a project' })
	async hosts(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false,
		@RelationPath() relationPaths: Relation<Host>
	): Promise<Host[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const hosts = await em.find(Host, !hidden ? { hidden, beacons: { hidden } } : {}, { populate: relationPaths });
		// TODO: Figure out if this is still required
		for (const host of hosts) await host.beacons.init({ where: defaultHidden(hidden) });
		return hosts;
	}

	@Authorized()
	@Mutation(() => Host, { description: 'Update existing Host Display Name' })
	async updateHostMetadata(
		@Ctx() ctx: GraphQLContext,
		@Arg('hostId', () => String) hostId: string,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostDisplayName', () => String) hostDisplayName: string,
		@RelationPath() relationPaths: Relation<Host>
	): Promise<Host> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const host = await em.findOneOrFail(Host, hostId, { populate: relationPaths });
		host.displayName = hostDisplayName;
		// host = em.assign(host, { displayName: hostDisplayName });
		await em.persistAndFlush(host);
		return host;
	}

	@Authorized()
	@Mutation(() => Host, { description: 'Toggle host hidden state' })
	async toggleHostHidden(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String) hostId: string
	): Promise<Host> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const host = await em.findOneOrFail(Host, hostId);
		host.hidden = !host.hidden;
		await host.beacons.loadItems();
		for (const beacon of host.beacons) {
			await em.nativeUpdate(Beacon, { id: beacon.id }, { hidden: host.hidden });
			await ensureTreeHidden(em, beacon.id, host.hidden, host.beacons.getIdentifiers());
		}
		await em.persistAndFlush(host);
		ctx.cm.forkProject(campaignId);
		return host;
	}
}

import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Beacon, Command, Link } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Link)
export class LinksResolvers {
	@Authorized()
	@Query(() => [Link], { nullable: 'itemsAndList', description: 'Get all links' })
	async links(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false,
		@RelationPath() relationPaths: Relation<Link>
	): Promise<Link[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		return await em.find(
			Link,
			!hidden
				? {
						$and: [{ origin: { hidden } }, { destination: { hidden } }],
				  }
				: {},
			{ populate: relationPaths }
		);
	}

	@Authorized()
	@Mutation(() => Link, { description: 'Create a new link between two beacons' })
	async createLink(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('name', () => String) name: string,
		@Arg('originId', () => String, { description: 'origin beacon id' }) originId: string,
		@Arg('destinationId', () => String, { description: 'destination beacon id' }) destinationId: string,
		@Arg('commandId', () => String, { description: 'command id to add to link' }) commandId: string
	): Promise<any> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const link = new Link({
			name,
			manual: true,
			origin: await em.findOneOrFail(Beacon, { id: originId }),
			destination: await em.findOneOrFail(Beacon, { id: destinationId }),
			command: await em.findOneOrFail(Command, { id: commandId }),
		});
		await em.persistAndFlush(link);
		ctx.cm.forkProject(campaignId);
		return link;
	}

	@Authorized()
	@Mutation(() => Link, { description: 'Edit a link' })
	async editLink(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Link>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('id', () => String) id: string,
		@Arg('name', () => String) name?: string,
		@Arg('originId', () => String, { description: 'origin beacon id' }) originId?: string,
		@Arg('destinationId', () => String, { description: 'destination beacon id' }) destinationId?: string,
		@Arg('commandId', () => String, { description: 'command id to add to link' }) commandId?: string
	) {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const link = await em.findOneOrFail(Link, id, { populate: relationPaths });

		em.assign(
			link,
			Object.fromEntries(
				Object.entries({
					name,
					origin: originId && (await em.findOneOrFail(Beacon, { id: originId })),
					destination: destinationId && (await em.findOneOrFail(Beacon, { id: destinationId })),
					command: commandId && (await em.findOneOrFail(Command, { id: commandId })),
				}).filter(([, value]) => value !== undefined)
			)
		);
		await em.persistAndFlush(link);
		ctx.cm.forkProject(campaignId);
		return link;
	}

	@Authorized()
	@Mutation(() => Link, { description: 'Delete a link' })
	async deleteLink(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('id', () => String) id: string
	) {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const link = await em.findOneOrFail(Link, { id });
		await em.removeAndFlush(link);
		ctx.cm.forkProject(campaignId);
		return link;
	}
}

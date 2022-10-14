import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Link } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Link)
export class LinksResolvers {
	@Authorized()
	@Query(() => [Link], { nullable: 'itemsAndList', description: 'Get log entries by ids' })
	async links(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false,
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
}

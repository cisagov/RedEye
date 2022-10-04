import { beaconHidden, defaultHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail, getMainEmOrFail } from './utils/project-db';
import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { Operator, GlobalOperator } from '@redeye/models';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(Operator)
export class OperatorResolvers {
	@Query(() => [Operator], { nullable: 'itemsAndList', description: 'Get all the operators for a project' })
	async operators(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false,
		@RelationPath() relationPaths: Relation<Operator>
	): Promise<Operator[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const operators = await em.find(Operator, !hidden ? { beacons: { hidden } } : {}, { populate: relationPaths });
		for (const operator of operators) {
			await operator.beacons.init({ populate: false, where: defaultHidden(hidden) });
			await operator.commands.init({ populate: false, where: beaconHidden(hidden) });
		}
		return operators;
	}

	@Query(() => [GlobalOperator], { nullable: 'itemsAndList', description: 'Get all the operators for all campaigns' })
	async globalOperators(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<GlobalOperator>
	): Promise<GlobalOperator[]> {
		const em = getMainEmOrFail(ctx);
		return await em.find(GlobalOperator, {}, { populate: relationPaths });
	}

	@Mutation(() => GlobalOperator, { nullable: true, description: 'Create a global user' })
	async createGlobalOperator(
		@Ctx() ctx: GraphQLContext,
		@Arg('username', () => String) username: string
	): Promise<GlobalOperator | null> {
		return await OperatorResolvers.createGlobalOperatorHandler(ctx, username);
	}

	static async createGlobalOperatorHandler(ctx: GraphQLContext, username: string) {
		const em = getMainEmOrFail(ctx);
		if (!(await em.findOne(GlobalOperator, username))) {
			const globalOperator = em.create(GlobalOperator, { id: username, name: username });
			await em.persistAndFlush(globalOperator);
			ctx.cm.forkMain();
			return globalOperator;
		}
		throw new Error('Operator already exists');
	}
}

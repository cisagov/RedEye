import { FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { Arg, Authorized, Resolver, Mutation, Query, Ctx, registerEnumType, Field, InputType } from 'type-graphql';
import { Beacon, Command, CommandGroup, Operator } from '@redeye/models';
import { beaconHidden, defaultHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath, type Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';
import { SortDirection } from './command-resolvers';

enum SortOptionComments {
	time = 'time',
	user = 'user',
	fav = 'fav',
}

registerEnumType(SortOptionComments, {
	name: 'SortOptionComments',
	description: 'The desired property to sort Comments on',
});

@InputType('SortTypeComments')
class SortTypeComments {
	@Field(() => SortOptionComments, { nullable: true, defaultValue: SortOptionComments.time })
	sortBy?: SortOptionComments;

	@Field(() => SortDirection, {
		nullable: true,
		defaultValue: SortDirection.ASC,
	})
	direction?: SortDirection = SortDirection.ASC;
}

@Resolver(CommandGroup)
export class CommandGroupResolvers {
	@Authorized()
	@Query(() => [CommandGroup], {
		nullable: 'itemsAndList',
		description: 'Get command groups by ids',
	})
	async commandGroups(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<CommandGroup>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('operatorId', () => String, { nullable: true }) operatorId?: string,
		@Arg('commandType', () => String, { nullable: true }) commandType?: string,
		@Arg('commandIds', () => [String], { nullable: true })
		commandIds?: Array<string>,
		@Arg('commandGroupIds', () => [String], { nullable: true }) commandGroupIds?: Array<string>,
		@Arg('hidden', () => Boolean, { defaultValue: false })
		hidden: boolean = false,
		@Arg('sort', () => SortTypeComments, {
			nullable: true,
			defaultValue: { sortBy: SortOptionComments.time },
		})
		sort: SortTypeComments = { sortBy: SortOptionComments.time }
	): Promise<CommandGroup[]> {
		const filter = getOrderByFromSort(sort);
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let commandGroups: CommandGroup[] = [];
		if (commandGroupIds?.length) {
			const query: FilterQuery<CommandGroup> = {
				id: commandGroupIds,
				...beaconHidden(hidden),
			};
			commandGroups = await em.find(CommandGroup, query, {
				populate: relationPaths,
				orderBy: filter,
			});
		} else if (commandIds) {
			const query: FilterQuery<CommandGroup> = {
				commands: { id: commandIds.map((id) => id), ...beaconHidden(hidden) },
			};
			commandGroups = await em.find(CommandGroup, query, {
				populate: relationPaths,
				orderBy: filter,
			});
		} else if (commandType) {
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { inputText: commandType, ...beaconHidden(hidden) } },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else if (operatorId) {
			const operator: Operator | null = await em.findOne(Operator, {
				id: operatorId,
			});
			if (operator) {
				commandGroups = await em.find(
					CommandGroup,
					{
						commands: {
							beacon: {
								id: operator.beacons.getIdentifiers() as string[],
								...defaultHidden(hidden),
							},
						},
					},
					{
						populate: relationPaths,
						orderBy: filter,
					}
				);
			}
		} else if (beaconId) {
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { beacon: { id: beaconId, ...defaultHidden(hidden) } } },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else if (hostId) {
			const beacons = await em.find(Beacon, {
				host: hostId,
				...defaultHidden(hidden),
			});
			const ids = beacons.map((beacon: Beacon) => beacon.id);
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { beacon: { id: ids, ...defaultHidden(hidden) } } },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else {
			commandGroups = await em.find(CommandGroup, !hidden ? { commands: { ...beaconHidden(hidden) } } : {}, {
				populate: relationPaths,
				orderBy: filter,
			});
		}
		// TODO: Optimize init of commands with CommandGroups
		for (const commandGroup of commandGroups) {
			await commandGroup.commands.init({ where: beaconHidden(hidden) });
		}
		return commandGroups;
	}

	@Authorized()
	@Query(() => [String], {
		nullable: 'itemsAndList',
		description: 'Get command groups ids',
	})
	async commandGroupIds(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<CommandGroup>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('operatorId', () => String, { nullable: true }) operatorId?: string,
		@Arg('commandType', () => String, { nullable: true }) commandType?: string,
		@Arg('commandIds', () => [String], { nullable: true })
		commandIds?: Array<string>,
		@Arg('commandGroupIds', () => [String], { nullable: true }) commandGroupIds?: Array<string>,
		@Arg('hidden', () => Boolean, { defaultValue: false })
		hidden: boolean = false,
		@Arg('sort', () => SortTypeComments, {
			nullable: true,
			defaultValue: { sortBy: SortOptionComments.time },
		})
		sort: SortTypeComments = { sortBy: SortOptionComments.time }
	): Promise<UUID[] | undefined> {
		const commandGroups = await this.commandGroups(
			ctx,
			relationPaths,
			campaignId,
			hostId,
			beaconId,
			operatorId,
			commandType,
			commandIds,
			commandGroupIds,
			hidden,
			sort
		);
		return commandGroups?.map((commandGroup) => commandGroup.id);
	}

	@Authorized()
	@Query(() => CommandGroup, {
		nullable: true,
		description: 'Get command group by id',
	})
	async commandGroup(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<CommandGroup>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('commandGroupId', () => String) commandGroupId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false })
		hidden: boolean = false
	): Promise<CommandGroup> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const commandGroup = await em.findOneOrFail(
			CommandGroup,
			{
				id: commandGroupId,
				...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}),
			},
			{
				populate: relationPaths,
			}
		);
		await commandGroup.commands.init({ where: beaconHidden(hidden) });
		return commandGroup;
	}

	@Authorized()
	@Mutation(() => CommandGroup, {
		description: 'Add an Command to an existing CommandGroup',
	})
	async addCommandToCommandGroup(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('commandGroupId', () => String) commandGroupId: string,
		@Arg('commandId', () => String) commandId: string
	): Promise<CommandGroup> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const commandGroup = await em.findOneOrFail(CommandGroup, commandGroupId, {
			populate: ['commands'],
		});
		const command = await em.findOneOrFail(Command, commandId);
		commandGroup.commands.add(command);
		await em.persistAndFlush(commandGroup);
		ctx.cm.forkProject(commandId);
		return commandGroup;
	}
}

const sortMapping: Record<keyof typeof SortOptionComments, (sort: SortTypeComments) => QueryOrderMap<CommandGroup>> = {
	time: (sort: SortTypeComments) => ({
		annotations: { date: sort.direction === SortDirection.ASC ? 'asc' : 'desc' },
	}),
	user: (sort: SortTypeComments) => ({
		annotations: { user: sort.direction === SortDirection.ASC ? 'asc' : 'desc' },
	}),
	fav: (sort: SortTypeComments) => ({
		annotations: { favorite: sort.direction === SortDirection.ASC ? 'asc' : 'desc' },
	}),
};

function getOrderByFromSort(sort: SortTypeComments | undefined): QueryOrderMap<Command> {
	const orderBy = sort?.sortBy && sortMapping[sort?.sortBy]?.(sort);

	if (!orderBy) {
		throw new Error(`Invalid sortBy value "${sort?.sortBy}"`);
	}
	return orderBy ?? { id: 'asc' };
}

import { Command } from '@redeye/models';
import type { FilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Field, InputType, ObjectType, Query, registerEnumType, Resolver } from 'type-graphql';
import { defaultHidden, beaconHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { Relation } from './utils/relation-path';
import { RelationPath } from './utils/relation-path';
import type { GraphQLContext } from '../types';

enum SortOption {
	time = 'time',
	name = 'name',
	text = 'text',
}

export enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC',
}

registerEnumType(SortOption, { name: 'SortOption', description: 'The desired property to sort on' });
registerEnumType(SortDirection, { name: 'SortDirection', description: 'The desired sort direction' });

@InputType('SortType')
class SortType {
	@Field(() => SortOption, { nullable: true, defaultValue: SortOption.name })
	sortBy?: SortOption;

	@Field(() => SortDirection, { nullable: true, defaultValue: SortDirection.ASC }) direction?: SortDirection =
		SortDirection.ASC;
}

@Resolver(Command)
export class CommandResolvers {
	@Authorized()
	@Query(() => [Command], { nullable: 'itemsAndList', description: 'Get commands by ids' })
	async commands(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Command>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('operatorId', () => String, { nullable: true }) operatorId?: string,
		@Arg('commandType', () => String, { nullable: true }) commandType?: string,
		@Arg('commandIds', () => [String], { nullable: true }) commandIds?: Array<string>,
		@Arg('sort', () => SortType, { nullable: true, defaultValue: { sortBy: SortOption.name } })
		sort: SortType = { sortBy: SortOption.name },
		@Arg('hidden', () => Boolean, { nullable: true, defaultValue: false }) hidden: boolean = false,
		ids?: boolean
	): Promise<Command[] | null> {
		const filter = getOrderByFromSort(sort);

		if (ids) {
			// @ts-expect-error: Don't populate if you only want the ids
			relationPaths = false;
		}
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let commands: Command[] = [];
		if (commandIds?.length) {
			commands = await em.find(
				Command,
				{ id: commandIds, ...beaconHidden(hidden) },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else if (commandType) {
			commands = await em.find(
				Command,
				{ inputText: commandType, ...beaconHidden(hidden) },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else if (operatorId) {
			commands = await em.find(
				Command,
				{ operator: operatorId, ...beaconHidden(hidden) },
				{ populate: relationPaths, orderBy: filter }
			);
		} else if (beaconId) {
			commands = await em.find(
				Command,
				{ beacon: { id: beaconId, ...defaultHidden(hidden) } },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else if (hostId) {
			commands = await em.find(
				Command,
				{ beacon: { host: hostId, ...defaultHidden(hidden) } },
				{
					populate: relationPaths,
					orderBy: filter,
				}
			);
		} else {
			commands = await em.find(Command, beaconHidden(hidden), {
				populate: relationPaths,
				orderBy: filter,
			});
		}

		return commands;
	}

	@Authorized()
	@Query(() => [String], { nullable: 'itemsAndList', description: 'Get commands by ids' })
	async commandIds(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Command>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('operatorId', () => String, { nullable: true }) operatorId?: string,
		@Arg('commandType', () => String, { nullable: true }) commandType?: string,
		@Arg('commandIds', () => [String], { nullable: true }) commandIds?: Array<string>,
		@Arg('sort', () => SortType, { nullable: true, defaultValue: { sortBy: SortOption.name } }) sort?: SortType,
		@Arg('hidden', () => Boolean, { nullable: true, defaultValue: false, description: 'Should show hidden values' })
		hidden: boolean = false
	): Promise<UUID[] | undefined> {
		const commands = await this.commands(
			ctx,
			relationPaths,
			campaignId,
			hostId,
			beaconId,
			operatorId,
			commandType,
			commandIds,
			sort,
			hidden,
			true
		);
		return commands?.map((command) => command?.id);
	}

	@Authorized()
	@Query(() => [Command], { nullable: true, description: 'Search Commands from textQuery' })
	async searchCommands(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Command>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('searchQuery', () => String) searchQuery: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false
	): Promise<Command[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const likeQuery = `%${searchQuery}%`;
		const commandQuery: FilterQuery<Command> = {
			...beaconHidden(hidden),
			$or: [
				{ input: { blob: { $like: likeQuery } } },
				{ attackIds: { $like: likeQuery } },
				{ input: { filepath: { $like: likeQuery } } },
				{ output: { blob: { $like: likeQuery } } },
				{ output: { filepath: { $like: likeQuery } } },
			],
		};

		return await em.find(Command, commandQuery, {
			populate: relationPaths,
		});
	}
}

@ObjectType('CommandTypeCount')
class CommandTypeCount {
	@Field(() => String)
	id!: string;

	@Field(() => String)
	text?: string;

	@Field(() => Number)
	count: number = 0;
}

@Resolver(CommandTypeCount)
export class CommandTypeCountResolvers {
	@Authorized()
	@Query(() => [CommandTypeCount], { nullable: 'itemsAndList', description: 'Get command types' })
	async commandTypes(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,

		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true, description: 'Should show hidden values' })
		hidden: boolean = false
	): Promise<CommandTypeCount[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const commands = await em.find(Command, beaconHidden(hidden), { populate: false });

		const countObj = commands.reduce<Record<string, number>>((acc, current) => {
			if (acc[current.inputText]) acc[current.inputText]++;
			else acc[current.inputText] = 1;
			return acc;
		}, {});
		return Object.entries(countObj).map(([text, count]) => ({ id: text, text, count })) as CommandTypeCount[];
	}
}

const sortMapping: Record<keyof typeof SortOption, (sort: SortType) => QueryOrderMap<Command>> = {
	time: (sort: SortType) => ({ input: { dateTime: sort.direction === SortDirection.ASC ? 'asc' : 'desc' } }),
	name: (sort: SortType) => ({ inputText: sort.direction === SortDirection.ASC ? 'asc' : 'desc' }),
	text: (sort: SortType) => ({ inputText: sort.direction === SortDirection.ASC ? 'asc' : 'desc' }),
};

function getOrderByFromSort(sort: SortType | undefined): QueryOrderMap<Command> {
	const orderBy = sort?.sortBy && sortMapping[sort?.sortBy]?.(sort);

	if (!orderBy) {
		throw new Error(`Invalid sortBy value "${sort?.sortBy}"`);
	}

	return orderBy ?? { input: { log: { time: 'desc' } } };
}

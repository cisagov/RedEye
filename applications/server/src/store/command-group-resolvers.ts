import { FilterQuery } from '@mikro-orm/core';
import { Arg, Authorized, Resolver, Mutation, Query, Ctx } from 'type-graphql';
import { Beacon, Command, CommandGroup, Operator } from '@redeye/models';
import { beaconHidden, defaultHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import { RelationPath, type Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';

@Resolver(CommandGroup)
export class CommandGroupResolvers {
	@Authorized()
	@Query(() => [CommandGroup], { nullable: 'itemsAndList', description: 'Get command groups by ids' })
	async commandGroups(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<CommandGroup>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string,
		@Arg('operatorId', () => String, { nullable: true }) operatorId?: string,
		@Arg('commandType', () => String, { nullable: true }) commandType?: string,
		@Arg('commandIds', () => [String], { nullable: true }) commandIds?: Array<string>,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false
	): Promise<CommandGroup[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let commandGroups: CommandGroup[] = [];
		if (commandIds) {
			const query: FilterQuery<CommandGroup> = {
				commands: { id: commandIds.map((id) => id), ...beaconHidden(hidden) },
			};
			commandGroups = await em.find(CommandGroup, query, { populate: relationPaths });
		} else if (commandType) {
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { inputText: commandType, ...beaconHidden(hidden) } },
				{ populate: relationPaths }
			);
		} else if (operatorId) {
			const operator: Operator | null = await em.findOne(Operator, { id: operatorId });
			if (operator) {
				commandGroups = await em.find(
					CommandGroup,
					{ commands: { beacon: { id: operator.beacons.getIdentifiers() as string[], ...defaultHidden(hidden) } } },
					{ populate: relationPaths }
				);
			}
		} else if (beaconId) {
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { beacon: { id: beaconId, ...defaultHidden(hidden) } } },
				{ populate: relationPaths }
			);
		} else if (hostId) {
			const beacons = await em.find(Beacon, { host: hostId, ...defaultHidden(hidden) });
			const ids = beacons.map((beacon: Beacon) => beacon.id);
			commandGroups = await em.find(
				CommandGroup,
				{ commands: { beacon: { id: ids, ...defaultHidden(hidden) } } },
				{ populate: relationPaths }
			);
		} else {
			commandGroups = await em.find(CommandGroup, !hidden ? { commands: { ...beaconHidden(hidden) } } : {}, {
				populate: relationPaths,
			});
		}
		// TODO: Optimize init of commands with CommandGroups
		for (const commandGroup of commandGroups) {
			await commandGroup.commands.init({ where: beaconHidden(hidden) });
		}
		return commandGroups;
	}

	@Authorized()
	@Query(() => CommandGroup, { nullable: true, description: 'Get command group by id' })
	async commandGroup(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<CommandGroup>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('commandGroupId', () => String) commandGroupId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false
	): Promise<CommandGroup> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const commandGroup = await em.findOneOrFail(
			CommandGroup,
			{ id: commandGroupId, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
			{
				populate: relationPaths,
			}
		);
		await commandGroup.commands.init({ where: beaconHidden(hidden) });
		return commandGroup;
	}

	@Authorized()
	@Mutation(() => CommandGroup, { description: 'Add an Command to an existing CommandGroup' })
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

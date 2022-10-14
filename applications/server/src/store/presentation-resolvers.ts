import { EntityManager } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Field, ObjectType, Query, Resolver } from 'type-graphql';
import { CommandGroup, Link, Server, Tag } from '@redeye/models';
import { beaconHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { GraphQLContext } from '../types';

@ObjectType('PresentationItem')
class PresentationItem {
	@Field(() => String)
	id!: string;

	@Field(() => String)
	key?: string;

	@Field(() => Number)
	count: number = 0;

	@Field(() => [String])
	linkIds: string[] = [];

	@Field(() => [String], {
		description: 'Every beacon in the presentation. Including both presentation beacons and connection beacons.',
	})
	beaconIds: string[] = [];

	@Field(() => [String], {
		description:
			'Beacon Ids that are not in the command groups but are needed to link beacons to other beacons in the graph',
	})
	connectionBeaconIds: string[] = [];

	@Field(() => [PresentationCommandGroup])
	commandGroups: PresentationCommandGroup[] = [];

	constructor(props: PresentationItem) {
		Object.assign(this, props);
	}
}

@ObjectType('PresentationCommandGroup')
class PresentationCommandGroup {
	@Field(() => String)
	id!: string;

	@Field(() => [String])
	beaconIds: string[] = [];

	@Field(() => [String])
	commandIds: string[] = [];

	@Field(() => Date, { nullable: true })
	minDate?: Date;

	@Field(() => Date, { nullable: true })
	maxDate?: Date;

	constructor(props: PresentationCommandGroup) {
		Object.assign(this, props);
	}
}

type LinkTree = Record<string, { parents: string[] }>;

@Resolver(PresentationItem)
export class PresentationResolvers {
	shortestPathDfs(startNode: string, allNodes: string[], linkTree: LinkTree): string[] {
		const previous = new Map();
		previous.set(startNode, startNode);
		const dfs = (currentNode: string) => {
			if (linkTree[currentNode]?.parents) {
				for (const neighbor of linkTree[currentNode].parents) {
					previous.set(neighbor, currentNode);
					if (neighbor !== startNode && allNodes.includes(startNode)) break;
					dfs(neighbor);
				}
			}
		};
		dfs(startNode);
		return Array.from(previous.keys());
	}
	getBeaconsLinks(beaconIds: string[], linkTree: LinkTree): string[] {
		return Array.from(new Set(beaconIds.flatMap((beaconId) => this.shortestPathDfs(beaconId, beaconIds, linkTree))));
	}
	async getBeaconLinks(
		commandGroups: CommandGroup[],
		linkTree: LinkTree,
		em: EntityManager,
		hidden: boolean
	): Promise<{
		beaconIds: string[];
		connectionBeaconIds: string[];
		linkIds: string[];
		commandGroups: PresentationCommandGroup[];
	}> {
		const allBeaconIds: string[] = [];
		const allCommandGroups: PresentationCommandGroup[] = [];

		for (const commandGroup of commandGroups) {
			if (commandGroup.annotations.length) {
				let minDate: Date | undefined;
				let maxDate: Date | undefined;
				const beaconIds = new Set<string>();
				for (const command of await commandGroup.commands.init({
					populate: ['input'],
					where: !hidden ? beaconHidden(hidden) : {},
				})) {
					if (command.input?.dateTime) {
						const date = new Date(command.input?.dateTime);
						if (!minDate || date?.valueOf() <= minDate.valueOf()) minDate = date;
						if (!maxDate || date?.valueOf() >= maxDate.valueOf()) maxDate = date;
					}
					const server = await em.findOne(Server, { beacons: command.beacon.id });
					if (server?.id) beaconIds.add(server?.id);
					beaconIds.add(command.beacon.id);
				}
				const beaconIdsArr = Array.from(beaconIds);
				allBeaconIds.push(...beaconIdsArr);
				allCommandGroups.push(
					new PresentationCommandGroup({
						minDate,
						maxDate,
						id: commandGroup.id,
						beaconIds: beaconIdsArr,
						commandIds: commandGroup.commandIds,
					})
				);
			}
		}
		const beaconIdsArr = this.getBeaconsLinks(Array.from(new Set(allBeaconIds)), linkTree);
		const links = await em.find(Link, {
			$and: [{ origin: { id: { $in: beaconIdsArr } } }, { destination: { id: { $in: beaconIdsArr } } }],
		});
		return {
			beaconIds: beaconIdsArr,
			connectionBeaconIds: beaconIdsArr.filter((beaconId) => !allBeaconIds.includes(beaconId)),
			linkIds: links.map((l) => l.id),
			commandGroups: allCommandGroups,
		};
	}

	@Authorized()
	@Query(() => [PresentationItem], { nullable: 'itemsAndList', description: 'Get categories for presentation mode' })
	async presentationItems(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hidden', () => Boolean, { defaultValue: false }) hidden: boolean = false
	): Promise<PresentationItem[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const presentationItems: PresentationItem[] = [];
		const links = await em.find(Link, {}, { populate: false });
		type LinkItem = Record<string, { parents: Set<string> }>;
		const linkItems: LinkItem = {};
		for (const link of links) {
			if (link.origin?.id && !linkItems[link.origin?.id]) linkItems[link.origin?.id] = { parents: new Set<string>() };
			if (link.destination?.id && !linkItems[link.destination?.id])
				linkItems[link.destination?.id] = { parents: new Set<string>() };
			if (link.origin?.id && link.destination?.id) linkItems[link.destination.id].parents.add(link.origin?.id);
		}
		const linkTree: LinkTree = {};
		Object.entries(linkItems).forEach(([key, link]) => {
			linkTree[key] = { parents: Array.from(link.parents) };
		});
		// All Comments
		const allComments = await em.find(CommandGroup, !hidden ? { commands: { ...beaconHidden(hidden) } } : {}, {
			populate: ['commands', 'annotations'],
			orderBy: { commands: { input: { dateTime: 'asc' } } },
		});
		const commandGroups = await this.getBeaconLinks(allComments, linkTree, em, hidden);
		presentationItems.push(
			new PresentationItem({
				id: 'all',
				key: 'All Comments',
				count: commandGroups.commandGroups.length,
				...commandGroups,
			})
		);

		// Favorite comments
		const favoritedComments = await em.find(
			CommandGroup,
			{ annotations: { favorite: true }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
			{
				populate: ['commands', 'annotations'],
				orderBy: { commands: { input: { dateTime: 'asc' } } },
			}
		);
		const commandGroupsLink = await this.getBeaconLinks(favoritedComments, linkTree, em, hidden);
		presentationItems.push(
			new PresentationItem({
				id: 'favorited',
				key: 'Favorited Comments',
				count: favoritedComments.length,
				...commandGroupsLink,
			})
		);

		// Populate Tags
		const tags = await em.find(Tag, {}, { populate: false });
		const commandsByTag: PresentationItem[] = [];
		for (const tag of tags) {
			const cmdGroup = await em.find(
				CommandGroup,
				{ annotations: { tags: tag }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
				{
					populate: ['commands', 'annotations'],
					orderBy: { commands: { input: { dateTime: 'asc' } } },
				}
			);
			const commandGroupsLink = await this.getBeaconLinks(cmdGroup, linkTree, em, hidden);
			if (cmdGroup.length) {
				commandsByTag.push({
					id: tag.text,
					key: `#${tag.text}`,
					count: cmdGroup.length,
					...commandGroupsLink,
				});
			}
		}

		// Sort the documents tag.text
		commandsByTag.sort((a, b) => a.id.localeCompare(b.id));
		commandsByTag.forEach((commandGroup) => {
			presentationItems.push(commandGroup);
		});

		return presentationItems;
	}
}

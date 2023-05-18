import { EntityManager } from '@mikro-orm/core';
import { Arg, Authorized, Ctx, Field, InputType, ObjectType, Query, Resolver, registerEnumType } from 'type-graphql';
import { CommandGroup, Link, Server, Tag } from '@redeye/models';
import { beaconHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { GraphQLContext } from '../types';
import { SortDirection } from './command-resolvers';

enum SortOptionCommentsList {
	alphabetical = 'alphabetical',
	commentCount = 'commentCount',
	commandCount = 'commandCount',
}

registerEnumType(SortOptionCommentsList, {
	name: 'SortOptionCommentsList',
	description: 'The desired property to sort Comments List on',
});

enum SortOptionCommentsTab {
	fav = 'fav',
	user = 'user',
	minTime = 'minTime',
}

registerEnumType(SortOptionCommentsTab, {
	name: 'SortOptionCommentsTab',
	description: 'The desired property to sort overview Comments Tab on',
});

@InputType('SortTypeCommentsList')
class SortTypeCommentsList {
	@Field(() => SortOptionCommentsList, { nullable: true, defaultValue: SortOptionCommentsList.alphabetical })
	sortBy?: SortOptionCommentsList;

	@Field(() => SortDirection, {
		nullable: true,
		defaultValue: SortDirection.ASC,
	})
	direction?: SortDirection = SortDirection.ASC;
}

@InputType('SortTypeCommentsTab')
class SortTypeCommentsTab {
	@Field(() => SortOptionCommentsTab, { nullable: true, defaultValue: SortOptionCommentsTab.minTime })
	sortBy?: SortOptionCommentsTab;

	@Field(() => SortDirection, {
		nullable: true,
		defaultValue: SortDirection.ASC,
	})
	direction?: SortDirection = SortDirection.ASC;
}

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

	@Field(() => Number)
	commandCount: number = 0;

	@Field(() => [String])
	commandGroupIds: string[] = [];

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
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false,
		@Arg('forOverviewComments', () => Boolean, { defaultValue: false, nullable: true })
		forOverviewComments: boolean = false,
		@Arg('listSort', () => SortTypeCommentsList, {
			nullable: true,
			defaultValue: { sortBy: SortOptionCommentsList.alphabetical },
		})
		listSort: SortTypeCommentsList = { sortBy: SortOptionCommentsList.alphabetical },
		@Arg('commentsTabSort', () => SortTypeCommentsTab, {
			nullable: true,
			defaultValue: { sortBy: SortOptionCommentsTab.minTime },
		})
		commentsTabSort: SortTypeCommentsTab = { sortBy: SortOptionCommentsTab.minTime }
	): Promise<PresentationItem[]> {
		console.log(forOverviewComments, commentsTabSort);
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

		// sort helper function for both presentation and overview comments list/tab
		// for overview comment list sorting
		const sortCommentList = (items: PresentationItem[]) => {
			if (listSort.sortBy === SortOptionCommentsList.alphabetical) {
				items.sort((a, b) => (listSort.direction === 'DESC' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id)));
			}
			if (listSort.sortBy === SortOptionCommentsList.commentCount) {
				items.sort((a, b) => (listSort.direction === 'DESC' ? b.count - a.count : a.count - b.count));
			}
			if (listSort.sortBy === SortOptionCommentsList.commandCount) {
				items.sort((a, b) =>
					listSort.direction === 'DESC' ? b.commandCount - a.commandCount : a.commandCount - b.commandCount
				);
			}
			return items;
		};
		const orderBy = !forOverviewComments
			? { commands: { input: { dateTime: SortDirection.ASC } } }
			: commentsTabSort.sortBy === SortOptionCommentsTab.minTime
			? { annotations: { date: commentsTabSort.direction } }
			: commentsTabSort.sortBy === SortOptionCommentsTab.fav
			? { annotations: { favorite: commentsTabSort.direction } }
			: { annotations: { user: commentsTabSort.direction } };

		// All Comments
		const allComments = await em.find(CommandGroup, !hidden ? { commands: { ...beaconHidden(hidden) } } : {}, {
			populate: ['commands', 'annotations'],
			orderBy,
		});
		const commandGroups = await this.getBeaconLinks(allComments, linkTree, em, hidden);
		const allCommandCount = commandGroups.commandGroups.reduce(
			(count, commandGroup) => count + commandGroup.commandIds.length,
			0
		);
		const allCommandGroupIds = commandGroups.commandGroups.map((commandGroup) => commandGroup.id);
		presentationItems.push(
			new PresentationItem({
				id: 'all',
				key: 'All Comments',
				count: commandGroups.commandGroups.length,
				commandCount: allCommandCount,
				commandGroupIds: allCommandGroupIds,
				...commandGroups,
			})
		);

		// Favorite comments
		const favoritedComments = await em.find(
			CommandGroup,
			{ annotations: { favorite: true }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
			{
				populate: ['commands', 'annotations'],
				orderBy,
			}
		);
		const commandGroupsLink = await this.getBeaconLinks(favoritedComments, linkTree, em, hidden);
		const commandCount = commandGroupsLink.commandGroups.reduce(
			(count, commandGroup) => count + commandGroup.commandIds.length,
			0
		);
		const commandGroupIds = commandGroupsLink.commandGroups.map((commandGroup) => commandGroup.id);
		presentationItems.push(
			new PresentationItem({
				id: 'favorited',
				key: 'Favorited Comments',
				count: favoritedComments.length,
				commandCount,
				commandGroupIds,
				...commandGroupsLink,
			})
		);

		// procedural comments
		const proceduralComments = await em.find(
			CommandGroup,
			{ annotations: { generation: 'PROCEDURAL' }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
			{
				populate: ['commands', 'annotations'],
				orderBy,
			}
		);
		const proceduralCommandGroupsLink = await this.getBeaconLinks(proceduralComments, linkTree, em, hidden);
		const proceduralCommandCount = proceduralCommandGroupsLink.commandGroups.reduce(
			(count, commandGroup) => count + commandGroup.commandIds.length,
			0
		);
		const proceduralCommandGroupIds = proceduralCommandGroupsLink.commandGroups.map((commandGroup) => commandGroup.id);
		presentationItems.push(
			new PresentationItem({
				id: 'procedural',
				key: 'parser-generated',
				count: proceduralComments.length,
				commandCount: proceduralCommandCount,
				commandGroupIds: proceduralCommandGroupIds,
				...proceduralCommandGroupsLink,
			})
		);

		// Populate User comments
		// For User comments, make sure use a 'user-' prefix in case the username is same to other general types.
		const userComments: Record<string, CommandGroup[]> = {};
		let commandsByUser: PresentationItem[] = [];
		const manualComments = await em.find(
			CommandGroup,
			{ annotations: { generation: 'MANUAL' }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
			{
				populate: ['commands', 'annotations'],
				orderBy,
			}
		);
		for (const manualComment of manualComments) {
			userComments[manualComment.annotations[0].user] = (userComments[manualComment.annotations[0].user] || []).concat(
				manualComment
			);
		}
		for (const user of Object.keys(userComments)) {
			const manualCommandGroupsLink = await this.getBeaconLinks(userComments[user], linkTree, em, hidden);
			const manualCommandCount = manualCommandGroupsLink.commandGroups.reduce(
				(count, commandGroup) => count + commandGroup.commandIds.length,
				0
			);
			const manualCommandGroupIds = manualCommandGroupsLink.commandGroups.map((commandGroup) => commandGroup.id);
			commandsByUser.push(
				new PresentationItem({
					id: `user-${user}`,
					key: `user-${user}`,
					count: userComments[user].length,
					commandCount: manualCommandCount,
					commandGroupIds: manualCommandGroupIds,
					...manualCommandGroupsLink,
				})
			);
		}
		// Sort the documents by userId
		commandsByUser = sortCommentList(commandsByUser);
		commandsByUser.forEach((commandGroup) => {
			presentationItems.push(commandGroup);
		});

		// Populate Tags
		// For Tag comments, make sure use a 'tag-' id prefix in case the tag name is same to other general types.
		const tags = await em.find(Tag, {}, { populate: false });
		let commandsByTag: PresentationItem[] = [];
		for (const tag of tags) {
			const cmdGroup = await em.find(
				CommandGroup,
				{ annotations: { tags: tag }, ...(!hidden ? { commands: { ...beaconHidden(hidden) } } : {}) },
				{
					populate: ['commands', 'annotations'],
					orderBy,
				}
			);
			const commandGroupsLink = await this.getBeaconLinks(cmdGroup, linkTree, em, hidden);
			const commandCount = commandGroupsLink.commandGroups.reduce(
				(count, commandGroup) => count + commandGroup.commandIds.length,
				0
			);
			const commandGroupIds = commandGroupsLink.commandGroups.map((commandGroup) => commandGroup.id);
			if (cmdGroup.length) {
				commandsByTag.push({
					id: `tag-${tag.text}`,
					key: `#${tag.text}`,
					count: cmdGroup.length,
					commandCount,
					commandGroupIds,
					...commandGroupsLink,
				});
			}
		}

		// Sort the documents tag.text
		commandsByTag = sortCommentList(commandsByTag);
		commandsByTag.forEach((commandGroup) => {
			presentationItems.push(commandGroup);
		});
		return presentationItems;
	}
}

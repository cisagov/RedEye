import { Arg, Resolver, Query, Authorized, Ctx, Mutation } from 'type-graphql';
import { Beacon, Campaign, Host, GlobalOperator, Server, ServerType, Shapes } from '@redeye/models';
import { connectToProjectEmOrFail, getMainEmOrFail } from './utils/project-db';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';
import { OperatorResolvers } from './operator-resolvers';
import { NonHidableEntities, getNonHidableEntities } from './utils/hidden-entities-helper';

@Resolver(Server)
export class ServerResolvers {
	@Authorized()
	@Query(() => [Server], { nullable: 'itemsAndList', description: 'Get the list of servers for a project' })
	async servers(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('username', () => String) username: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true, description: 'Should show hidden values' })
		hidden: boolean = false,
		@RelationPath() relationPaths: Relation<Server>
	): Promise<Server[]> {
		const projectEm = await connectToProjectEmOrFail(campaignId, ctx);
		const em = getMainEmOrFail(ctx);

		let operator = await em.findOne(GlobalOperator, username);
		if (!operator) {
			operator = await OperatorResolvers.createGlobalOperatorHandler(ctx, username);
		}
		try {
			await em.nativeUpdate(Campaign, { id: campaignId }, { lastOpenedBy: operator });
		} catch (e) {
			console.debug(e);
		}
		const servers = await projectEm.find(Server, !hidden ? { hidden, beacons: { hidden } } : {}, {
			populate: relationPaths,
		});
		for (const server of servers) await server.beacons.init({ where: !hidden ? { hidden } : {} });
		ctx.cm.forkMain();
		return servers;
	}

	@Authorized()
	@Query(() => NonHidableEntities, { description: '' })
	async nonHidableEntities(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('beaconIds', () => [String], { defaultValue: [], nullable: true }) beaconIds: string[] = [],
		@Arg('hostIds', () => [String], { defaultValue: [], nullable: true }) hostIds: string[] = []
	): Promise<NonHidableEntities | null> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);

		const { cantHideBeacons, cantHideHosts, cantHideServers } = await getNonHidableEntities({
			em,
			beaconsToHide: beaconIds,
			hostsToHide: hostIds,
		});
		return new NonHidableEntities({
			beacons: cantHideBeacons,
			hosts: cantHideHosts,
			servers: cantHideServers,
		});
	}

	@Authorized()
	@Mutation(() => Boolean)
	async serversParse(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string
	): Promise<boolean> {
		if (!ctx.config.redTeam) throw new Error('Parsing cannot be invoked from blue team mode');
		await connectToProjectEmOrFail(campaignId, ctx);
		const mainEm = getMainEmOrFail(ctx);
		const campaign = await mainEm.findOneOrFail(Campaign, campaignId);
		if (!campaign.parsers) throw new Error('No parser is configured for this campaign');
		ctx.messengerMachine.send({
			type: 'PARSE_CAMPAIGN',
			campaignId,
			context: ctx,
			parserName: campaign.parsers[0].parserName,
		});
		return true;
	}

	@Authorized()
	@Mutation(() => [Server], { description: 'Toggle server hidden state' })
	async toggleServerHidden(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('serverId', () => String, { nullable: true }) serverId?: string,
		@Arg('serverIds', () => [String], { nullable: true }) serverIds?: Array<string>,
		@Arg('setHidden', () => Boolean, { nullable: true }) setHidden?: boolean
	): Promise<Server[] | undefined> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		if (serverId) {
			const server = await em.findOneOrFail(Server, serverId);
			server.hidden = !server.hidden;
			await server.beacons.init();
			for (const beacon of server.beacons) {
				await em.nativeUpdate(Beacon, { id: beacon.id }, { hidden: server.hidden });
				await em.nativeUpdate(Host, { id: beacon.host?.id }, { hidden: server.hidden });
			}
			await em.persistAndFlush(server);
			ctx.cm.forkProject(campaignId);
			return [server];
		} else if (serverIds) {
			const servers = await em.find(Server, serverIds);
			for (const server of servers) {
				if (setHidden !== undefined) {
					server.hidden = setHidden;
					await server.beacons.init();
					for (const beacon of server.beacons) {
						await em.nativeUpdate(Beacon, { id: beacon.id }, { hidden: server.hidden });
						await em.nativeUpdate(Host, { id: beacon.host?.id }, { hidden: server.hidden });
					}
					await em.persistAndFlush(server);
				}
			}
			ctx.cm.forkProject(campaignId);
			return servers;
		}
		return undefined;
	}

	@Authorized()
	@Mutation(() => Server, { description: 'Update existing Server name' })
	async updateServerMetadata(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Server>,
		@Arg('serverId', () => String) serverId: string,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('serverDisplayName', () => String, { nullable: true }) serverDisplayName?: string,
		@Arg('serverType', () => ServerType, { nullable: true }) serverType?: ServerType,
		@Arg('shape', () => Shapes, { nullable: true }) shape?: Shapes,
		@Arg('color', () => String, { nullable: true }) color?: string
	): Promise<Server> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const server = await em.findOneOrFail(Server, serverId, { populate: relationPaths });
		if (serverDisplayName) {
			server.displayName = serverDisplayName;
			await em.nativeUpdate(
				Beacon,
				{ host: { cobaltStrikeServer: true }, server: serverId },
				{ displayName: serverDisplayName }
			);
			await em.nativeUpdate(
				Host,
				{ cobaltStrikeServer: true, beacons: { server: serverId } },
				{ displayName: serverDisplayName }
			);
		}
		if (serverType) {
			server.meta.type = serverType;
		}
		if (shape) {
			server.meta.shape = shape;
		}
		if (color) {
			server.meta.color = color;
		}
		await em.persistAndFlush(server);

		return server;
	}

	@Authorized()
	@Mutation(() => Server, {
		description: 'Add a server from folder already accessible from the server',
		deprecationReason: 'FOR CYPRESS TESTING PURPOSES ONLY',
	})
	async addLocalServerFolder(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: UUID,
		@Arg('name', () => String) name: string,
		@Arg('path', () => String) path: string
	): Promise<Server> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const server = new Server({ name, parsingPath: path });
		await em.persistAndFlush(server);

		return server;
	}
}

import { MikroORM } from '@mikro-orm/core';
import { existsSync } from 'fs';
import path from 'path';
import { interpret } from 'xstate';
import { AnonymizationInput, anonymizationMachine } from '../machines/anonymization/anonymization.machine';
import { getDbPath } from '../util';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Campaign, getProjectMikroOrmConfig, GlobalOperator } from '@redeye/models';
import { connectToProjectOrm, getMainEmOrFail } from './utils/project-db';
import fs from 'fs-extra';
import { RelationPath, type Relation } from './utils/relation-path';
import type { GraphQLContext } from '../types';
import { randomUUID } from 'crypto';
import { GraphQLError } from 'graphql';

@Resolver(Campaign)
export class CampaignResolvers {
	@Authorized()
	@Query(() => [Campaign], { nullable: 'itemsAndList', description: 'Get the list of Campaigns' })
	async campaigns(@Ctx() ctx: GraphQLContext, @RelationPath() relationPaths: Relation<Campaign>): Promise<Campaign[]> {
		const em = getMainEmOrFail(ctx);
		return await em.getRepository(Campaign).findAll({ populate: relationPaths });
	}

	@Authorized()
	@Query(() => Campaign, { nullable: true, description: 'Get a single campaign' })
	async campaign(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@RelationPath() relationPaths: Relation<Campaign>
	): Promise<Campaign> {
		const em = getMainEmOrFail(ctx);
		return await em.fork().getRepository(Campaign).findOneOrFail({ id: campaignId }, { populate: relationPaths });
	}

	@Authorized()
	@Mutation(() => Campaign, { description: 'Create a new Campaign' })
	async createCampaign(
		@Ctx() ctx: GraphQLContext,
		@Arg('name', () => String) name: string,
		@Arg('parser', () => String) parser: string,
		@Arg('creatorName', () => String) creatorName: string
	): Promise<Campaign> {
		const em = getMainEmOrFail(ctx);
		let operator: GlobalOperator;
		const definedOperator = await em.findOne(GlobalOperator, creatorName);

		if (!definedOperator) {
			const newOperator = new GlobalOperator({ id: creatorName });
			await em.persistAndFlush(newOperator);
			operator = newOperator;
		} else {
			operator = definedOperator;
		}

		const campaign = new Campaign({
			name,
			lastOpenedBy: operator,
			creator: operator,
			parsers: [{ parserName: parser, path: '' }],
		});

		await em.persistAndFlush(campaign);
		await connectToProjectOrm(campaign.id, ctx, { createNewDb: true });
		return campaign;
	}

	@Authorized()
	@Mutation(() => Boolean, { description: 'Delete a Campaign by id' })
	async deleteCampaign(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string
	): Promise<boolean> {
		const em = getMainEmOrFail(ctx);
		await em.nativeDelete(Campaign, campaignId);
		const filePath = `${getDbPath(ctx.config.databaseMode)}/campaign/${campaignId}`;
		// delete the campaign folder
		await fs.remove(filePath);
		ctx.cm.delete(campaignId);
		ctx.cm.forkMain();
		return true;
	}

	@Authorized()
	@Mutation(() => Campaign, { description: 'Rename existing Campaign' })
	async renameCampaign(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('name', () => String) name: string
	): Promise<Campaign> {
		const em = getMainEmOrFail(ctx);
		const campaign = await em.findOneOrFail(Campaign, campaignId);
		campaign.name = name;
		await em.persistAndFlush(campaign);
		ctx.cm.forkMain();
		return campaign;
	}

	@Authorized()
	@Mutation(() => String, { description: 'Anonymize campaign for export' })
	async anonymizeCampaign(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('anonymizeOptions', () => AnonymizationInput) anonymizeOptions: AnonymizationInput
	): Promise<string | void> {
		if (!ctx.config.redTeam)
			throw new GraphQLError('Blue team cannot export', undefined, undefined, undefined, undefined, undefined, {
				extensions: {
					code: 'UNAUTHENTICATED',
				},
			});
		const tempCampaignFolder = `campaign-${randomUUID()}`;
		const dbPath = path.join(getDbPath(ctx.config.databaseMode), 'campaign', campaignId);
		const anonymizedDbPath = path.join(getDbPath(ctx.config.databaseMode), 'anonymized-campaigns', tempCampaignFolder);
		const exists = existsSync(dbPath);
		if (!exists) {
			throw Error('Database not found');
		} else {
			try {
				const filePath = path.join(anonymizedDbPath, 'db.redeye');

				await fs.copy(dbPath, anonymizedDbPath);
				const orm = await MikroORM.init({ ...getProjectMikroOrmConfig(filePath) });
				await orm.em.getDriver().execute('PRAGMA wal_checkpoint');
				await orm.close();

				const machine = interpret(
					anonymizationMachine.withContext({
						database: filePath,
						...anonymizeOptions,
					})
				).start();
				machine.send('ANONYMIZE');
				return new Promise(async (resolve, reject) => {
					machine.onDone(() => {
						// If there is an error during anonymization delete copy and return the error
						if (machine.state.context.error) {
							console.debug('Error during export & anonymization ', machine.state.context.error);
							fs.rmSync(anonymizedDbPath, { recursive: true });
							return reject(new Error(machine.state.context.error));
						} else {
							// After a minute, delete the folder if it still exists
							setTimeout(() => {
								if (fs.existsSync(anonymizedDbPath)) {
									fs.rmSync(anonymizedDbPath, { recursive: true });
								}
							}, 60000);
							return resolve(tempCampaignFolder);
						}
					});
				});
			} catch (e) {
				fs.rmSync(anonymizedDbPath, { recursive: true });
				throw Error((e as Error).message);
			}
		}
	}
}

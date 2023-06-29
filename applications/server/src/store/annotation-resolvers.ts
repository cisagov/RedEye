import { FilterQuery } from '@mikro-orm/core';
import { Arg, Authorized, Mutation, Query, Resolver, Ctx } from 'type-graphql';
import { Annotation, Campaign, Command, CommandGroup, Tag } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { EntityManager, GraphQLContext } from '../types';
import { Relation, RelationPath } from './utils/relation-path';
import { beaconHidden } from './utils/hidden-entities-helper';

@Resolver(Annotation)
export class AnnotationResolvers {
	@Authorized()
	@Query(() => [Annotation], { nullable: 'itemsAndList', description: 'Get all annotations for a project' })
	async annotations(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string
	): Promise<Annotation[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		// TODO: switch to populate paths if possible
		const annotations = await em.find(Annotation, {}, { populate: true });
		await Promise.all(
			annotations.map(async (annotation) => {
				await annotation.commandGroup?.commands?.init();
			})
		);
		return annotations;
	}

	@Authorized()
	@Query(() => [Tag], { nullable: 'itemsAndList', description: 'Get all tags for a project' })
	async tags(@Ctx() ctx: GraphQLContext, @Arg('campaignId', () => String) campaignId: string) {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		return await em.find(Tag, {}, { populate: false });
	}

	@Authorized()
	@Query(() => Annotation, { nullable: true, description: 'Get an annotation' })
	async annotation(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('annotationId', () => String) annotationId: string
	): Promise<Annotation> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		// TODO: switch to populate paths if possible
		const annotation = await em.findOneOrFail(Annotation, annotationId, { populate: true });
		await annotation.commandGroup?.commands?.init();
		return annotation;
	}

	@Authorized()
	@Mutation(() => Annotation, { description: 'Create a CommandGroup annotation' })
	async addCommandGroupAnnotation(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('text', () => String) text: string,
		@Arg('tags', () => [String]) tags: string[],
		@Arg('user', () => String) user: string,
		@Arg('commandIds', () => [String]) commandIds: string[],
		@Arg('favorite', () => Boolean, { nullable: true }) favorite?: boolean
	): Promise<Annotation> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const annotation = await Annotation.createAnnotation(em, text, user, { favorite, tags });
		const commands = await em.find<Command>(Command, commandIds);
		const commandGroup = new CommandGroup({});
		em.persist(commandGroup);
		commandGroup.commands.add(commands);
		commandGroup.annotations.add(annotation);
		await em.flush();
		await updateAnnotationCount(campaignId, em, ctx.cm.em);
		ctx.cm.forkProject(campaignId);
		ctx.cm.forkMain();
		return annotation;
	}

	@Authorized()
	@Mutation(() => Annotation, { description: 'Update existing Annotation' })
	async updateAnnotation(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('text', () => String) text: string,
		@Arg('tags', () => [String]) tags: string[],
		@Arg('user', () => String) user: string,
		@Arg('annotationId', () => String) annotationId: string,
		@Arg('favorite', () => Boolean, { nullable: true }) favorite?: boolean
	): Promise<Annotation> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let annotation = await em.findOneOrFail<Annotation>(Annotation, annotationId);
		const updatedTags = await Tag.createTags(em, tags ?? []);
		annotation = em.assign(annotation, { user: user || annotation.user, text, favorite, tags: updatedTags });
		await em.persistAndFlush(annotation);
		ctx.cm.forkProject(campaignId);
		return annotation;
	}

	@Authorized()
	@Mutation(() => Annotation, { description: 'Delete existing Annotation' })
	async deleteAnnotation(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('annotationId', () => String) annotationId: string
	): Promise<Annotation> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const annotation = await em.findOneOrFail<Annotation>(Annotation, annotationId);
		await em.removeAndFlush(annotation);
		if (annotation.commandGroupId) {
			const commandGroup = await em.findOneOrFail(
				CommandGroup,
				{ id: annotation.commandGroupId },
				{ populate: ['annotations'] }
			);
			if (!commandGroup.annotations.length) await em.removeAndFlush(commandGroup);
		}
		await updateAnnotationCount(campaignId, em, ctx.cm.em);
		ctx.cm.forkProject(campaignId);
		ctx.cm.forkMain();
		return annotation;
	}

	@Authorized()
	@Mutation(() => Annotation, { description: 'Add an Annotation to an existing CommandGroup' })
	async addAnnotationToCommandGroup(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('text', () => String) text: string,
		@Arg('tags', () => [String]) tags: string[],
		@Arg('user', () => String) user: string,
		@Arg('commandGroupId', () => String) commandGroupId: string,
		@Arg('favorite', () => Boolean, { nullable: true }) favorite?: boolean
	): Promise<Annotation> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		const commandGroup = await em.findOneOrFail(CommandGroup, commandGroupId);
		const annotation = await Annotation.createAnnotation(em, text, user, {
			favorite,
			commandGroup,
			tags,
		});

		await em.flush();
		await updateAnnotationCount(campaignId, em, ctx.cm.em);
		ctx.cm.forkProject(campaignId);
		ctx.cm.forkMain();
		return annotation;
	}

	@Authorized()
	@Query(() => [Annotation], { nullable: true, description: 'Search Annotations from textQuery' })
	async searchAnnotations(
		@Ctx() ctx: GraphQLContext,
		@RelationPath() relationPaths: Relation<Annotation>,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('searchQuery', () => String) searchQuery: string,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false
	): Promise<Annotation[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);

		const queries = searchQuery.split(' ').map((str) => ({
			$or: [
				{
					tags: {
						text: { $like: `%${str}%` },
					},
				},
				{ text: { $like: `%${str}%` } },
			],
		}));

		const annotationQuery: FilterQuery<Annotation> = {
			...(!hidden
				? {
						commandGroup: {
							commands: {
								...beaconHidden(hidden),
							},
						},
				  }
				: {}),
			$and: queries,
		};

		return await em.find(Annotation, annotationQuery, {
			populate: relationPaths,
		});
	}
}

/**
 * Updates the global comment count for campaign
 * @param {string} campaignId
 * @param {EntityManager} projectEm
 * @param {EntityManager} globalEm
 * @returns {Promise<void>}
 */
async function updateAnnotationCount(
	campaignId: string,
	projectEm: EntityManager,
	globalEm: EntityManager
): Promise<void> {
	const annotationCount: number = await projectEm.count(Annotation);
	await globalEm.nativeUpdate(Campaign, { id: campaignId }, { annotationCount });
}

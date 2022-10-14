import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Image } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { GraphQLContext } from '../types';
import { RelationPath } from './utils/relation-path';
import type { Relation } from './utils/relation-path';

@Resolver(Image)
export class ImageResolvers {
	@Authorized()
	@Query(() => [Image], { nullable: 'itemsAndList', description: 'Get images by ids' })
	async images(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId: string | undefined,
		@Arg('beaconId', () => String, { nullable: true }) beaconId: string | undefined,
		@RelationPath() relationPaths: Relation<Image>
	): Promise<Image[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let images: Image[] = [];
		if (beaconId) {
			images = await em.find(Image, { beacon: beaconId }, { populate: relationPaths });
		} else if (hostId) {
			images = await em.find(Image, { beacon: { host: hostId } }, { populate: relationPaths });
		} else {
			images = await em.find(Image, {}, { populate: relationPaths });
		}
		return fixUrl(images, campaignId);
	}
}

function fixUrl(images: Image[], campaignId: string): Image[] {
	images.forEach((img) => {
		img.url = `/api/image/${campaignId}/${img.id}.jpg`;
	});
	return images;
}

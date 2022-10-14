import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { File } from '@redeye/models';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { GraphQLContext } from '../types';

@Resolver(File)
export class FileResolvers {
	@Authorized()
	@Query(() => [File], { nullable: 'itemsAndList', description: 'Get images by ids' })
	async files(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('hostId', () => String, { nullable: true }) hostId?: string,
		@Arg('beaconId', () => String, { nullable: true }) beaconId?: string
	): Promise<File[]> {
		const em = await connectToProjectEmOrFail(campaignId, ctx);
		let files: File[];
		if (beaconId) {
			files = await em.find(File, { beacon: beaconId });
		} else if (hostId) {
			files = await em.find(File, { beacon: { host: hostId } });
		} else {
			files = await em.find(File, {});
		}
		return files;
	}
}

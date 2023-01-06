import { Resolver, Query, Authorized } from 'type-graphql';
import { ParsingProgress } from '@redeye/models';

@Resolver(ParsingProgress)
export class ProgressResolvers {
	@Authorized()
	@Query(() => ParsingProgress, { description: 'Get the current progress of the parser' })
	async parsingProgress(): Promise<ParsingProgress> {
		return { progress: [], nextTaskDescription: "I'm broken", date: new Date() };
	}
}

import { Field, ObjectType, Int } from 'type-graphql';

// ! Likely to be completely overhauled with new parser

@ObjectType()
export class ServerParsingProgress {
	constructor(totalTasks: number, serverName: string, campaignId: string) {
		this.totalTasks = totalTasks;
		this.serverName = serverName;
		this.campaignId = campaignId;
	}

	@Field(() => String)
	serverName: string;

	@Field(() => String)
	campaignId: string;

	@Field(() => Int)
	totalTasks!: number;

	@Field(() => Int)
	tasksCompleted: number = 0;
}

@ObjectType()
export class ParsingProgress {
	@Field(() => [ServerParsingProgress])
	progress: ServerParsingProgress[] = [];

	@Field(() => String)
	nextTaskDescription: string = 'No Current Tasks';

	@Field(() => Date)
	date: Date = new Date();
}

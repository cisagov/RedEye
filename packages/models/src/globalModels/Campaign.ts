import type { Rel } from '@mikro-orm/core';
import { Property, PrimaryKey, Entity, ManyToOne } from '@mikro-orm/core';
import { Field, ObjectType, Int, registerEnumType } from 'type-graphql';
import { GlobalOperator } from './Operator';
import { randomUUID } from 'crypto';

export enum ParsingStatus {
	// Campaign has been created but no servers have been added
	NOT_READY_TO_PARSE = 'NOT_READY_TO_PARSE',
	// Live parsing cobalt strike server, manual uploaded parsing disallowed
	// parsing may or may not be happening at this exact time
	LIVE_PARSING_CS = 'LIVE_PARSING_CS',
	// manual parsing failure
	PARSING_FAILURE = 'PARSING_FAILURE',
	// Manual parsing campaign ready to parse but not initiated
	PARSING_NOT_STARTED = 'PARSING_NOT_STARTED',
	// Manual parsing campaign ready to parse and will be parsed when bandwidth is available
	PARSING_QUEUED = 'PARSING_QUEUED',
	// manual parsing is currently ongoing
	PARSING_IN_PROGRESS = 'PARSING_IN_PROGRESS',
	// manual parsing is complete
	PARSING_COMPLETED = 'PARSING_COMPLETED',
}

registerEnumType(ParsingStatus, {
	name: 'ParsingStatus',
	description: 'The current state of Campaign parsing',
});

type RequiredInsertArgs = Pick<Campaign, 'name'>;

@ObjectType()
@Entity()
export class Campaign {
	constructor({ name, ...optionals }: RequiredInsertArgs & Partial<Campaign>) {
		Object.assign(this, optionals || {});
		this.name = name;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String)
	@Property()
	name: string;

	@Field(() => Int)
	@Property()
	annotationCount: number = 0;

	@Field(() => Int)
	@Property()
	beaconCount: number = 0;

	@Field(() => Int)
	@Property()
	serverCount: number = 0;

	@Field(() => Int)
	@Property()
	computerCount: number = 0;

	@Field(() => Int)
	@Property()
	commandCount: number = 0;

	@Field(() => Boolean)
	@Property({ default: false })
	migrationError: boolean = false;

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	firstLogTime?: Date;

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	lastLogTime?: Date;

	@Field((_type) => ParsingStatus)
	@Property({ type: 'string' })
	parsingStatus: ParsingStatus = ParsingStatus.NOT_READY_TO_PARSE;

	@Field(() => [CampaignParser], { nullable: true })
	@Property({ type: 'json', nullable: true })
	parsers?: CampaignParser[];

	// relationships
	@Field(() => GlobalOperator, { nullable: true })
	@ManyToOne(() => GlobalOperator, { nullable: true })
	lastOpenedBy?: Rel<GlobalOperator>;

	@Field(() => GlobalOperator, { nullable: true })
	@ManyToOne(() => GlobalOperator, { nullable: true })
	creator?: Rel<GlobalOperator>;
}

@ObjectType()
export class CampaignParser {
	@Field(() => String, { nullable: true })
	parserName!: string;

	@Field(() => String, { nullable: true })
	path!: string;
}

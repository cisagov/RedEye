import { Property, PrimaryKey, Entity, ManyToOne, Unique, OneToOne } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

import { randomUUID } from 'crypto';
import { Beacon } from './Beacon';
import { LogEntry } from './LogEntry';

@ObjectType({ description: 'Data derived from the Beacon metadata line' })
@Entity()
@Unique({ properties: ['pid', 'username', 'startTime', 'endTime', 'ip', 'beacon'] })
export class BeaconMeta {
	constructor(args: InsertArgs) {
		const { source, beacon, ...others } = args;
		this.source = source;
		this.beacon = beacon;
		Object.assign(this, others);
	}

	@Field(() => String)
	@PrimaryKey()
	id: UUID = randomUUID();

	@Field(() => Int, { nullable: true, description: 'Process Identifier the beacon is running on' })
	@Property({ nullable: true })
	pid?: number;

	@Field(() => String, { nullable: true, description: 'The username the beacon is running under' })
	@Property({ nullable: true })
	username?: string;

	@Field(() => Date, { nullable: true, description: 'The start time of the beacon' })
	@Property({ nullable: true })
	startTime?: Date;

	@Field(() => Date, { nullable: true, description: 'The time that the last command was run' })
	@Property({ nullable: true })
	endTime?: Date;

	@Field(() => String, { nullable: true, description: 'The IP of the host at the time of the metadata line' })
	@Property({ nullable: true })
	ip?: string;

	@Property({ nullable: true })
	origin?: string;

	@OneToOne({ owner: true, entity: () => LogEntry })
	source: LogEntry;

	// Right now this is a ManyToOne because the meta line can have variations. The idea is that we'll eventually be able to deconflict them
	@ManyToOne(() => Beacon, { onDelete: 'cascade' })
	beacon: Beacon;
}

type InsertArgs = Omit<BeaconMeta, 'id'>;

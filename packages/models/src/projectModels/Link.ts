import { PrimaryKey, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Beacon } from './Beacon';
import { Command } from './Command';
import { randomUUID } from 'crypto';

@ObjectType()
@Entity()
export class Link {
	constructor(obj: Omit<Link, 'id'>) {
		Object.assign(this, obj);
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String, { nullable: true, description: 'The display name of the link' })
	@Property({ nullable: true })
	name?: string;

	@Field(() => Date, {
		nullable: true,
		description: "Shouldn't be nullable but it is to handle bad data sets",
	})
	@Property({ nullable: true })
	startTime?: Date;

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	endTime?: Date;

	@Field(() => Boolean, { defaultValue: false, description: 'Was this Link manually created' })
	@Property({ default: false })
	manual: boolean = false;

	/**
	 * Relationships
	 */

	@Field(() => Beacon, { nullable: true })
	@ManyToOne(() => Beacon, { nullable: true })
	origin?: Beacon;

	@Field(() => Beacon, { nullable: true })
	@ManyToOne(() => Beacon, { nullable: true })
	destination?: Beacon;

	// Nullable because we can't assure we'll find all the matching commands
	// Should probably be @OneToOne but there seems to still be a parsing bug that is very rarely finding the wrong command
	@Field(() => Command, { nullable: true })
	@ManyToOne({ nullable: true, entity: () => Command })
	command?: Command;
}

import type { Rel } from '@mikro-orm/core';
import { Property, PrimaryKey, Entity, ManyToOne, Unique } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { randomUUID } from 'crypto';
import { Host } from './Host';
import { Shapes } from './shared';

@ObjectType()
@Entity()
@Unique({ properties: ['os', 'ip', 'host'] })
export class HostMeta {
	constructor({ os, ip, host }: NativeInsertArgs) {
		this.host = host;
		if (os) this.os = os;
		if (ip) this.ip = ip;
	}

	// Should be converted to a hash of the computer name, os, and os version
	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String, { nullable: true })
	@Property({ nullable: true })
	os?: string;

	// removed because it wasn't adding value due to inaccuracy in parsing
	// @Field({ nullable: true })
	// @Property({ nullable: true })
	// osVersion?: string;

	@Field(() => String, { nullable: true })
	@Property({ nullable: true })
	ip?: string;

	@Field(() => String, { nullable: true })
	@Property({ nullable: true })
	type?: string;

	@Field(() => Shapes, { nullable: true })
	@Property({ type: 'string' })
	shape: Shapes = Shapes.circle;

	@Field(() => String, { nullable: true, description: 'The color of the node' })
	@Property({ type: 'string', nullable: true })
	color?: string;

	/**
	 * Relationships
	 */

	// TODO: Add more mutable properties like Host type

	@ManyToOne(() => Host, { onDelete: 'cascade' })
	host: Rel<Host>;
}

type NativeInsertArgs = Omit<HostMeta, 'id'>;

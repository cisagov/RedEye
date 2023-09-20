import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Hosts {
	@PrimaryKey({ nullable: true })
	id?: string;

	@Property({ nullable: true })
	hostUuid?: string;

	@Property({ nullable: true })
	createdAt?: Date;

	@Property({ nullable: true })
	hostname?: string;

	@Property({ nullable: true })
	osVersion?: string;

	@Property({ nullable: true })
	locale?: string;
}

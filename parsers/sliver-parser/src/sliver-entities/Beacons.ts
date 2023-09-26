import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Beacons {
	@Property({ nullable: true })
	createdAt?: Date;

	@PrimaryKey({ nullable: true })
	id?: string;

	@Property({ nullable: true })
	name?: string;

	@Property({ nullable: true })
	hostname?: string;

	@Property({ nullable: true })
	uuid?: string;

	@Property({ nullable: true })
	username?: string;

	@Property({ nullable: true })
	uid?: string;

	@Property({ nullable: true })
	gId?: string;

	@Property({ nullable: true })
	os?: string;

	@Property({ nullable: true })
	arch?: string;

	@Property({ nullable: true })
	transport?: string;

	@Property({ nullable: true })
	remoteAddress?: string;

	@Property({ nullable: true })
	pId?: number;

	@Property({ nullable: true })
	filename?: string;

	@Property({ nullable: true })
	lastCheckin?: Date;

	@Property({ nullable: true })
	version?: string;

	@Property({ nullable: true })
	reconnectInterval?: number;

	@Property({ nullable: true })
	activeC2?: string;

	@Property({ nullable: true })
	proxyUrl?: string;

	@Property({ nullable: true })
	locale?: string;

	@Property({ nullable: true })
	implantBuildId?: string;

	@Property({ nullable: true })
	interval?: number;

	@Property({ nullable: true })
	jitter?: number;

	@Property({ nullable: true })
	nextCheckin?: number;
}

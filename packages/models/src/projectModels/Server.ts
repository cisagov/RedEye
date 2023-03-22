import {
	Cascade,
	Collection,
	Entity,
	OneToMany,
	OneToOne,
	OnInit,
	PrimaryKey,
	Property,
	Unique,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { Beacon } from './Beacon';
import { ServerMeta } from './ServerMeta';

@ObjectType()
@Unique({ properties: ['parsingPath'] })
@Entity()
export class Server {
	constructor({
		name,
		displayName,
		parsingPath,
	}: Pick<Server, 'name' | 'parsingPath'> & Partial<Pick<Server, 'id' | 'displayName'>>) {
		this.name = name;
		this.displayName = displayName ?? undefined; // name; // ??
		this.parsingPath = parsingPath;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String)
	@Property()
	name: string;

	@Property()
	parsingPath: string;

	@Field(() => String, { nullable: true })
	@Property({ nullable: true })
	displayName?: string;

	@Field(() => Boolean, { nullable: true })
	@Property({ nullable: true })
	hidden?: boolean = false;

	/**
	 * Getters
	 */
	@Field(() => Number)
	get logsCount() {
		let count = 0;
		const beacons = this.beacons.getItems();
		beacons.forEach((beacon) => {
			count += beacon.logsCount ?? 0;
		});

		return count;
	}

	/**
	 * Relationships
	 */

	@Field(() => [Beacon])
	@OneToMany(() => Beacon, (beacon) => beacon.server, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	beacons = new Collection<Beacon>(this);

	@Field(() => ServerMeta)
	@OneToOne(() => ServerMeta, (meta) => meta.server, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	meta: ServerMeta = new ServerMeta(this);

	@OnInit()
	init() {
		try {
			if (!this.beacons?.isInitialized()) this.beacons?.init({ populate: false });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Error initiating server links and logs');
		}
	}
}

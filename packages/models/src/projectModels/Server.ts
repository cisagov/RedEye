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
import { initThen } from '../util';

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
		this.displayName = displayName ?? name;
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

	@Field(() => String)
	@Property()
	displayName: string;

	@Field(() => Boolean, { nullable: true })
	@Property({ nullable: true })
	hidden?: boolean = false;

	/**
	 * Getters
	 */
	@Field(() => Number)
	get logsCount() {
		return this.beacons.getItems().reduce((acc, beacon) => acc + beacon.logsCount ?? 0, 0);
	}

	@Field(() => Number)
	get commandsCount() {
		return this.beacons.getItems().reduce((acc, beacon) => acc + beacon.commandsCount ?? 0, 0);
	}

	@Field(() => Number)
	get beaconCount() {
		return this.beacons.count() ?? 0;
	}

	@Field(() => Number)
	get commentCount() {
		return initThen(this.beacons, async () => {
			let count = 0;
			for (const beacon of this.beacons?.getItems()) {
				count += (await beacon.commentsCount) ?? 0;
			}
			return count;
		});
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

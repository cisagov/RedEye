import { Property, PrimaryKey, Entity, OneToMany, Collection, OnInit, Cascade } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Beacon } from './Beacon';
import { HostMeta } from './HostMeta';
import { randomUUID } from 'crypto';
import { initThen } from '../util';

type RequiredInsertArgs = Pick<Host, 'hostName'>;
type OptionalArgs = Partial<Omit<Host, 'hostName' | 'beacons' | 'meta' | 'init' | 'beaconIds'>>;

@ObjectType()
@Entity()
export class Host {
	constructor({ hostName, id, ...optionals }: RequiredInsertArgs & OptionalArgs) {
		this.id = id ?? randomUUID();
		this.hostName = hostName;
		this.displayName = hostName;
		Object.assign(this, optionals);
	}

	// Should be converted to a hash of the computer name, os, and os version
	@Field(() => String)
	@PrimaryKey()
	id: string;

	@Field(() => Boolean, { nullable: true })
	@Property({ nullable: true })
	cobaltStrikeServer?: boolean = false;

	@Field(() => String)
	@Property()
	hostName: string;

	@Field(() => String, { nullable: true })
	@Property({ nullable: true })
	displayName?: string;

	@Field(() => Boolean, { nullable: true })
	@Property({ nullable: true })
	hidden?: boolean = false;

	/**
	 * Getters
	 */
	@Field(() => [String])
	@Property({ nullable: true, persist: false })
	get beaconIds() {
		try {
			return this.beacons?.getIdentifiers();
		} catch (e) {
			return [];
		}
	}

	@Field(() => Number)
	get commandsCount() {
		return this.beacons.getItems().reduce((acc, beacon) => acc + beacon.commandsCount ?? 0, 0);
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
	@OneToMany(() => Beacon, (beacon) => beacon.host, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	beacons = new Collection<Beacon>(this);

	// Right now this is a OneToMany because the meta line can have variations. The idea is that we'll eventually be able to deconflict them
	@Field(() => [HostMeta])
	@OneToMany(() => HostMeta, (meta) => meta.host, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	meta = new Collection<HostMeta>(this);

	@OnInit()
	init() {
		try {
			if (!this.beacons?.isInitialized()) this.beacons?.init({ populate: false });
		} catch {
			// eslint-disable-next-line no-console
			console.log('Error initiating computer beacons');
		}
	}
}

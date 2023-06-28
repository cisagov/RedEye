import { PrimaryKey, Entity, Collection, ManyToMany, OneToMany, Property, OnInit } from '@mikro-orm/core';
import { Beacon } from './Beacon';
import { Command } from './Command';
import { Field, ObjectType } from 'type-graphql';
import { randomUUID } from 'crypto';
import { initThen } from '../util';

@ObjectType()
@Entity()
export class Operator {
	constructor(obj: Pick<Operator, 'id'>) {
		if (!this.id) this.id = randomUUID();
		Object.assign(this, obj);
	}

	@Field(() => String)
	@PrimaryKey()
	id!: string;

	/**
	 * Getters
	 */
	@Field(() => String)
	get name() {
		return this.id;
	}

	@Field(() => [String])
	get beaconIds() {
		try {
			return this.beacons?.getIdentifiers();
		} catch (e) {
			return [];
		}
	}

	@Field(() => [String])
	get logIds() {
		try {
			return this.commands?.getIdentifiers();
		} catch (e) {
			return [];
		}
	}

	@ManyToMany(() => Beacon, (beacon) => beacon.operators)
	beacons = new Collection<Beacon>(this);

	@OneToMany(() => Command, (command) => command.operator)
	commands = new Collection<Command>(this);

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	startTime?: Date;

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	endTime?: Date;

	@Field(() => Number)
	get commentsCount() {
		return initThen(this.commands, async () => {
			let count = 0;
			for (const command of this.commands.getItems()) {
				for (const commandGroup of command.commandGroups.getItems()) {
					if (!commandGroup.annotations.isInitialized()) await commandGroup.annotations.init({ populate: false });
					count += commandGroup.annotations.count() ?? 0;
				}
			}
			return count;
		});
	}

	@OnInit()
	init() {
		try {
			if (!this.beacons?.isInitialized()) this.beacons?.init({ populate: false });
			if (!this.commands?.isInitialized()) this.commands?.init({ populate: false });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Error initiating operator beacons and log entries');
		}
	}
}

import type { Rel } from '@mikro-orm/core';
import {
	Property,
	PrimaryKey,
	Entity,
	ManyToOne,
	OneToMany,
	Collection,
	ManyToMany,
	OnInit,
	Cascade,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { Host } from './Host';
import { LogEntry } from './LogEntry';
import { Command } from './Command';
import { MitreTechniques } from './MitreTechniques';
import { Server } from './Server';
import { Operator } from './Operator';
import { Image } from './Image';
import { File } from './File';
import { BeaconMeta } from './BeaconMeta';
import { initThen } from '../util';

type RequiredInsertArgs = Pick<Beacon, 'beaconName'>;
type OptionalInsertArgs = Partial<Pick<Beacon, 'id' | 'server' | 'host'>>;

@ObjectType()
@Entity()
export class Beacon {
	constructor({ host, id, server, beaconName }: RequiredInsertArgs & OptionalInsertArgs) {
		this.id = id ?? randomUUID();
		this.beaconName = beaconName;
		if (server) this.server = server;
		if (host) this.host = host;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string;

	@Field(() => String, {
		description:
			'The name Cobalt Strike gives the beacon or the Cobalt Strike server name. Not _necessarily_ unique across a campaign but is unique to a server',
	})
	@Property()
	beaconName: string;

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
	get commandsCount() {
		return this.commands?.count();
	}

	@Field(() => Number)
	get commentsCount() {
		return initThen(this.commands, async () => {
			let count = 0;
			for (const command of this.commands.getItems()) {
				count += (await command.commentsCount) ?? 0;
			}
			return count;
		});
	}

	@Field(() => Number)
	get logsCount() {
		return this.logs?.count();
	}

	@Field(() => String)
	get serverId() {
		return this.server?.id;
	}

	/**
	 * Relationships
	 */
	@Field(() => Host, { nullable: true })
	@ManyToOne(() => Host, { nullable: true, onDelete: 'cascade' })
	host?: Rel<Host>;

	@ManyToOne(() => Server, { nullable: true, onDelete: 'cascade' })
	server?: Rel<Server>;

	@OneToMany(() => LogEntry, (logEntry) => logEntry.beacon, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	logs = new Collection<LogEntry>(this);

	@ManyToMany(() => Operator)
	operators = new Collection<Operator>(this);
	// only used for parsing

	@OneToMany(() => Command, (command) => command.beacon, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	commands = new Collection<Command>(this);

	@OneToMany(() => Image, (image) => image.beacon, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	images = new Collection<Image>(this);

	// Relationships
	@OneToMany(() => File, (file) => file.beacon, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	files = new Collection<File>(this);

	@Field(() => [MitreTechniques], { nullable: 'itemsAndList' })
	get mitreTechniques() {
		return (async () => {
			return Array.from(
				new Set(
					(await Promise.all(this.commands.getItems().flatMap(async (command) => await command.mitreTechniques))).flat()
				)
			);
		})();
	}

	@Field(() => [BeaconMeta])
	@OneToMany(() => BeaconMeta, (meta) => meta.beacon, { cascade: [Cascade.REMOVE], orphanRemoval: true })
	meta = new Collection<BeaconMeta>(this);

	@OnInit()
	init() {
		try {
			if (!this.commands?.isInitialized()) this.commands?.init({ populate: false });
			if (!this.logs?.isInitialized()) this.logs?.init({ populate: false });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e, 'Error beacon commands and logs');
		}
	}
}

import {
	Cascade,
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { Beacon } from './Beacon';
import { CommandGroup } from './CommandGroup';
import { Link } from './Link';
import { LogEntry } from './LogEntry';
import { MitreTechniques } from './MitreTechniques';
import { Operator } from './Operator';
import { initThen } from '../util';

type RequiredInsertArgs = Pick<Command, 'input' | 'inputText' | 'beacon'>;
type ModifiedInsertArgs = { output: LogEntry[] };
type Optionals = Partial<Pick<Command, 'id' | 'parsingRule' | 'operator' | 'attackIds' | 'commandFailed'>>;

@ObjectType()
@Entity()
export class Command {
	constructor({
		id,
		input,
		inputText,
		beacon,
		output,
		attackIds,
		commandFailed = false,
		...optionals
	}: RequiredInsertArgs & ModifiedInsertArgs & Optionals) {
		const persistedAttackIds = attackIds && attackIds.length > 0 ? attackIds : undefined;
		this.id = id ?? randomUUID();
		this.attackIds = persistedAttackIds;
		this.input = input;
		this.inputText = inputText;
		this.beacon = beacon;
		this.commandFailed = commandFailed;
		this.output.set(output);
		Object.assign(this, optionals);
	}

	@Field(() => String)
	@PrimaryKey()
	id: string;

	@Field(() => Boolean)
	@Property()
	commandFailed: boolean;

	@Property({ nullable: true })
	parsingRule?: string;

	// TODO: create lookup table
	@Field(() => [String], { nullable: true })
	@Property({ nullable: true })
	attackIds?: string[];

	@Field(() => Number)
	get commentsCount() {
		return initThen(this.commandGroups, async () => {
			let count = 0;
			for (const commandGroup of this.commandGroups?.getItems()) {
				if (!commandGroup.annotations.isInitialized()) await commandGroup.annotations.init({ populate: false });
				count += commandGroup.annotations.count() ?? 0;
			}
			return count;
		});
	}

	/**
	 * Relationships
	 */

	@Field(() => LogEntry)
	@OneToOne({ entity: () => LogEntry, cascade: [Cascade.REMOVE], onDelete: 'cascade' })
	input: LogEntry;

	@Field(() => String)
	@Property()
	inputText: string;

	@Field(() => Beacon)
	@ManyToOne(() => Beacon, { onDelete: 'cascade', cascade: [Cascade.REMOVE] })
	beacon: Beacon;

	@Field(() => [LogEntry])
	@OneToMany(() => LogEntry, (log) => log.command, { cascade: [Cascade.REMOVE] })
	output = new Collection<LogEntry>(this);

	@Field(() => [CommandGroup])
	@ManyToMany(() => CommandGroup, (commandGroup) => commandGroup.commands, {
		cascade: [Cascade.PERSIST, Cascade.MERGE, Cascade.REMOVE],
	})
	commandGroups = new Collection<CommandGroup>(this);

	@Field(() => Operator, { nullable: true })
	@ManyToOne(() => Operator, { nullable: true, onDelete: 'cascade' })
	operator?: Operator;

	@OneToMany(() => Link, (link) => link.command)
	links = new Collection<Link>(this);

	@Field(() => [MitreTechniques], { nullable: 'itemsAndList' })
	get mitreTechniques() {
		return (async () => {
			const tags = new Set();
			const techniques = Object.values(MitreTechniques);
			if (!this.commandGroups.isInitialized()) await this.commandGroups.init({ populate: false });
			for (const commandGroup of this.commandGroups.getItems()) {
				if (!commandGroup.annotations.isInitialized()) await commandGroup.annotations.init({ populate: false });
				for (const annotation of commandGroup.annotations.getItems()) {
					if (!annotation.tags.isInitialized()) await annotation.tags.init({ populate: false });
					for (const tag of annotation.tags.getItems()) {
						if (techniques.includes(tag.text as MitreTechniques)) tags.add(tag.text);
					}
				}
			}
			return Array.from(tags);
		})();
	}
}

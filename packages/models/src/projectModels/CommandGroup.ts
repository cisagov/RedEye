import { Cascade, Collection, Entity, ManyToMany, OneToMany, OnInit, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import { Annotation } from './Annotation';
import { Command } from './Command';
import { GenerationType } from './shared';

@ObjectType()
@Entity()
export class CommandGroup {
	constructor({ id, generation }: Partial<Pick<CommandGroup, 'id' | 'generation'>> & { commands?: Command }) {
		this.id = id ?? randomUUID();
		this.generation = generation ?? GenerationType.MANUAL;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string;

	@Field((_type) => GenerationType)
	@Property({ type: 'string' })
	generation: GenerationType;

	// Relationships
	@Field(() => [Command])
	@ManyToMany(() => Command, (command) => command.commandGroups, {
		owner: true,
		fixedOrder: false,
		cascade: [Cascade.PERSIST, Cascade.MERGE],
	})
	commands = new Collection<Command>(this);

	@Field(() => [Annotation])
	@OneToMany(() => Annotation, (annotation) => annotation.commandGroup, { cascade: [Cascade.ALL] })
	annotations = new Collection<Annotation>(this);

	@Field(() => [String])
	get commandIds() {
		return this.commands?.getIdentifiers();
	}

	@OnInit()
	init() {
		try {
			if (!this.commands?.isInitialized()) this.commands?.init({ populate: false });
			if (!this.annotations?.isInitialized()) this.annotations?.init({ populate: false });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Error initiating command group commands and annotations');
		}
	}
}

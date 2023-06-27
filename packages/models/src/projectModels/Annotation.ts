import { Cascade, Collection, Entity, ManyToMany, ManyToOne, OnInit, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType } from 'type-graphql';
import type { EntityManager } from '../types';
import { CommandGroup } from './CommandGroup';
import { GenerationType } from './shared';
import { Tag } from './Tag';

@ObjectType()
@Entity()
export class Annotation {
	constructor({
		text,
		user,
		favorite = false,
		generation = GenerationType.MANUAL,
	}: Pick<Annotation, 'text' | 'user'> & Partial<Pick<Annotation, 'favorite' | 'generation'>>) {
		this.text = text;
		this.user = user;
		this.favorite = favorite;
		this.generation = generation;
		this.date = new Date();
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	// If someone wants to tag something without text, this is the easiest way to tie those things together
	@Field(() => String)
	@Property({ nullable: true })
	text?: string;

	@Field((_type) => GenerationType)
	@Property({ type: 'string' })
	generation: GenerationType;

	// If someone wants to tag something without text, this is the easiest way to tie those things together
	@Field(() => Date)
	@Property()
	date: Date;

	@Field(() => String)
	@Property()
	user: string;

	@Field(() => Boolean)
	@Property()
	favorite: boolean = false;

	/**
	 * Relationships
	 */
	@Field(() => [Tag], { nullable: true })
	@ManyToMany(() => Tag, (tag) => tag.annotations, { owner: true, fixedOrder: false })
	tags = new Collection<Tag>(this);

	@ManyToOne(() => CommandGroup, { nullable: true, cascade: [Cascade.MERGE, Cascade.PERSIST], onDelete: 'cascade' })
	commandGroup?: CommandGroup;

	@Field(() => String, { nullable: true })
	get commandGroupId() {
		return this.commandGroup?.id;
	}

	@Field(() => [String], { nullable: 'itemsAndList' })
	get commandIds() {
		try {
			return this.commandGroup?.commands?.getIdentifiers();
		} catch (e) {
			return [];
		}
	}

	@Field(() => String, { nullable: true })
	get beaconIdFromFirstCommand() {
		try {
			return this.commandGroup?.commands[0].beacon.id;
		} catch (e) {
			return '';
		}
	}

	@OnInit()
	init() {
		try {
			if (!this.commandGroup?.commands?.isInitialized()) this.commandGroup?.commands?.init({ populate: false });
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log('Error initiating annotation command group commands');
		}
	}

	static createAnnotation = async (
		em: EntityManager,
		text: string,
		user: string,
		{ commandGroup, favorite, tags, generation }: OptionalAnnotationArgs = {}
	) => {
		const annotation = new Annotation({ text, user, favorite, generation });
		const updatedTags = await Tag.createTags(em, tags ?? []);
		annotation.tags.set(updatedTags);
		if (commandGroup) annotation.commandGroup = commandGroup;
		em.persist(annotation);
		return annotation;
	};
}

type OptionalAnnotationArgs = Partial<Pick<Annotation, 'commandGroup' | 'favorite' | 'generation'>> & {
	tags?: string[];
};

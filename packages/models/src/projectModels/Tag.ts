import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Annotation } from './Annotation';
import type { EntityManager } from '../types';

@ObjectType()
@Entity()
export class Tag {
	constructor(text: string) {
		this.id = text;
		this.text = text;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string;

	@Field(() => String)
	@Property()
	text: string;

	/**
	 * Relationships
	 */
	@ManyToMany(() => Annotation, (annotation) => annotation.tags)
	annotations = new Collection<Annotation>(this);

	static matchTags = (s: string): string[] => {
		const matchesIterator = s.matchAll(/\s*(#[A-z\d-]+)/gm);
		// Array of unique strings with an intermediate set
		const matches = Array.from(new Set(Array.from(matchesIterator, (i) => i[1])));
		return matches;
	};

	static createTags = async (em: EntityManager, tags: string[], nativeInsert: boolean = false) => {
		if (tags.length > 0) {
			const matchedTags = await em.find(Tag, { id: { $in: tags } }, { populate: false });
			return await Promise.all(
				tags.map(async (tagString) => {
					const foundTag = matchedTags.find((tag) => tag.id === tagString);
					if (foundTag) return foundTag;
					const newTag = new Tag(tagString);
					if (!nativeInsert) em.persist(newTag);
					else await em.nativeInsert(newTag);
					return newTag;
				})
			);
		}
		return [];
	};
}

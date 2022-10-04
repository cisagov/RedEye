import { PrimaryKey, Entity, OneToMany, Collection } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Campaign } from './Campaign';

@ObjectType()
@Entity()
export class GlobalOperator {
	constructor({ id }: Pick<GlobalOperator, 'id'>) {
		this.id = id;
	}

	@Field(() => String)
	@PrimaryKey()
	id: string;

	/**
	 * Getters
	 */
	@Field(() => String)
	get name() {
		return this.id;
	}

	@OneToMany(() => Campaign, (campaign) => campaign.lastOpenedBy)
	campaignsLastOpened = new Collection<Campaign>(this);

	@OneToMany(() => Campaign, (campaign) => campaign.creator)
	campaignsCreated = new Collection<Campaign>(this);
}

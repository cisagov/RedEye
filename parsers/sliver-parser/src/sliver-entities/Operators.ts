import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Operators {
	@PrimaryKey({ nullable: true })
	id?: string;

	@Property({ nullable: true })
	createdAt?: Date;

	@Property({ nullable: true })
	name?: string;

	@Unique({ name: 'idx_operators_token' })
	@Property({ nullable: true })
	token?: string;
}

import type { Rel } from '@mikro-orm/core';
import { Property, PrimaryKey, Entity, ManyToOne, BlobType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Beacon } from './Beacon';
import { randomUUID } from 'crypto';

type RequiredInsertArgs = Pick<Image, 'blob' | 'beacon'>;
type OptionalInsertArgs = Omit<Image, 'id' | 'blob' | 'beacon'>;

@ObjectType()
@Entity()
export class Image {
	constructor({ blob, ...optionals }: RequiredInsertArgs & OptionalInsertArgs) {
		this.blob = blob;
		if (optionals.beacon) this.beacon = optionals.beacon;
		if (optionals.url) this.url = optionals.url;
		this.fileType = optionals.fileType ? optionals.fileType : 'jpg';
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String, { defaultValue: 'jpg' })
	@Property()
	fileType: string = 'jpg';

	@Field(() => String, { nullable: true })
	url?: string;

	@Property({ type: BlobType })
	blob: Buffer;

	@ManyToOne(() => Beacon, { nullable: true, onDelete: 'cascade' })
	beacon?: Rel<Beacon>;
}

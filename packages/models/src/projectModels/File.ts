import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Beacon } from './Beacon';
import { randomUUID } from 'crypto';

export enum FileFlag {
	UPLOAD = 'UPLOAD',
	DOWNLOAD = 'DOWNLOAD',
}

registerEnumType(FileFlag, {
	name: 'FileFlag',
	description: `Designates if this is an upload or download
    UPLOAD: File was put on or replace on a target host
    DOWNLOAD: File was taken from a target host
  `,
});

type RequiredInsertArgs = Pick<File, 'fileName' | 'location' | 'dateTime' | 'fileFlag'>;
type OptionalInsertArgs = Omit<File, 'id' | 'fileName' | 'location' | 'date' | 'fileFlag'>;

@ObjectType()
@Entity()
export class File {
	constructor({ fileName, location, dateTime, fileFlag, ...optionals }: RequiredInsertArgs & OptionalInsertArgs) {
		this.fileName = fileName;
		this.location = location;
		this.dateTime = dateTime;
		this.fileFlag = fileFlag;
		Object.assign(this, optionals);
	}

	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => String)
	@Property()
	fileName: string;

	@Field(() => String)
	@Property()
	location: string;

	@Field(() => Date)
	@Property()
	dateTime: Date;

	@Field(() => String, {
		nullable: true,
		description:
			'Generated automatically when using the upload command, the MD5 message-digest algorithm is a widely used hash function producing a 128-bit hash value.',
	})
	@Property({ nullable: true })
	md5?: string;

	@Field((_type) => FileFlag)
	@Property({ type: 'string' })
	fileFlag: FileFlag;

	// Future work
	//   @Field(() => Boolean)
	//   @Property()
	//   deleted: boolean = false;

	// Relationships
	/**
	 * Really shouldn't be nullable but required to make TS happy
	 */
	@ManyToOne(() => Beacon, { nullable: true })
	beacon?: Beacon;
}

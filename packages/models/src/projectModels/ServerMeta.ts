import type { Rel } from '@mikro-orm/core';
import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Server } from './Server';
import { NodeColors, Shapes } from './shared';

export enum ServerType {
	http = 'http',
	https = 'https',
	smb = 'smb',
	dns = 'dns',
}

registerEnumType(ServerType, {
	name: 'ServerType',
	description: `The communication type used by the server`,
});

@ObjectType()
@Entity()
export class ServerMeta {
	constructor(server: Server) {
		this.server = server;
	}

	// Should be converted to a hash of the computer name, os, and os version
	@Field(() => String)
	@PrimaryKey()
	id: string = randomUUID();

	@Field(() => ServerType)
	@Enum(() => ServerType)
	type: ServerType = ServerType.http;

	@Field(() => Shapes, { nullable: true })
	@Property({ type: 'string' })
	shape: Shapes = Shapes.hexagonUp;

	@Field(() => NodeColors, { nullable: true, description: 'The color of the node' })
	@Property({ type: 'string', nullable: true })
	color?: NodeColors;

	/**
	 * Relationships
	 */
	// Right now this is a ManyToOne because the meta line can have variations. The idea is that we'll eventually be able to deconflict them
	@OneToOne(() => Server)
	server: Rel<Server>;
}

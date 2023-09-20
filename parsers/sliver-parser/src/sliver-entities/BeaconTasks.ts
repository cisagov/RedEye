import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Beacons } from './Beacons';

@Entity()
export class BeaconTasks {
	@PrimaryKey({ nullable: true })
	id?: string;

	@Unique({ name: 'idx_beacon_tasks_envelope_id' })
	@Property({ nullable: true })
	envelopeId?: number;

	@ManyToOne({ entity: () => Beacons, nullable: true })
	beacon?: Beacons;

	@Property({ nullable: true })
	createdAt?: Date;

	@Property({ nullable: true })
	state?: string;

	@Property({ nullable: true })
	sentAt?: Date;

	@Property({ nullable: true })
	completedAt?: Date;

	@Property({ nullable: true })
	description?: string;

	@Property({ nullable: true })
	request?: Buffer;

	@Property({ nullable: true })
	response?: Buffer;
}

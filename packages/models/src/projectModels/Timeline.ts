import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TimelineCommandCountTuple {
	@Field(() => String)
	beaconId!: string;

	@Field(() => Number, { description: 'The number of commands run during this time interval' })
	commandCount!: number;
}

@ObjectType()
export class TimelineBucket {
	// link lists, not to be confused with linked-lists 😉

	@Field(() => [String], {
		description:
			'Links that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead)',
	})
	createdLinks!: string[];

	@Field(() => [String], {
		description: 'Links that were active during the entire time interval. (mutually exclusive to all other link lists)',
	})
	activeLinks!: string[];

	@Field(() => [String], {
		description:
			'Links that died or exited during this time interval (Not mutually exclusive with created links list but is mutually exclusive with active and dead)',
	})
	dyingLinks!: string[];

	@Field(() => [String], {
		description:
			'links that used to exist by this point in time but no longer exist (mutually exclusive to all other link lists)',
	})
	deadLinks!: string[];

	// Beacon lists

	// Beacon lists

	@Field(() => [String], {
		description:
			'Beacons that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead)',
	})
	createdBeacons!: string[];

	@Field(() => [String], {
		description:
			'Beacons that were active during the entire time interval (mutually exclusive with all other beacon lists)',
	})
	activeBeacons!: string[];

	@Field(() => [String], {
		description:
			'Beacons that died or exited during this time interval (mutually exclusive with dead and active beacons but not with created)',
	})
	dyingBeacons!: string[];

	@Field(() => [String], {
		description:
			'Beacons that used to exist by this point in time but have either failed or exited (mutually exclusive with all other beacon lists)',
	})
	deadBeacons!: string[];

	// metadata

	// metadata

	@Field(() => Date)
	bucketStartTime!: Date;

	@Field(() => Date)
	bucketEndTime!: Date;

	@Field(() => [TimelineCommandCountTuple])
	beaconCommandCountPair!: TimelineCommandCountTuple[];
}

@ObjectType()
export class Timeline {
	@Field(() => Date)
	bucketStartTime!: Date;

	@Field(() => Date)
	bucketEndTime!: Date;

	@Field(() => Date)
	campaignStartTime!: Date;

	@Field(() => Date)
	campaignEndTime!: Date;

	@Field(() => Number, { description: 'The number of minutes a bucket spans' })
	bucketMinutes!: number;

	@Field(() => [TimelineBucket])
	buckets!: TimelineBucket[];
}

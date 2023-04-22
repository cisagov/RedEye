import { QueryOrder } from '@mikro-orm/core';
import { Resolver, Query, Authorized, Arg, GraphQLISODateTime, Ctx } from 'type-graphql';
import { Command, Beacon, LogEntry, Timeline, Link, TimelineBucket } from '@redeye/models';
import { beaconHidden } from './utils/hidden-entities-helper';
import { connectToProjectEmOrFail } from './utils/project-db';
import type { GraphQLContext } from '../types';
import { identifyBucketSize } from './timeline-resolvers.utils';

@Resolver(Timeline)
export class TimelineResolvers {
	@Authorized()
	@Query(() => Timeline, { description: 'Get a bucketed summary of active beacons and links with commands' })
	async timeline(
		@Ctx() ctx: GraphQLContext,
		@Arg('campaignId', () => String) campaignId: string,
		@Arg('suggestedBuckets', () => Number, { defaultValue: 100, nullable: true }) suggestedBuckets: number,
		@Arg('suggestedStartTime', () => GraphQLISODateTime, { defaultValue: new Date(1), nullable: true })
		suggestedStartTime: Date,
		@Arg('suggestedEndTime', () => GraphQLISODateTime, {
			defaultValue: new Date(8640000000000000 - 600000),
			nullable: true,
		})
		suggestedEndTime: Date,
		@Arg('hidden', () => Boolean, { defaultValue: false, nullable: true }) hidden: boolean = false
	): Promise<Timeline> {
		// The reference to defaults is always the same. Thus we shouldn't mutate them
		suggestedStartTime = new Date(suggestedStartTime);
		suggestedEndTime = new Date(suggestedEndTime);

		const em = await connectToProjectEmOrFail(campaignId, ctx);

		const beaconsPromise = em.find(Beacon, !hidden ? { hidden, host: { hidden } } : {}, { populate: ['meta'] });
		const logsPromise = em.find(LogEntry, beaconHidden(hidden), { orderBy: { dateTime: QueryOrder.ASC } });
		const commandsPromise = em.find(Command, beaconHidden(hidden), { populate: ['beacon', 'input'] });
		const linksPromise = em.find(
			Link,
			!hidden
				? {
						$and: [{ origin: { hidden } }, { destination: { hidden } }],
				  }
				: {}
		);

		const searchResults = await Promise.all([beaconsPromise, logsPromise, commandsPromise, linksPromise]);

		const [beacons, logs, commands, links]: [Beacon[], LogEntry[], Command[], Link[]] = searchResults;
		const firstLogWithDate = logs?.find((log) => !!log?.dateTime);
		const lastLogWithDate = logs?.reverse().find((log) => !!log?.dateTime);
		const campaignStartTime: Date = new Date(firstLogWithDate?.dateTime ?? 8640000000000000);
		const campaignEndTime: Date = new Date(lastLogWithDate?.dateTime ?? -8640000000000000);

		// round the to upper and lower minutes
		campaignStartTime.setSeconds(0);
		campaignStartTime.setMilliseconds(0);
		campaignEndTime.setSeconds(60);
		campaignEndTime.setMilliseconds(0);

		suggestedStartTime.setSeconds(0);
		suggestedStartTime.setMilliseconds(0);
		suggestedEndTime.setSeconds(60);
		suggestedEndTime.setMilliseconds(0);

		const campaignStartsBeforeSuggestedTime = suggestedStartTime > campaignStartTime;
		const campaignEndsAfterSuggestedTime = suggestedEndTime < campaignEndTime;

		const usedStartTime = campaignStartsBeforeSuggestedTime ? suggestedStartTime : campaignStartTime;
		const usedEndTime = campaignEndsAfterSuggestedTime ? suggestedEndTime : campaignEndTime;

		const timelineLengthMs = usedEndTime.valueOf() - usedStartTime.valueOf();

		const timelineMinutes = timelineLengthMs / 60000;

		const { numberOfBuckets: preprocessedNumberOfBuckets, bucketMinutes } = identifyBucketSize(
			suggestedBuckets,
			timelineMinutes
		);

		// Last bucket with things going on
		const bucketEndTimePreExtraBuckets = new Date(usedStartTime);
		bucketEndTimePreExtraBuckets.setMinutes(usedStartTime.getMinutes() + preprocessedNumberOfBuckets * bucketMinutes);

		const extraBucketForUnfilteredStart = campaignStartsBeforeSuggestedTime ? 0 : 1;
		const extraBucketForUnfilteredEnd = campaignEndsAfterSuggestedTime ? 0 : 1;
		const finalNumberOfBuckets =
			preprocessedNumberOfBuckets + extraBucketForUnfilteredStart + extraBucketForUnfilteredEnd;

		const bucketStartTime = new Date(usedStartTime);
		bucketStartTime.setMinutes(bucketStartTime.getMinutes() - extraBucketForUnfilteredStart * bucketMinutes);

		const bucketEndTime = new Date(usedEndTime);
		bucketEndTime.setMinutes(bucketEndTime.getMinutes() + 1);

		const unixBucketsStartTime = bucketStartTime.getTime();
		// get the number of time intervals between the beginning and end dates. Create an array of that length. Start populating stuffs
		const buckets: TimelineBucket[] = new Array(finalNumberOfBuckets).fill(1).map((_, i): TimelineBucket => {
			let bucketEnd = new Date(unixBucketsStartTime + (i + 1) * bucketMinutes * 60000);
			let bucketStart = new Date(unixBucketsStartTime + i * bucketMinutes * 60000);

			// If this is the final event bucket, ensure end time does not exceed overall bucketEndTime
			if (i === finalNumberOfBuckets - 2 && bucketEndTime.valueOf() < bucketEnd.valueOf()) {
				bucketEnd = new Date(bucketEndTime.getTime() - 60000);
			}

			// If this is the last bucket, ensure end matches overall bucketEndTime
			if (i === finalNumberOfBuckets - 1) {
				bucketStart = new Date(bucketEndTime.getTime() - 60000);
				bucketEnd = bucketEndTime;
			}

			return {
				createdLinks: [],
				activeLinks: [],
				dyingLinks: [],
				deadLinks: [],
				createdBeacons: [],
				activeBeacons: [],
				dyingBeacons: [],
				deadBeacons: [],
				beaconCommandCountPair: [],
				bucketStartTime: bucketStart,
				bucketEndTime: bucketEnd,
			};
		});

		commands.forEach((command) => {
			const commandTime = command.input.dateTime;
			const beaconId = command.beacon.id;
			if (commandTime) {
				const diffMinutes = (commandTime.getTime() - unixBucketsStartTime) / 60000;
				const bucketIndex = Math.floor(diffMinutes / bucketMinutes);
				if (bucketIndex >= 0 && bucketIndex < finalNumberOfBuckets) {
					const foundTuple = buckets[bucketIndex].beaconCommandCountPair.find(
						(command) => command.beaconId === beaconId
					);
					if (foundTuple) foundTuple.commandCount++;
					else {
						buckets[bucketIndex].beaconCommandCountPair.push({ beaconId, commandCount: 1 });
					}
				}
			}
		});

		beacons.forEach((beacon) => {
			if (beacon.meta.length > 0) {
				const { host } = beacon;
				const { startTime, endTime } = beacon.meta[0];
				// There _should_ always be a start time with the exception of the cobalt strike servers

				if (host?.cobaltStrikeServer) {
					for (let i = 0; i < finalNumberOfBuckets; i++) {
						buckets[i].activeBeacons.push(beacon.id);
					}
				} else if (startTime) {
					const beaconStartUnixTime = startTime.getTime();
					const beaconStartBucketIndex = Math.floor(
						(beaconStartUnixTime - unixBucketsStartTime) / 60000 / bucketMinutes
					);
					const beaconEndUnixTime = endTime?.getTime() ?? campaignEndTime.getTime();
					const beaconEndBucketIndex = Math.floor((beaconEndUnixTime - unixBucketsStartTime) / 60000 / bucketMinutes);

					const beaconStartBucketIndexNegativeNumberCorrection =
						beaconStartBucketIndex < 0 ? 0 : beaconStartBucketIndex;

					buckets[beaconStartBucketIndexNegativeNumberCorrection]?.createdBeacons?.push(beacon.id);
					for (let i = beaconStartBucketIndexNegativeNumberCorrection; i < finalNumberOfBuckets; i++) {
						if (i < beaconEndBucketIndex) buckets[i].activeBeacons.push(beacon.id);
						else if (i === beaconEndBucketIndex) buckets[i].dyingBeacons.push(beacon.id);
						else buckets[i].deadBeacons.push(beacon.id);
					}
				}
			}
		});

		links.forEach((link) => {
			const { startTime, endTime } = link;
			if (startTime) {
				const linkStartUnixTime = startTime.getTime();
				const linkStartBucketIndex = Math.floor((linkStartUnixTime - unixBucketsStartTime) / 60000 / bucketMinutes);
				const linkEndUnixTime = endTime?.getTime() ?? campaignEndTime.getTime();
				const linkEndBucketIndex = Math.floor((linkEndUnixTime - unixBucketsStartTime) / 60000 / bucketMinutes);

				const linkStartBucketIndexNegativeNumberCorrection = linkStartBucketIndex < 0 ? 0 : linkStartBucketIndex;
				buckets[linkStartBucketIndexNegativeNumberCorrection]?.createdLinks?.push(link.id);
				for (let i = linkStartBucketIndexNegativeNumberCorrection; i < finalNumberOfBuckets; i++) {
					if (i < linkEndBucketIndex) buckets[i].activeLinks.push(link.id);
					else if (i === linkEndBucketIndex) buckets[i].dyingLinks.push(link.id);
					else buckets[i].deadLinks.push(link.id);
				}
			}
		});

		return {
			bucketStartTime,
			bucketEndTime,
			campaignStartTime,
			campaignEndTime,
			bucketMinutes,
			buckets: buckets,
		};
	}
}

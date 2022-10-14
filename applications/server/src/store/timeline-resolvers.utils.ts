const validBucketMinuteIncrements = [2, 4, 6, 10, 12, 15, 20, 30, 60];
const validBucketHourIncrements = [1, 2, 4, 6, 8, 12, 24];

export const identifyBucketSize = (
	maxBuckets: number,
	campaignMinutes: number
): {
	numberOfBuckets: number;
	bucketMinutes: number;
} => {
	const campaignHours = Math.ceil(campaignMinutes / 60);
	// campaign minutes is less than max buckets
	if (campaignMinutes <= maxBuckets) {
		return { numberOfBuckets: Math.ceil(campaignMinutes), bucketMinutes: 1 };
	} else if (campaignHours <= maxBuckets) {
		// campaign hours is less than the number of buckets
		const minimumBucketMinutes = Math.ceil(campaignMinutes / maxBuckets);
		const bucketMinutes = validBucketMinuteIncrements.find((increment) => increment >= minimumBucketMinutes) ?? 60;
		return { numberOfBuckets: Math.ceil(campaignMinutes / bucketMinutes), bucketMinutes };
	} else {
		// Bucket will have to be larger than an hour
		const minimumBucketHours = Math.ceil(campaignHours / maxBuckets);
		const bucketHours =
			validBucketHourIncrements.find((increment) => increment >= minimumBucketHours) ??
			Math.ceil(minimumBucketHours / 24) * 24;
		const bucketMinutes = bucketHours * 60;
		return { numberOfBuckets: Math.ceil(campaignMinutes / bucketMinutes), bucketMinutes };
	}
};

export const identifyFirstBucketTime = (campaignStartTime: Date, bucketMinutes: number): Date => {
	const bucketStartTime = new Date(campaignStartTime);
	bucketStartTime.setMilliseconds(0);
	bucketStartTime.setSeconds(0);

	if (bucketMinutes >= 60 * 24) {
		bucketStartTime.setMinutes(0);
		bucketStartTime.setHours(0);
	} else if (bucketMinutes >= 60) {
		const bucketHours = bucketMinutes / 60;
		const campaignStartHour = campaignStartTime.getHours();
		const bucketStartHour = campaignStartHour - (campaignStartHour % bucketHours);
		bucketStartTime.setMinutes(0);
		bucketStartTime.setHours(bucketStartHour);
	} else {
		const campaignStartMinute = campaignStartTime.getMinutes();
		const bucketStartMinute = campaignStartMinute - (campaignStartMinute % bucketMinutes);
		bucketStartTime.setMinutes(bucketStartMinute);
	}
	return bucketStartTime;
};

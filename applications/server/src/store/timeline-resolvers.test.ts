import { identifyBucketSize, identifyFirstBucketTime } from './timeline-resolvers.utils';

describe('Timeline bucket sizes', () => {
	// minute tests
	test('Single minute buckets', () => {
		expect(identifyBucketSize(100, 60)).toEqual({ numberOfBuckets: 60, bucketMinutes: 1 });
	});
	test('Non-round single minute buckets', () => {
		expect(identifyBucketSize(100, 60.5)).toEqual({ numberOfBuckets: 61, bucketMinutes: 1 });
	});
	test('Edge case: minutes equal to number of buckets', () => {
		expect(identifyBucketSize(100, 100)).toEqual({ numberOfBuckets: 100, bucketMinutes: 1 });
	});
	test('Edge case: minutes 1 larger than number of buckets', () => {
		expect(identifyBucketSize(100, 101)).toEqual({ numberOfBuckets: 51, bucketMinutes: 2 });
	});
	test('Edge case: multiple ', () => {
		expect(identifyBucketSize(100, 1000)).toEqual({ numberOfBuckets: 100, bucketMinutes: 10 });
	});

	// hours tests
	test('basic hour test', () => {
		expect(identifyBucketSize(10, 610)).toEqual({ numberOfBuckets: 6, bucketMinutes: 120 });
	});

	test('Weird time interval', () => {
		expect(identifyBucketSize(100, 72710)).toEqual({ numberOfBuckets: 51, bucketMinutes: 1440 });
	});
});

describe('Identify bucket start time', () => {
	test('Hour increment', () => {
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1), 60)).toEqual(new Date(2020, 1, 3, 1));
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1, 1), 60)).toEqual(new Date(2020, 1, 3, 1));
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1, 44), 60)).toEqual(new Date(2020, 1, 3, 1));
	});

	test('15 minute increment', () => {
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1), 15)).toEqual(new Date(2020, 1, 3, 1));
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1, 1), 15)).toEqual(new Date(2020, 1, 3, 1));
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1, 44), 15)).toEqual(new Date(2020, 1, 3, 1, 30));
		expect(identifyFirstBucketTime(new Date(2020, 1, 3, 1, 47), 15)).toEqual(new Date(2020, 1, 3, 1, 45));
	});
});

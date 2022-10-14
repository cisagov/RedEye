/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';
import type { TimelineBucketModel } from './TimelineBucketModel';
import { TimelineBucketModelSelector } from './TimelineBucketModel';

/**
 * TimelineBase
 * auto generated base class for the model TimelineModel.
 */
export class TimelineModelBase extends Model({
	__typename: tProp('Timeline'),
	bucketEndTime: prop<any>().withSetter(),
	/** The number of minutes a bucket spans */
	bucketMinutes: prop<number>().withSetter(),
	bucketStartTime: prop<any>().withSetter(),
	buckets: prop<TimelineBucketModel[]>(() => []).withSetter(),
	campaignEndTime: prop<any>().withSetter(),
	campaignStartTime: prop<any>().withSetter(),
}) {}

export class TimelineModelSelector extends QueryBuilder {
	get bucketEndTime() {
		return this.__attr(`bucketEndTime`);
	}
	get bucketMinutes() {
		return this.__attr(`bucketMinutes`);
	}
	get bucketStartTime() {
		return this.__attr(`bucketStartTime`);
	}
	get campaignEndTime() {
		return this.__attr(`campaignEndTime`);
	}
	get campaignStartTime() {
		return this.__attr(`campaignStartTime`);
	}
	buckets(
		builder?:
			| string
			| TimelineBucketModelSelector
			| ((selector: TimelineBucketModelSelector) => TimelineBucketModelSelector)
	) {
		return this.__child(`buckets`, TimelineBucketModelSelector, builder);
	}
}
export function selectFromTimeline() {
	return new TimelineModelSelector();
}

export const timelineModelPrimitives =
	selectFromTimeline().bucketEndTime.bucketMinutes.bucketStartTime.campaignEndTime.campaignStartTime;

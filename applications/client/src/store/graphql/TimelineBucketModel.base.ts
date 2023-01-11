/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';
import type { TimelineCommandCountTupleModel } from './TimelineCommandCountTupleModel';
import { TimelineCommandCountTupleModelSelector } from './TimelineCommandCountTupleModel';

/**
 * TimelineBucketBase
 * auto generated base class for the model TimelineBucketModel.
 */
export class TimelineBucketModelBase extends Model({
	__typename: tProp('TimelineBucket'),
	/** Beacons that were active during the entire time interval (mutually exclusive with all other beacon lists) */
	activeBeacons: prop<string[]>().withSetter(),
	/** Links that were active during the entire time interval. (mutually exclusive to all other link lists) */
	activeLinks: prop<string[]>().withSetter(),
	beaconCommandCountPair: prop<TimelineCommandCountTupleModel[]>(() => []).withSetter(),
	bucketEndTime: prop<any>().withSetter(),
	bucketStartTime: prop<any>().withSetter(),
	/** Beacons that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead) */
	createdBeacons: prop<string[]>().withSetter(),
	/** Links that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead) */
	createdLinks: prop<string[]>().withSetter(),
	/** Beacons that used to exist by this point in time but have either failed or exited (mutually exclusive with all other beacon lists) */
	deadBeacons: prop<string[]>().withSetter(),
	/** links that used to exist by this point in time but no longer exist (mutually exclusive to all other link lists) */
	deadLinks: prop<string[]>().withSetter(),
	/** Beacons that died or exited during this time interval (mutually exclusive with dead and active beacons but not with created) */
	dyingBeacons: prop<string[]>().withSetter(),
	/** Links that died or exited during this time interval (Not mutually exclusive with created links list but is mutually exclusive with active and dead) */
	dyingLinks: prop<string[]>().withSetter(),
}) {}

export class TimelineBucketModelSelector extends QueryBuilder {
	get activeBeacons() {
		return this.__attr(`activeBeacons`);
	}
	get activeLinks() {
		return this.__attr(`activeLinks`);
	}
	get bucketEndTime() {
		return this.__attr(`bucketEndTime`);
	}
	get bucketStartTime() {
		return this.__attr(`bucketStartTime`);
	}
	get createdBeacons() {
		return this.__attr(`createdBeacons`);
	}
	get createdLinks() {
		return this.__attr(`createdLinks`);
	}
	get deadBeacons() {
		return this.__attr(`deadBeacons`);
	}
	get deadLinks() {
		return this.__attr(`deadLinks`);
	}
	get dyingBeacons() {
		return this.__attr(`dyingBeacons`);
	}
	get dyingLinks() {
		return this.__attr(`dyingLinks`);
	}
	beaconCommandCountPair(
		builder?:
			| string
			| TimelineCommandCountTupleModelSelector
			| ((selector: TimelineCommandCountTupleModelSelector) => TimelineCommandCountTupleModelSelector)
	) {
		return this.__child(`beaconCommandCountPair`, TimelineCommandCountTupleModelSelector, builder);
	}
}
export function selectFromTimelineBucket() {
	return new TimelineBucketModelSelector();
}

export const timelineBucketModelPrimitives =
	selectFromTimelineBucket().activeBeacons.activeLinks.bucketEndTime.bucketStartTime.createdBeacons.createdLinks
		.deadBeacons.deadLinks.dyingBeacons.dyingLinks;

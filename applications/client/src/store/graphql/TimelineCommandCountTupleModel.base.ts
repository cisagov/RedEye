/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * TimelineCommandCountTupleBase
 * auto generated base class for the model TimelineCommandCountTupleModel.
 */
export class TimelineCommandCountTupleModelBase extends Model({
	__typename: tProp('TimelineCommandCountTuple'),
	beaconId: prop<string>().withSetter(),
	/** The number of commands run during this time interval */
	commandCount: prop<number>().withSetter(),
}) {}

export class TimelineCommandCountTupleModelSelector extends QueryBuilder {
	get beaconId() {
		return this.__attr(`beaconId`);
	}
	get commandCount() {
		return this.__attr(`commandCount`);
	}
}
export function selectFromTimelineCommandCountTuple() {
	return new TimelineCommandCountTupleModelSelector();
}

export const timelineCommandCountTupleModelPrimitives = selectFromTimelineCommandCountTuple().beaconId.commandCount;

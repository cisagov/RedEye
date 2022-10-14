/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * OperatorBase
 * auto generated base class for the model OperatorModel.
 */
export class OperatorModelBase extends Model({
	__typename: tProp('Operator'),
	beaconIds: prop<string[]>().withSetter(),
	endTime: prop<any | null>().withSetter(),
	id: prop<string>().withSetter(),
	logIds: prop<string[]>().withSetter(),
	name: prop<string>().withSetter(),
	startTime: prop<any | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class OperatorModelSelector extends QueryBuilder {
	get beaconIds() {
		return this.__attr(`beaconIds`);
	}
	get endTime() {
		return this.__attr(`endTime`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get logIds() {
		return this.__attr(`logIds`);
	}
	get name() {
		return this.__attr(`name`);
	}
	get startTime() {
		return this.__attr(`startTime`);
	}
}
export function selectFromOperator() {
	return new OperatorModelSelector();
}

export const operatorModelPrimitives = selectFromOperator().beaconIds.endTime.logIds.name.startTime;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * CommandTypeCountBase
 * auto generated base class for the model CommandTypeCountModel.
 */
export class CommandTypeCountModelBase extends Model({
	__typename: tProp('CommandTypeCount'),
	beaconsCount: prop<number>().withSetter(),
	commentsCount: prop<number>().withSetter(),
	count: prop<number>().withSetter(),
	id: prop<string>().withSetter(),
	text: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class CommandTypeCountModelSelector extends QueryBuilder {
	get beaconsCount() {
		return this.__attr(`beaconsCount`);
	}
	get commentsCount() {
		return this.__attr(`commentsCount`);
	}
	get count() {
		return this.__attr(`count`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get text() {
		return this.__attr(`text`);
	}
}
export function selectFromCommandTypeCount() {
	return new CommandTypeCountModelSelector();
}

export const commandTypeCountModelPrimitives = selectFromCommandTypeCount().beaconsCount.commentsCount.count.text;

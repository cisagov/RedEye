/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * CommandTypeCountBase
 * auto generated base class for the model CommandTypeCountModel.
 */
export class CommandTypeCountModelBase extends Model({
	__typename: tProp('CommandTypeCount'),
	count: prop<number>().withSetter(),
	id: prop<string>().withSetter(),
	text: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class CommandTypeCountModelSelector extends QueryBuilder {
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

export const commandTypeCountModelPrimitives = selectFromCommandTypeCount().count.text;

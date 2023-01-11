/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * GlobalOperatorBase
 * auto generated base class for the model GlobalOperatorModel.
 */
export class GlobalOperatorModelBase extends Model({
	__typename: tProp('GlobalOperator'),
	id: prop<string>().withSetter(),
	name: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class GlobalOperatorModelSelector extends QueryBuilder {
	get id() {
		return this.__attr(`id`);
	}
	get name() {
		return this.__attr(`name`);
	}
}
export function selectFromGlobalOperator() {
	return new GlobalOperatorModelSelector();
}

export const globalOperatorModelPrimitives = selectFromGlobalOperator().name;

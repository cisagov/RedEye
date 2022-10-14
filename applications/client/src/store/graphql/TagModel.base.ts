/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * TagBase
 * auto generated base class for the model TagModel.
 */
export class TagModelBase extends Model({
	__typename: tProp('Tag'),
	id: prop<string>().withSetter(),
	text: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class TagModelSelector extends QueryBuilder {
	get id() {
		return this.__attr(`id`);
	}
	get text() {
		return this.__attr(`text`);
	}
}
export function selectFromTag() {
	return new TagModelSelector();
}

export const tagModelPrimitives = selectFromTag().text;

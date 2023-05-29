/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * FileDisplayBase
 * auto generated base class for the model FileDisplayModel.
 */
export class FileDisplayModelBase extends Model({
	__typename: tProp('FileDisplay'),
	description: prop<string>().withSetter(),
	editable: prop<boolean>().withSetter(),
}) {}

export class FileDisplayModelSelector extends QueryBuilder {
	get description() {
		return this.__attr(`description`);
	}
	get editable() {
		return this.__attr(`editable`);
	}
}
export function selectFromFileDisplay() {
	return new FileDisplayModelSelector();
}

export const fileDisplayModelPrimitives = selectFromFileDisplay().description.editable;

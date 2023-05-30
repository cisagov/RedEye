/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { UploadType } from './UploadTypeEnum';
import type { ValidationMode } from './ValidationModeEnum';

/**
 * FileUploadBase
 * auto generated base class for the model FileUploadModel.
 */
export class FileUploadModelBase extends Model({
	__typename: tProp('FileUpload'),
	acceptedExtensions: prop<string[] | null>().withSetter(),
	description: prop<string>().withSetter(),
	example: prop<string | null>().withSetter(),
	type: prop<UploadType>().withSetter(),
	validate: prop<ValidationMode>().withSetter(),
}) {}

export class FileUploadModelSelector extends QueryBuilder {
	get acceptedExtensions() {
		return this.__attr(`acceptedExtensions`);
	}
	get description() {
		return this.__attr(`description`);
	}
	get example() {
		return this.__attr(`example`);
	}
	get type() {
		return this.__attr(`type`);
	}
	get validate() {
		return this.__attr(`validate`);
	}
}
export function selectFromFileUpload() {
	return new FileUploadModelSelector();
}

export const fileUploadModelPrimitives = selectFromFileUpload().acceptedExtensions.description.example.type.validate;

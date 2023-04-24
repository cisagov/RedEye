/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * ImageBase
 * auto generated base class for the model ImageModel.
 */
export class ImageModelBase extends Model({
	__typename: tProp('Image'),
	fileType: prop<string>().withSetter(),
	id: prop<string>().withSetter(),
	url: prop<string | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class ImageModelSelector extends QueryBuilder {
	get fileType() {
		return this.__attr(`fileType`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get url() {
		return this.__attr(`url`);
	}
}
export function selectFromImage() {
	return new ImageModelSelector();
}

export const imageModelPrimitives = selectFromImage().fileType.url;

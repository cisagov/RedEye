/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { ServerDelineationTypes } from './ServerDelineationTypesEnum';
import type { UploadFormModel } from './UploadFormModel';

import { UploadFormModelSelector, uploadFormModelPrimitives } from './UploadFormModel';

/**
 * ParserInfoBase
 * auto generated base class for the model ParserInfoModel.
 */
export class ParserInfoModelBase extends Model({
	__typename: tProp('ParserInfo'),
	id: prop<string>().withSetter(),
	name: prop<string>().withSetter(),
	serverDelineation: prop<ServerDelineationTypes>().withSetter(),
	uploadForm: prop<UploadFormModel>().withSetter(),
	version: prop<number>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class ParserInfoModelSelector extends QueryBuilder {
	get id() {
		return this.__attr(`id`);
	}
	get name() {
		return this.__attr(`name`);
	}
	get serverDelineation() {
		return this.__attr(`serverDelineation`);
	}
	get version() {
		return this.__attr(`version`);
	}
	uploadForm(
		builder?: string | UploadFormModelSelector | ((selector: UploadFormModelSelector) => UploadFormModelSelector)
	) {
		return this.__child(`uploadForm`, UploadFormModelSelector, builder);
	}
}
export function selectFromParserInfo() {
	return new ParserInfoModelSelector();
}

export const parserInfoModelPrimitives = selectFromParserInfo().name.serverDelineation.version;

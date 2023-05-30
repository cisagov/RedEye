/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { FileDisplayModel } from './FileDisplayModel';
import type { FileUploadModel } from './FileUploadModel';
import type { ServerDelineationTypes } from './ServerDelineationTypesEnum';

import { FileDisplayModelSelector, fileDisplayModelPrimitives } from './FileDisplayModel';
import { FileUploadModelSelector, fileUploadModelPrimitives } from './FileUploadModel';

/**
 * UploadFormBase
 * auto generated base class for the model UploadFormModel.
 */
export class UploadFormModelBase extends Model({
	__typename: tProp('UploadForm'),
	enabledInBlueTeam: prop<boolean>().withSetter(),
	fileDisplay: prop<FileDisplayModel>().withSetter(),
	fileUpload: prop<FileUploadModel>().withSetter(),
	serverDelineation: prop<ServerDelineationTypes>().withSetter(),
	tabTitle: prop<string>().withSetter(),
}) {}

export class UploadFormModelSelector extends QueryBuilder {
	get enabledInBlueTeam() {
		return this.__attr(`enabledInBlueTeam`);
	}
	get serverDelineation() {
		return this.__attr(`serverDelineation`);
	}
	get tabTitle() {
		return this.__attr(`tabTitle`);
	}
	fileDisplay(
		builder?: string | FileDisplayModelSelector | ((selector: FileDisplayModelSelector) => FileDisplayModelSelector)
	) {
		return this.__child(`fileDisplay`, FileDisplayModelSelector, builder);
	}
	fileUpload(
		builder?: string | FileUploadModelSelector | ((selector: FileUploadModelSelector) => FileUploadModelSelector)
	) {
		return this.__child(`fileUpload`, FileUploadModelSelector, builder);
	}
}
export function selectFromUploadForm() {
	return new UploadFormModelSelector();
}

export const uploadFormModelPrimitives = selectFromUploadForm().enabledInBlueTeam.serverDelineation.tabTitle;

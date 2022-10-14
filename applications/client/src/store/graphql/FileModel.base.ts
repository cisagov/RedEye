/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';
import type { FileFlag } from './FileFlagEnum';

/**
 * FileBase
 * auto generated base class for the model FileModel.
 */
export class FileModelBase extends Model({
	__typename: tProp('File'),
	dateTime: prop<any>().withSetter(),
	fileFlag: prop<FileFlag>().withSetter(),
	fileName: prop<string>().withSetter(),
	id: prop<string>().withSetter(),
	ip: prop<string | null>().withSetter(),
	location: prop<string>().withSetter(),
	/** Generated automatically when using the upload command, the MD5 message-digest algorithm is a widely used hash function producing a 128-bit hash value. */
	md5: prop<string | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class FileModelSelector extends QueryBuilder {
	get dateTime() {
		return this.__attr(`dateTime`);
	}
	get fileFlag() {
		return this.__attr(`fileFlag`);
	}
	get fileName() {
		return this.__attr(`fileName`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get ip() {
		return this.__attr(`ip`);
	}
	get location() {
		return this.__attr(`location`);
	}
	get md5() {
		return this.__attr(`md5`);
	}
}
export function selectFromFile() {
	return new FileModelSelector();
}

export const fileModelPrimitives = selectFromFile().dateTime.fileFlag.fileName.ip.location.md5;

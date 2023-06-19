/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * HostMetaBase
 * auto generated base class for the model HostMetaModel.
 */
export class HostMetaModelBase extends Model({
	__typename: tProp('HostMeta'),
	id: prop<string>().withSetter(),
	ip: prop<string | null>().withSetter(),
	os: prop<string | null>().withSetter(),
	osVersion: prop<string | null>().withSetter(),
	type: prop<string | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class HostMetaModelSelector extends QueryBuilder {
	get id() {
		return this.__attr(`id`);
	}
	get ip() {
		return this.__attr(`ip`);
	}
	get os() {
		return this.__attr(`os`);
	}
	get osVersion() {
		return this.__attr(`osVersion`);
	}
	get type() {
		return this.__attr(`type`);
	}
}
export function selectFromHostMeta() {
	return new HostMetaModelSelector();
}

export const hostMetaModelPrimitives = selectFromHostMeta().ip.os.osVersion.type;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { ServerType } from './ServerTypeEnum';

/**
 * ServerMetaBase
 * auto generated base class for the model ServerMetaModel.
 */
export class ServerMetaModelBase extends Model({
	__typename: tProp('ServerMeta'),
	id: prop<string>().withSetter(),
	type: prop<ServerType>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class ServerMetaModelSelector extends QueryBuilder {
	get id() {
		return this.__attr(`id`);
	}
	get type() {
		return this.__attr(`type`);
	}
}
export function selectFromServerMeta() {
	return new ServerMetaModelSelector();
}

export const serverMetaModelPrimitives = selectFromServerMeta().type;

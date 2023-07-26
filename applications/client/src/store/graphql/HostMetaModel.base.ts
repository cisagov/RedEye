/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { Shapes } from './ShapesEnum';

/**
 * HostMetaBase
 * auto generated base class for the model HostMetaModel.
 */
export class HostMetaModelBase extends Model({
	__typename: tProp('HostMeta'),
	/** The color of the node */
	color: prop<string | null>().withSetter(),
	id: prop<string>().withSetter(),
	ip: prop<string | null>().withSetter(),
	os: prop<string | null>().withSetter(),
	shape: prop<Shapes | null>().withSetter(),
	type: prop<string | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class HostMetaModelSelector extends QueryBuilder {
	get color() {
		return this.__attr(`color`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get ip() {
		return this.__attr(`ip`);
	}
	get os() {
		return this.__attr(`os`);
	}
	get shape() {
		return this.__attr(`shape`);
	}
	get type() {
		return this.__attr(`type`);
	}
}
export function selectFromHostMeta() {
	return new HostMetaModelSelector();
}

export const hostMetaModelPrimitives = selectFromHostMeta().color.ip.os.shape.type;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { NodeColors } from './NodeColorsEnum';
import type { ServerType } from './ServerTypeEnum';
import type { Shapes } from './ShapesEnum';

/**
 * ServerMetaBase
 * auto generated base class for the model ServerMetaModel.
 */
export class ServerMetaModelBase extends Model({
	__typename: tProp('ServerMeta'),
	/** The color of the node */
	color: prop<NodeColors | null>().withSetter(),
	id: prop<string>().withSetter(),
	shape: prop<Shapes | null>().withSetter(),
	type: prop<ServerType>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class ServerMetaModelSelector extends QueryBuilder {
	get color() {
		return this.__attr(`color`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get shape() {
		return this.__attr(`shape`);
	}
	get type() {
		return this.__attr(`type`);
	}
}
export function selectFromServerMeta() {
	return new ServerMetaModelSelector();
}

export const serverMetaModelPrimitives = selectFromServerMeta().color.shape.type;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * CantHideEntitiesBase
 * auto generated base class for the model CantHideEntitiesModel.
 */
export class CantHideEntitiesModelBase extends Model({
	__typename: tProp('CantHideEntities'),
	beacons: prop<string[] | null>().withSetter(),
	hosts: prop<string[] | null>().withSetter(),
	servers: prop<string[] | null>().withSetter(),
}) {}

export class CantHideEntitiesModelSelector extends QueryBuilder {
	get beacons() {
		return this.__attr(`beacons`);
	}
	get hosts() {
		return this.__attr(`hosts`);
	}
	get servers() {
		return this.__attr(`servers`);
	}
}
export function selectFromCantHideEntities() {
	return new CantHideEntitiesModelSelector();
}

export const cantHideEntitiesModelPrimitives = selectFromCantHideEntities().beacons.hosts.servers;

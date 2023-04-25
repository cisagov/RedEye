/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * NonHidableEntitiesBase
 * auto generated base class for the model NonHidableEntitiesModel.
 */
export class NonHidableEntitiesModelBase extends Model({
	__typename: tProp('NonHidableEntities'),
	beacons: prop<string[] | null>().withSetter(),
	hosts: prop<string[] | null>().withSetter(),
	servers: prop<string[] | null>().withSetter(),
}) {}

export class NonHidableEntitiesModelSelector extends QueryBuilder {
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
export function selectFromNonHidableEntities() {
	return new NonHidableEntitiesModelSelector();
}

export const nonHidableEntitiesModelPrimitives = selectFromNonHidableEntities().beacons.hosts.servers;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import type { IObservableArray } from 'mobx';
import { Model, prop, Ref, tProp } from 'mobx-keystone';
import type { HostMetaModel } from './HostMetaModel';
import { HostMetaModelSelector } from './HostMetaModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	meta: IObservableArray<HostMetaModel>;
};

/**
 * HostBase
 * auto generated base class for the model HostModel.
 */
export class HostModelBase extends Model({
	__typename: tProp('Host'),
	beaconIds: prop<string[]>().withSetter(),
	cobaltStrikeServer: prop<boolean | null>().withSetter(),
	displayName: prop<string | null>().withSetter(),
	hidden: prop<boolean | null>().withSetter(),
	hostName: prop<string>().withSetter(),
	id: prop<string>().withSetter(),
	meta: prop<Ref<HostMetaModel>[]>(() => []).withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class HostModelSelector extends QueryBuilder {
	get beaconIds() {
		return this.__attr(`beaconIds`);
	}
	get cobaltStrikeServer() {
		return this.__attr(`cobaltStrikeServer`);
	}
	get displayName() {
		return this.__attr(`displayName`);
	}
	get hidden() {
		return this.__attr(`hidden`);
	}
	get hostName() {
		return this.__attr(`hostName`);
	}
	get id() {
		return this.__attr(`id`);
	}
	meta(builder?: string | HostMetaModelSelector | ((selector: HostMetaModelSelector) => HostMetaModelSelector)) {
		return this.__child(`meta`, HostMetaModelSelector, builder);
	}
}
export function selectFromHost() {
	return new HostModelSelector();
}

export const hostModelPrimitives = selectFromHost().beaconIds.cobaltStrikeServer.displayName.hidden.hostName;

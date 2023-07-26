/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import type { IObservableArray } from 'mobx';
import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconModel } from './BeaconModel';
import type { ServerMetaModel } from './ServerMetaModel';

import { BeaconModelSelector, beaconModelPrimitives } from './BeaconModel';
import { ServerMetaModelSelector, serverMetaModelPrimitives } from './ServerMetaModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	beacons: IObservableArray<BeaconModel>;
	meta: ServerMetaModel;
};

/**
 * ServerBase
 * auto generated base class for the model ServerModel.
 */
export class ServerModelBase extends Model({
	__typename: tProp('Server'),
	beaconCount: prop<number>().withSetter(),
	beacons: prop<Ref<BeaconModel>[]>(() => []).withSetter(),
	commandsCount: prop<number>().withSetter(),
	commentCount: prop<number>().withSetter(),
	displayName: prop<string | null>().withSetter(),
	hidden: prop<boolean | null>().withSetter(),
	id: prop<string>().withSetter(),
	logsCount: prop<number>().withSetter(),
	meta: prop<Ref<ServerMetaModel>>().withSetter(),
	name: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class ServerModelSelector extends QueryBuilder {
	get beaconCount() {
		return this.__attr(`beaconCount`);
	}
	get commandsCount() {
		return this.__attr(`commandsCount`);
	}
	get commentCount() {
		return this.__attr(`commentCount`);
	}
	get displayName() {
		return this.__attr(`displayName`);
	}
	get hidden() {
		return this.__attr(`hidden`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get logsCount() {
		return this.__attr(`logsCount`);
	}
	get name() {
		return this.__attr(`name`);
	}
	beacons(builder?: string | BeaconModelSelector | ((selector: BeaconModelSelector) => BeaconModelSelector)) {
		return this.__child(`beacons`, BeaconModelSelector, builder);
	}
	meta(builder?: string | ServerMetaModelSelector | ((selector: ServerMetaModelSelector) => ServerMetaModelSelector)) {
		return this.__child(`meta`, ServerMetaModelSelector, builder);
	}
}
export function selectFromServer() {
	return new ServerModelSelector();
}

export const serverModelPrimitives =
	selectFromServer().beaconCount.commandsCount.commentCount.displayName.hidden.logsCount.name;

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import type { IObservableArray } from 'mobx';
import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconMetaModel } from './BeaconMetaModel';
import type { HostModel } from './HostModel';
import type { MitreTechniques } from './MitreTechniquesEnum';

import { BeaconMetaModelSelector, beaconMetaModelPrimitives } from './BeaconMetaModel';
import { HostModelSelector, hostModelPrimitives } from './HostModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	host: HostModel;
	meta: IObservableArray<BeaconMetaModel>;
};

/**
 * BeaconBase
 * auto generated base class for the model BeaconModel.
 */
export class BeaconModelBase extends Model({
	__typename: tProp('Beacon'),
	/** The name Cobalt Strike gives the beacon or the Cobalt Strike server name. Not _necessarily_ unique across a campaign but is unique to a server */
	beaconName: prop<string>().withSetter(),
	commandsCount: prop<number>().withSetter(),
	displayName: prop<string | null>().withSetter(),
	hidden: prop<boolean | null>().withSetter(),
	host: prop<Ref<HostModel> | null>().withSetter(),
	id: prop<string>().withSetter(),
	logsCount: prop<number>().withSetter(),
	meta: prop<Ref<BeaconMetaModel>[]>(() => []).withSetter(),
	mitreTechniques: prop<(MitreTechniques | null)[] | null>().withSetter(),
	serverId: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class BeaconModelSelector extends QueryBuilder {
	get beaconName() {
		return this.__attr(`beaconName`);
	}
	get commandsCount() {
		return this.__attr(`commandsCount`);
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
	get mitreTechniques() {
		return this.__attr(`mitreTechniques`);
	}
	get serverId() {
		return this.__attr(`serverId`);
	}
	host(builder?: string | HostModelSelector | ((selector: HostModelSelector) => HostModelSelector)) {
		return this.__child(`host`, HostModelSelector, builder);
	}
	meta(builder?: string | BeaconMetaModelSelector | ((selector: BeaconMetaModelSelector) => BeaconMetaModelSelector)) {
		return this.__child(`meta`, BeaconMetaModelSelector, builder);
	}
}
export function selectFromBeacon() {
	return new BeaconModelSelector();
}

export const beaconModelPrimitives =
	selectFromBeacon().beaconName.commandsCount.displayName.hidden.logsCount.mitreTechniques.serverId;

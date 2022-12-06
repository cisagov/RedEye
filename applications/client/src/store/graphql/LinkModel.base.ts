/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconModel } from './BeaconModel';
import type { CommandModel } from './CommandModel';

import { BeaconModelSelector, beaconModelPrimitives } from './BeaconModel';
import { CommandModelSelector, commandModelPrimitives } from './CommandModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	command: CommandModel;
	destination: BeaconModel;
	origin: BeaconModel;
};

/**
 * LinkBase
 * auto generated base class for the model LinkModel.
 */
export class LinkModelBase extends Model({
	__typename: tProp('Link'),
	command: prop<Ref<CommandModel> | null>().withSetter(),
	destination: prop<Ref<BeaconModel> | null>().withSetter(),
	endTime: prop<any | null>().withSetter(),
	id: prop<string>().withSetter(),
	origin: prop<Ref<BeaconModel> | null>().withSetter(),
	/** Shouldn't be nullable but it is to handle bad data sets */
	startTime: prop<any | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class LinkModelSelector extends QueryBuilder {
	get endTime() {
		return this.__attr(`endTime`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get startTime() {
		return this.__attr(`startTime`);
	}
	command(builder?: string | CommandModelSelector | ((selector: CommandModelSelector) => CommandModelSelector)) {
		return this.__child(`command`, CommandModelSelector, builder);
	}
	destination(builder?: string | BeaconModelSelector | ((selector: BeaconModelSelector) => BeaconModelSelector)) {
		return this.__child(`destination`, BeaconModelSelector, builder);
	}
	origin(builder?: string | BeaconModelSelector | ((selector: BeaconModelSelector) => BeaconModelSelector)) {
		return this.__child(`origin`, BeaconModelSelector, builder);
	}
}
export function selectFromLink() {
	return new LinkModelSelector();
}

export const linkModelPrimitives = selectFromLink().endTime.startTime;

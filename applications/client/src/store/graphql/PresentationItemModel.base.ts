/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import type { IObservableArray } from 'mobx';
import { Model, prop, Ref, tProp } from 'mobx-keystone';
import type { PresentationCommandGroupModel } from './PresentationCommandGroupModel';
import { PresentationCommandGroupModelSelector } from './PresentationCommandGroupModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	commandGroups: IObservableArray<PresentationCommandGroupModel>;
};

/**
 * PresentationItemBase
 * auto generated base class for the model PresentationItemModel.
 */
export class PresentationItemModelBase extends Model({
	__typename: tProp('PresentationItem'),
	/** Every beacon in the presentation. Including both presentation beacons and connection beacons. */
	beaconIds: prop<string[]>().withSetter(),
	commandGroups: prop<Ref<PresentationCommandGroupModel>[]>(() => []).withSetter(),
	/** Beacon Ids that are not in the command groups but are needed to link beacons to other beacons in the graph */
	connectionBeaconIds: prop<string[]>().withSetter(),
	count: prop<number>().withSetter(),
	id: prop<string>().withSetter(),
	key: prop<string>().withSetter(),
	linkIds: prop<string[]>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class PresentationItemModelSelector extends QueryBuilder {
	get beaconIds() {
		return this.__attr(`beaconIds`);
	}
	get connectionBeaconIds() {
		return this.__attr(`connectionBeaconIds`);
	}
	get count() {
		return this.__attr(`count`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get key() {
		return this.__attr(`key`);
	}
	get linkIds() {
		return this.__attr(`linkIds`);
	}
	commandGroups(
		builder?:
			| string
			| PresentationCommandGroupModelSelector
			| ((selector: PresentationCommandGroupModelSelector) => PresentationCommandGroupModelSelector)
	) {
		return this.__child(`commandGroups`, PresentationCommandGroupModelSelector, builder);
	}
}
export function selectFromPresentationItem() {
	return new PresentationItemModelSelector();
}

export const presentationItemModelPrimitives =
	selectFromPresentationItem().beaconIds.connectionBeaconIds.count.key.linkIds;

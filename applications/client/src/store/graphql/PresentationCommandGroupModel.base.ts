/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * PresentationCommandGroupBase
 * auto generated base class for the model PresentationCommandGroupModel.
 */
export class PresentationCommandGroupModelBase extends Model({
	__typename: tProp('PresentationCommandGroup'),
	beaconIds: prop<string[]>().withSetter(),
	commandIds: prop<string[]>().withSetter(),
	id: prop<string>().withSetter(),
	maxDate: prop<any | null>().withSetter(),
	minDate: prop<any | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class PresentationCommandGroupModelSelector extends QueryBuilder {
	get beaconIds() {
		return this.__attr(`beaconIds`);
	}
	get commandIds() {
		return this.__attr(`commandIds`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get maxDate() {
		return this.__attr(`maxDate`);
	}
	get minDate() {
		return this.__attr(`minDate`);
	}
}
export function selectFromPresentationCommandGroup() {
	return new PresentationCommandGroupModelSelector();
}

export const presentationCommandGroupModelPrimitives =
	selectFromPresentationCommandGroup().beaconIds.commandIds.maxDate.minDate;

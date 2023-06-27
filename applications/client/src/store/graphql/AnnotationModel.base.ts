/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import type { IObservableArray } from 'mobx';
import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { GenerationType } from './GenerationTypeEnum';
import type { TagModel } from './TagModel';

import { TagModelSelector, tagModelPrimitives } from './TagModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	tags: IObservableArray<TagModel>;
};

/**
 * AnnotationBase
 * auto generated base class for the model AnnotationModel.
 */
export class AnnotationModelBase extends Model({
	__typename: tProp('Annotation'),
	beaconIdFromFirstCommand: prop<string | null>().withSetter(),
	commandGroupId: prop<string | null>().withSetter(),
	commandIds: prop<(string | null)[] | null>().withSetter(),
	date: prop<any>().withSetter(),
	favorite: prop<boolean>().withSetter(),
	generation: prop<GenerationType>().withSetter(),
	id: prop<string>().withSetter(),
	tags: prop<Ref<TagModel>[] | null>(() => []).withSetter(),
	text: prop<string>().withSetter(),
	user: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class AnnotationModelSelector extends QueryBuilder {
	get beaconIdFromFirstCommand() {
		return this.__attr(`beaconIdFromFirstCommand`);
	}
	get commandGroupId() {
		return this.__attr(`commandGroupId`);
	}
	get commandIds() {
		return this.__attr(`commandIds`);
	}
	get date() {
		return this.__attr(`date`);
	}
	get favorite() {
		return this.__attr(`favorite`);
	}
	get generation() {
		return this.__attr(`generation`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get text() {
		return this.__attr(`text`);
	}
	get user() {
		return this.__attr(`user`);
	}
	tags(builder?: string | TagModelSelector | ((selector: TagModelSelector) => TagModelSelector)) {
		return this.__child(`tags`, TagModelSelector, builder);
	}
}
export function selectFromAnnotation() {
	return new AnnotationModelSelector();
}

export const annotationModelPrimitives =
	selectFromAnnotation().beaconIdFromFirstCommand.commandGroupId.commandIds.date.favorite.generation.text.user;

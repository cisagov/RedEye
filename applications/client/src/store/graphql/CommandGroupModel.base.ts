/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import type { IObservableArray } from 'mobx';
import { Model, prop, Ref, tProp } from 'mobx-keystone';
import type { AnnotationModel } from './AnnotationModel';
import { AnnotationModelSelector } from './AnnotationModel';
import type { GenerationType } from './GenerationTypeEnum';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	annotations: IObservableArray<AnnotationModel>;
};

/**
 * CommandGroupBase
 * auto generated base class for the model CommandGroupModel.
 */
export class CommandGroupModelBase extends Model({
	__typename: tProp('CommandGroup'),
	annotations: prop<Ref<AnnotationModel>[]>(() => []).withSetter(),
	commandIds: prop<string[]>().withSetter(),
	generation: prop<GenerationType>().withSetter(),
	id: prop<string>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class CommandGroupModelSelector extends QueryBuilder {
	get commandIds() {
		return this.__attr(`commandIds`);
	}
	get generation() {
		return this.__attr(`generation`);
	}
	get id() {
		return this.__attr(`id`);
	}
	annotations(
		builder?: string | AnnotationModelSelector | ((selector: AnnotationModelSelector) => AnnotationModelSelector)
	) {
		return this.__child(`annotations`, AnnotationModelSelector, builder);
	}
}
export function selectFromCommandGroup() {
	return new CommandGroupModelSelector();
}

export const commandGroupModelPrimitives = selectFromCommandGroup().commandIds.generation;

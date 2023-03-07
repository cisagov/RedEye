/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import type { IObservableArray } from 'mobx';
import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { AnnotationModel } from './AnnotationModel';
import type { CommandModel } from './CommandModel';
import type { GenerationType } from './GenerationTypeEnum';

import { AnnotationModelSelector, annotationModelPrimitives } from './AnnotationModel';
import { CommandModelSelector, commandModelPrimitives } from './CommandModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	annotations: IObservableArray<AnnotationModel>;
	commands: IObservableArray<CommandModel>;
};

/**
 * CommandGroupBase
 * auto generated base class for the model CommandGroupModel.
 */
export class CommandGroupModelBase extends Model({
	__typename: tProp('CommandGroup'),
	annotations: prop<Ref<AnnotationModel>[]>(() => []).withSetter(),
	commandIds: prop<string[]>().withSetter(),
	commands: prop<Ref<CommandModel>[]>(() => []).withSetter(),
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
	commands(builder?: string | CommandModelSelector | ((selector: CommandModelSelector) => CommandModelSelector)) {
		return this.__child(`commands`, CommandModelSelector, builder);
	}
}
export function selectFromCommandGroup() {
	return new CommandGroupModelSelector();
}

export const commandGroupModelPrimitives = selectFromCommandGroup().commandIds.generation;

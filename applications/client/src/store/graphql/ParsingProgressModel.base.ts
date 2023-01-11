/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';
import type { ServerParsingProgressModel } from './ServerParsingProgressModel';
import { ServerParsingProgressModelSelector } from './ServerParsingProgressModel';

/**
 * ParsingProgressBase
 * auto generated base class for the model ParsingProgressModel.
 */
export class ParsingProgressModelBase extends Model({
	__typename: tProp('ParsingProgress'),
	date: prop<any>().withSetter(),
	nextTaskDescription: prop<string>().withSetter(),
	progress: prop<ServerParsingProgressModel[]>(() => []).withSetter(),
}) {}

export class ParsingProgressModelSelector extends QueryBuilder {
	get date() {
		return this.__attr(`date`);
	}
	get nextTaskDescription() {
		return this.__attr(`nextTaskDescription`);
	}
	progress(
		builder?:
			| string
			| ServerParsingProgressModelSelector
			| ((selector: ServerParsingProgressModelSelector) => ServerParsingProgressModelSelector)
	) {
		return this.__child(`progress`, ServerParsingProgressModelSelector, builder);
	}
}
export function selectFromParsingProgress() {
	return new ParsingProgressModelSelector();
}

export const parsingProgressModelPrimitives = selectFromParsingProgress().date.nextTaskDescription;

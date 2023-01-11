/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, tProp } from 'mobx-keystone';

/**
 * ServerParsingProgressBase
 * auto generated base class for the model ServerParsingProgressModel.
 */
export class ServerParsingProgressModelBase extends Model({
	__typename: tProp('ServerParsingProgress'),
	campaignId: prop<string>().withSetter(),
	serverName: prop<string>().withSetter(),
	tasksCompleted: prop<number>().withSetter(),
	totalTasks: prop<number>().withSetter(),
}) {}

export class ServerParsingProgressModelSelector extends QueryBuilder {
	get campaignId() {
		return this.__attr(`campaignId`);
	}
	get serverName() {
		return this.__attr(`serverName`);
	}
	get tasksCompleted() {
		return this.__attr(`tasksCompleted`);
	}
	get totalTasks() {
		return this.__attr(`totalTasks`);
	}
}
export function selectFromServerParsingProgress() {
	return new ServerParsingProgressModelSelector();
}

export const serverParsingProgressModelPrimitives =
	selectFromServerParsingProgress().campaignId.serverName.tasksCompleted.totalTasks;

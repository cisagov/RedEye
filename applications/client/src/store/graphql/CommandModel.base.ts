/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import type { IObservableArray } from 'mobx';
import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconModel } from './BeaconModel';
import type { CommandGroupModel } from './CommandGroupModel';
import type { LogEntryModel } from './LogEntryModel';
import type { MitreTechniques } from './MitreTechniquesEnum';
import type { OperatorModel } from './OperatorModel';

import { BeaconModelSelector, beaconModelPrimitives } from './BeaconModel';
import { CommandGroupModelSelector, commandGroupModelPrimitives } from './CommandGroupModel';
import { LogEntryModelSelector, logEntryModelPrimitives } from './LogEntryModel';
import { OperatorModelSelector, operatorModelPrimitives } from './OperatorModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	beacon: BeaconModel;
	commandGroups: IObservableArray<CommandGroupModel>;
	input: LogEntryModel;
	operator: OperatorModel;
	output: IObservableArray<LogEntryModel>;
};

/**
 * CommandBase
 * auto generated base class for the model CommandModel.
 */
export class CommandModelBase extends Model({
	__typename: tProp('Command'),
	attackIds: prop<string[] | null>().withSetter(),
	beacon: prop<Ref<BeaconModel>>().withSetter(),
	commandFailed: prop<boolean>().withSetter(),
	commandGroups: prop<Ref<CommandGroupModel>[]>(() => []).withSetter(),
	commentsCount: prop<number>().withSetter(),
	id: prop<string>().withSetter(),
	input: prop<Ref<LogEntryModel>>().withSetter(),
	inputText: prop<string>().withSetter(),
	mitreTechniques: prop<(MitreTechniques | null)[] | null>().withSetter(),
	operator: prop<Ref<OperatorModel> | null>().withSetter(),
	output: prop<Ref<LogEntryModel>[]>(() => []).withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class CommandModelSelector extends QueryBuilder {
	get attackIds() {
		return this.__attr(`attackIds`);
	}
	get commandFailed() {
		return this.__attr(`commandFailed`);
	}
	get commentsCount() {
		return this.__attr(`commentsCount`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get inputText() {
		return this.__attr(`inputText`);
	}
	get mitreTechniques() {
		return this.__attr(`mitreTechniques`);
	}
	beacon(builder?: string | BeaconModelSelector | ((selector: BeaconModelSelector) => BeaconModelSelector)) {
		return this.__child(`beacon`, BeaconModelSelector, builder);
	}
	commandGroups(
		builder?: string | CommandGroupModelSelector | ((selector: CommandGroupModelSelector) => CommandGroupModelSelector)
	) {
		return this.__child(`commandGroups`, CommandGroupModelSelector, builder);
	}
	input(builder?: string | LogEntryModelSelector | ((selector: LogEntryModelSelector) => LogEntryModelSelector)) {
		return this.__child(`input`, LogEntryModelSelector, builder);
	}
	operator(builder?: string | OperatorModelSelector | ((selector: OperatorModelSelector) => OperatorModelSelector)) {
		return this.__child(`operator`, OperatorModelSelector, builder);
	}
	output(builder?: string | LogEntryModelSelector | ((selector: LogEntryModelSelector) => LogEntryModelSelector)) {
		return this.__child(`output`, LogEntryModelSelector, builder);
	}
}
export function selectFromCommand() {
	return new CommandModelSelector();
}

export const commandModelPrimitives =
	selectFromCommand().attackIds.commandFailed.commentsCount.inputText.mitreTechniques;

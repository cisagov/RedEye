/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconLineType } from './BeaconLineTypeEnum';
import type { BeaconModel } from './BeaconModel';
import type { CommandModel } from './CommandModel';
import type { LogType } from './LogTypeEnum';

import { BeaconModelSelector, beaconModelPrimitives } from './BeaconModel';
import { CommandModelSelector, commandModelPrimitives } from './CommandModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	beacon: BeaconModel;
	command: CommandModel;
};

/**
 * LogEntryBase
 * auto generated base class for the model LogEntryModel.
 */
export class LogEntryModelBase extends Model({
	__typename: tProp('LogEntry'),
	beacon: prop<Ref<BeaconModel> | null>().withSetter(),
	/** All lines in a LogEntry */
	blob: prop<string>().withSetter(),
	command: prop<Ref<CommandModel> | null>().withSetter(),
	dateTime: prop<any | null>().withSetter(),
	filepath: prop<string | null>().withSetter(),
	id: prop<string>().withSetter(),
	lineNumber: prop<number>().withSetter(),
	lineType: prop<BeaconLineType | null>().withSetter(),
	logType: prop<LogType>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class LogEntryModelSelector extends QueryBuilder {
	get blob() {
		return this.__attr(`blob`);
	}
	get dateTime() {
		return this.__attr(`dateTime`);
	}
	get filepath() {
		return this.__attr(`filepath`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get lineNumber() {
		return this.__attr(`lineNumber`);
	}
	get lineType() {
		return this.__attr(`lineType`);
	}
	get logType() {
		return this.__attr(`logType`);
	}
	beacon(builder?: string | BeaconModelSelector | ((selector: BeaconModelSelector) => BeaconModelSelector)) {
		return this.__child(`beacon`, BeaconModelSelector, builder);
	}
	command(builder?: string | CommandModelSelector | ((selector: CommandModelSelector) => CommandModelSelector)) {
		return this.__child(`command`, CommandModelSelector, builder);
	}
}
export function selectFromLogEntry() {
	return new LogEntryModelSelector();
}

export const logEntryModelPrimitives = selectFromLogEntry().blob.dateTime.filepath.lineNumber.lineType.logType;

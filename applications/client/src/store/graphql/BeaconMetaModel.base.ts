/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';
import type { BeaconType } from './BeaconTypeEnum';
import type { LogEntryModel } from './LogEntryModel';
import type { Shapes } from './ShapesEnum';

import { LogEntryModelSelector, logEntryModelPrimitives } from './LogEntryModel';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	source: LogEntryModel;
};

/**
 * BeaconMetaBase
 * auto generated base class for the model BeaconMetaModel.
 *
 * Data derived from the Beacon metadata line
 */
export class BeaconMetaModelBase extends Model({
	__typename: tProp('BeaconMeta'),
	/** The color of the node */
	color: prop<string | null>().withSetter(),
	/** The time that the last command was run */
	endTime: prop<any | null>().withSetter(),
	id: prop<string>().withSetter(),
	/** The IP of the host at the time of the metadata line */
	ip: prop<string | null>().withSetter(),
	/** Process Identifier the beacon is running on */
	pid: prop<number | null>().withSetter(),
	/** The IP of the host at the time of the metadata line */
	port: prop<number | null>().withSetter(),
	/** Process Identifier the beacon is running on */
	process: prop<string | null>().withSetter(),
	/** The shape of the beacon */
	shape: prop<Shapes | null>().withSetter(),
	/** The log line from which the BeaconMeta was extracted */
	source: prop<Ref<LogEntryModel> | null>().withSetter(),
	/** The start time of the beacon */
	startTime: prop<any | null>().withSetter(),
	/** The communication type used by the beacon */
	type: prop<BeaconType | null>().withSetter(),
	/** The username the beacon is running under */
	username: prop<string | null>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class BeaconMetaModelSelector extends QueryBuilder {
	get color() {
		return this.__attr(`color`);
	}
	get endTime() {
		return this.__attr(`endTime`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get ip() {
		return this.__attr(`ip`);
	}
	get pid() {
		return this.__attr(`pid`);
	}
	get port() {
		return this.__attr(`port`);
	}
	get process() {
		return this.__attr(`process`);
	}
	get shape() {
		return this.__attr(`shape`);
	}
	get startTime() {
		return this.__attr(`startTime`);
	}
	get type() {
		return this.__attr(`type`);
	}
	get username() {
		return this.__attr(`username`);
	}
	source(builder?: string | LogEntryModelSelector | ((selector: LogEntryModelSelector) => LogEntryModelSelector)) {
		return this.__child(`source`, LogEntryModelSelector, builder);
	}
}
export function selectFromBeaconMeta() {
	return new BeaconMetaModelSelector();
}

export const beaconMetaModelPrimitives =
	selectFromBeaconMeta().color.endTime.ip.pid.port.process.shape.startTime.type.username;

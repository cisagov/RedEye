/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { QueryBuilder } from 'mk-gql';
import { Model, prop, Ref, tProp } from 'mobx-keystone';
import type { GlobalOperatorModel } from './GlobalOperatorModel';
import { GlobalOperatorModelSelector } from './GlobalOperatorModel';
import type { ParsingStatus } from './ParsingStatusEnum';

/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */
type Refs = {
	creator: GlobalOperatorModel;
	lastOpenedBy: GlobalOperatorModel;
};

/**
 * CampaignBase
 * auto generated base class for the model CampaignModel.
 */
export class CampaignModelBase extends Model({
	__typename: tProp('Campaign'),
	annotationCount: prop<number>().withSetter(),
	beaconCount: prop<number>().withSetter(),
	bloodStrikeServerCount: prop<number>().withSetter(),
	commandCount: prop<number>().withSetter(),
	computerCount: prop<number>().withSetter(),
	creator: prop<Ref<GlobalOperatorModel> | null>().withSetter(),
	firstLogTime: prop<any | null>().withSetter(),
	id: prop<string>().withSetter(),
	lastLogTime: prop<any | null>().withSetter(),
	lastOpenedBy: prop<Ref<GlobalOperatorModel> | null>().withSetter(),
	name: prop<string>().withSetter(),
	parsingStatus: prop<ParsingStatus>().withSetter(),
}) {
	getRefId() {
		return String(this.id);
	}
}

export class CampaignModelSelector extends QueryBuilder {
	get annotationCount() {
		return this.__attr(`annotationCount`);
	}
	get beaconCount() {
		return this.__attr(`beaconCount`);
	}
	get bloodStrikeServerCount() {
		return this.__attr(`bloodStrikeServerCount`);
	}
	get commandCount() {
		return this.__attr(`commandCount`);
	}
	get computerCount() {
		return this.__attr(`computerCount`);
	}
	get firstLogTime() {
		return this.__attr(`firstLogTime`);
	}
	get id() {
		return this.__attr(`id`);
	}
	get lastLogTime() {
		return this.__attr(`lastLogTime`);
	}
	get name() {
		return this.__attr(`name`);
	}
	get parsingStatus() {
		return this.__attr(`parsingStatus`);
	}
	creator(
		builder?:
			| string
			| GlobalOperatorModelSelector
			| ((selector: GlobalOperatorModelSelector) => GlobalOperatorModelSelector)
	) {
		return this.__child(`creator`, GlobalOperatorModelSelector, builder);
	}
	lastOpenedBy(
		builder?:
			| string
			| GlobalOperatorModelSelector
			| ((selector: GlobalOperatorModelSelector) => GlobalOperatorModelSelector)
	) {
		return this.__child(`lastOpenedBy`, GlobalOperatorModelSelector, builder);
	}
}
export function selectFromCampaign() {
	return new CampaignModelSelector();
}

export const campaignModelPrimitives =
	selectFromCampaign().annotationCount.beaconCount.bloodStrikeServerCount.commandCount.computerCount.firstLogTime
		.lastLogTime.name.parsingStatus;

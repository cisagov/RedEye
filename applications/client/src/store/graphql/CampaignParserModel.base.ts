/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

import { types, prop, tProp, Model, Ref, idProp } from 'mobx-keystone';
import { QueryBuilder } from 'mk-gql';

/**
 * CampaignParserBase
 * auto generated base class for the model CampaignParserModel.
 */
export class CampaignParserModelBase extends Model({
	__typename: tProp('CampaignParser'),
	parserName: prop<string | null>().withSetter(),
	path: prop<string | null>().withSetter(),
}) {}

export class CampaignParserModelSelector extends QueryBuilder {
	get parserName() {
		return this.__attr(`parserName`);
	}
	get path() {
		return this.__attr(`path`);
	}
}
export function selectFromCampaignParser() {
	return new CampaignParserModelSelector();
}

export const campaignParserModelPrimitives = selectFromCampaignParser().parserName.path;

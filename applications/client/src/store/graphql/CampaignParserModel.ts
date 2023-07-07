import { ExtendedModel, model } from 'mobx-keystone';
import { CampaignParserModelBase } from './CampaignParserModel.base';

/* A graphql query fragment builders for CampaignParserModel */
export {
	selectFromCampaignParser,
	campaignParserModelPrimitives,
	CampaignParserModelSelector,
} from './CampaignParserModel.base';

/**
 * CampaignParserModel
 */
@model('CampaignParser')
export class CampaignParserModel extends ExtendedModel(CampaignParserModelBase, {}) {}

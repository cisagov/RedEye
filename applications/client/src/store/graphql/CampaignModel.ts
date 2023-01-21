import type { AppStore } from '@redeye/client/store';
import { campaignsQuery, ParsingStatus } from '@redeye/client/store';
import { computed } from 'mobx';
import { ExtendedModel, getRoot, model, modelFlow } from 'mobx-keystone';
import { CampaignModelBase } from './CampaignModel.base';

/* A graphql query fragment builders for CampaignModel */
export { campaignModelPrimitives, CampaignModelSelector, selectFromCampaign } from './CampaignModel.base';

export interface Servers {
	name: string;
	fileData: FormData | undefined;
	fileCount: number;
	isParsingFiles: boolean;
	completed: number;
	totalTasks: number;
}

/**
 * CampaignModel
 */
@model('Campaign')
export class CampaignModel extends ExtendedModel(CampaignModelBase, {}) {
	checkParsingProgressInterval: number | undefined;

	protected onAttachedToRootStore(): (() => void) | void {
		return () => {
			if (this.checkParsingProgressInterval) {
				clearInterval(this.checkParsingProgressInterval);
			}
		};
	}

	@computed get isParsing() {
		return (
			this.parsingStatus === ParsingStatus.PARSING_IN_PROGRESS ||
			this.parsingStatus === ParsingStatus.PARSING_QUEUED ||
			// To prevent an unnecessary rerender
			this.parsingStatus === ParsingStatus.PARSING_NOT_STARTED
		);
	}

	@modelFlow *checkParsingProgress() {
		const store = getRoot<AppStore>(this);
		yield store.graphqlStore.queryCampaign({ campaignId: this.id }, campaignsQuery);
	}

	@modelFlow
	*processServers() {
		const store = getRoot<AppStore>(this);

		this.checkParsingProgress();
		this.checkParsingProgressInterval = yield setInterval(async () => {
			// If we leave the campaigns page, stop checking campaign
			if (!store.router.currentRoute.includes('/campaigns/')) {
				clearInterval(this.checkParsingProgressInterval);
			} else {
				await this.checkParsingProgress();
				if (
					this.parsingStatus === ParsingStatus.PARSING_COMPLETED ||
					this.parsingStatus === ParsingStatus.PARSING_FAILURE
				)
					clearInterval(this.checkParsingProgressInterval);
			}
		}, 5000);
	}
}

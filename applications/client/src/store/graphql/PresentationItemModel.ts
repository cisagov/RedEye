import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';
import { CampaignViews, Tabs } from '@redeye/client/types';
import { PresentationItemModelBase } from './PresentationItemModel.base';

import type { AppStore } from '../app-store';
import { routes } from '../routing';

/* A graphql query fragment builders for PresentationItemModel */
export {
	presentationItemModelPrimitives,
	PresentationItemModelSelector,
	selectFromPresentationItem,
} from './PresentationItemModel.base';

/**
 * PresentationItemModel
 */
@model('PresentationItem')
export class PresentationItemModel extends ExtendedModel(PresentationItemModelBase, {}) {
	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				tab: Tabs.COMMENTS,
				currentItem: 'comments_list',
				currentItemId: this.id,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	}
}

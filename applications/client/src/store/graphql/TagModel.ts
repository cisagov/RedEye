import { ExtendedModel, model, getRoot, modelAction } from 'mobx-keystone';
import { CampaignViews, Tabs } from '@redeye/client/types';
import { TagModelBase } from './TagModel.base';
import type { AppStore } from '../app-store';
import { routes } from '../routing';

/* A graphql query fragment builders for TagModel */
export { selectFromTag, tagModelPrimitives, TagModelSelector } from './TagModel.base';

/**
 * TagModel
 */
@model('Tag')
export class TagModel extends ExtendedModel(TagModelBase, {}) {
	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				tab: Tabs.COMMENTS,
				currentItem: 'comments_list',
				currentItemId: `tag-${this.id}`,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	}
}

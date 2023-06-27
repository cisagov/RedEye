import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';

import type { UUID } from '@redeye/client/types';
import { CampaignViews, Tabs } from '@redeye/client/types';
import { AnnotationModelBase } from './AnnotationModel.base';
import type { AppStore } from '../app-store';
import { routes } from '../routing';

/* A graphql query fragment builders for AnnotationModel */
export { annotationModelPrimitives, AnnotationModelSelector, selectFromAnnotation } from './AnnotationModel.base';

/**
 * AnnotationModel
 */
@model('Annotation')
export class AnnotationModel extends ExtendedModel(AnnotationModelBase, {}) {
	// @computed get hierarchy(): { command: string; beacon: string; host?: string; server?: string } {
	// 	return {
	// 		command: this.id,
	// 		beacon: this.beacon.id,
	// 		host: this.beacon.maybeCurrent?.hierarchy.host,
	// 		server: this.beacon.maybeCurrent?.hierarchy.server,
	// 	};
	// }

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				currentItem: 'beacon',
				currentItemId: this.beaconIdFromFirstCommand as UUID, // get beacon
				tab: Tabs.COMMENTS,
				activeItem: 'command',
				activeItemId: this.commandIds?.[0] as UUID,
			},
		});
	}
}

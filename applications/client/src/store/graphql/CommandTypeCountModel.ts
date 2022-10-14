import { computed } from 'mobx';
import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';
import { routes } from '..';
import { CampaignViews, Tabs } from '../../types';
import type { UUID } from '../../types/uuid';
import type { AppStore } from '../app-store';
import { CommandTypeCountModelBase } from './CommandTypeCountModel.base';

/* A graphql query fragment builders for CommandTypeCountModel */
export {
	commandTypeCountModelPrimitives,
	CommandTypeCountModelSelector,
	selectFromCommandTypeCount,
} from './CommandTypeCountModel.base';

/**
 * CommandTypeCountModel
 */
@model('CommandTypeCount')
export class CommandTypeCountModel extends ExtendedModel(CommandTypeCountModelBase, {}) {
	@computed get hierarchy(): { commandType: string } {
		return {
			commandType: this.id,
		};
	}

	@modelAction select() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: appStore.router.currentRoute,
			params: {
				tab: Tabs.COMMANDS,
				currentItem: this.id !== appStore.campaign?.interactionState.selectedCommandType?.id ? 'command-type' : 'all',
				currentItemId:
					this.id !== appStore.campaign?.interactionState.selectedCommandType?.id ? (this.id as UUID) : undefined,
			},
		});
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				currentItem: 'command-type',
				currentItemId: this.id as UUID,
				tab: Tabs.COMMANDS,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	}
}

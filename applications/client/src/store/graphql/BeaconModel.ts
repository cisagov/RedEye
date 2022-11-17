import type { AppStore, LinkModel } from '@redeye/client/store';
import { routes } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types/timeline';
import { computed } from 'mobx';
import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';
import type { CurrentItem, UUID } from '../../types';
import { CampaignViews, Tabs } from '../../types';
import { BeaconModelBase } from './BeaconModel.base';
import type { OperatorModel } from './OperatorModel';
import type { ServerModel } from './ServerModel';

/**
 * BeaconModel
 */
@model('Beacon')
export class BeaconModel extends ExtendedModel(BeaconModelBase, {}) {
	get minTime() {
		if (this.host?.current?.cobaltStrikeServer) return this.host?.current?.minTime;
		else return this.meta[0]?.maybeCurrent?.startTime;
	}

	get maxTime() {
		if (this.host?.current?.cobaltStrikeServer) return this.host?.current?.maxTime;
		else return this.meta[0]?.maybeCurrent?.endTime;
	}

	@computed get server(): ServerModel | undefined {
		const appStore = getRoot<AppStore>(this);
		return this.serverId ? appStore.graphqlStore.servers.get(this.serverId) : undefined;
	}

	@computed get hierarchy(): { beacon: string; host?: string; server?: string } {
		return {
			beacon: this.id,
			host: this?.host?.id,
			server: this?.server?.id || this?.host?.current.serverId,
		};
	}

	@computed get links(): { from: LinkModel[]; to: LinkModel[] } {
		const appStore = getRoot<AppStore>(this);

		return {
			from: Array.from(appStore?.graphqlStore.links.values()).filter((link) => link.destination?.id === this.id),
			to: Array.from(appStore?.graphqlStore.links.values()).filter((link) => link.origin?.id === this.id),
		};
	}

	get state(): TimeStatus {
		const appStore = getRoot<AppStore>(this);
		if (appStore.campaign?.interactionState.exitedBeacons.has(this.id as string)) {
			return TimeStatus.DEAD;
		} else if (appStore.campaign?.interactionState.currentBeacons.has(this.id as string)) {
			return TimeStatus.ALIVE;
		} else {
			return TimeStatus.FUTURE;
		}
	}

	get operators(): Array<OperatorModel> {
		const appStore = getRoot<AppStore>(this);
		const operators: Array<OperatorModel> = [];
		appStore.graphqlStore.operators.forEach((operator) => {
			if (operator?.beacons.has(this.id as string)) operators.push(operator);
		});
		return operators;
	}

	@modelAction select(activeItem?: CurrentItem, activeItemId?: UUID) {
		const appStore = getRoot<AppStore>(this);
		const notPrimary =
			this.id !== appStore.campaign?.interactionState.selectedBeacon?.id ||
			appStore.router.params.view !== CampaignViews.EXPLORE;
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params:
				activeItem && activeItemId
					? {
							view: CampaignViews.EXPLORE,
							tab: notPrimary ? Tabs.COMMANDS : Tabs.BEACONS,
							currentItem: notPrimary ? 'beacon' : 'all',
							currentItemId: notPrimary ? (this.id as UUID) : undefined,
							activeItem: notPrimary ? activeItem : undefined,
							activeItemId: notPrimary ? (activeItemId as UUID) : undefined,
					  }
					: {
							view: CampaignViews.EXPLORE,
							tab: notPrimary ? Tabs.COMMANDS : Tabs.BEACONS,
							currentItem: notPrimary ? 'beacon' : 'all',
							currentItemId: notPrimary ? (this.id as UUID) : undefined,
					  },
		});
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		if (!this.host?.current?.cobaltStrikeServer) {
			appStore.router.updateRoute({
				path: routes[CampaignViews.EXPLORE],
				params: {
					view: CampaignViews.EXPLORE,
					tab: Tabs.COMMANDS,
					currentItem: 'beacon',
					currentItemId: this.id as UUID,
					activeItem: undefined,
					activeItemId: undefined,
				},
			});
		} else {
			this.server?.searchSelect();
		}
	}
}

/* A graphql query fragment builders for BeaconModel */
export { beaconModelPrimitives, BeaconModelSelector, selectFromBeacon } from './BeaconModel.base';

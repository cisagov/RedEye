import { computed, observable } from 'mobx';
import type { AnyModel, ObjectMap, Ref } from 'mobx-keystone';
import { findParent, ExtendedModel, getRoot, model, modelAction, objectMap, prop } from 'mobx-keystone';
import type { Moment } from 'moment-timezone';
import { CampaignViews, Tabs } from '../../types';
import type { UUID } from '../../types/uuid';
import type { AppStore } from '../app-store';
import { hostCampaignRef } from '../app-store';
import { routes } from '../routing';
import { getMinMaxTime } from '../util/min-max-time';
import type { BeaconModel, HostModel, OperatorModel, RootStore } from './root';
import { ServerModelBase } from './ServerModel.base';

/* A graphql query fragment builders for ServerModel */
export { selectFromServer, serverModelPrimitives, ServerModelSelector } from './ServerModel.base';

/**
 * ServerModel
 */
@model('Server')
export class ServerModel extends ExtendedModel(ServerModelBase, {
	hosts: prop<ObjectMap<Ref<HostModel>>>(() => objectMap()),
}) {
	@observable minTime: Moment | undefined;
	@observable maxTime: Moment | undefined;

	get operators(): Array<OperatorModel> {
		const appStore = getRoot<AppStore>(this);
		const operators: Array<OperatorModel> = [];
		appStore.graphqlStore.operators.forEach((operator) => {
			if (operator) {
				for (const beacon of operator.beacons.values()) {
					if (beacon.serverId === this.id) {
						operators.push(operator);
						break;
					}
				}
			}
		});
		return operators;
	}

	@computed get serverHost(): HostModel | undefined {
		const appStore = getRoot<AppStore>(this);
		for (const host of appStore.graphqlStore.hosts.values()) {
			if (host.serverId === this.id && host.cobaltStrikeServer) return host;
		}
	}

	@computed get serverBeacon(): BeaconModel | undefined {
		const appStore = getRoot<AppStore>(this);
		for (const beacon of appStore.graphqlStore.beacons.values()) {
			if (beacon.serverId === this.id && beacon.host?.maybeCurrent?.cobaltStrikeServer) return beacon;
		}
	}

	@computed get hierarchy() {
		return { server: this.id };
	}

	@modelAction buildServerStats() {
		const graphqlStore = findParent<RootStore>(this, (prnt) => (prnt as AnyModel)?.$modelType === 'RootStore');
		const beacons = Array.from(this.beacons?.values() || []);
		let cobaltStrikeHost: HostModel | undefined;
		for (const sBe of beacons) {
			const beacon = graphqlStore?.beacons.get(sBe.id);
			if (beacon?.host?.maybeCurrent) {
				getMinMaxTime(this, beacon.meta[0]?.maybeCurrent?.startTime);
				getMinMaxTime(this, beacon.meta[0]?.maybeCurrent?.endTime);
				beacon.host?.maybeCurrent?.setServerId(this.id);
				this.hosts.set(beacon.host.id, hostCampaignRef(beacon.host?.maybeCurrent));
				if (beacon.host?.maybeCurrent?.cobaltStrikeServer) cobaltStrikeHost = beacon.host.maybeCurrent;
			}
		}
		if (cobaltStrikeHost) {
			cobaltStrikeHost.minTime = this.minTime;
			cobaltStrikeHost.maxTime = this.maxTime;
		}
	}

	@modelAction select() {
		const appStore = getRoot<AppStore>(this);
		const notPrimary =
			!!appStore.campaign?.interactionState.selectedHost ||
			this.id !== appStore.campaign?.interactionState.selectedServer?.id;
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				tab: Tabs.HOSTS,
				currentItem: notPrimary ? 'server' : 'all',
				currentItemId: notPrimary ? (this.id as UUID) : undefined,
			},
		});
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				tab: Tabs.HOSTS,
				currentItem: 'server',
				currentItemId: this.id as UUID,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	}
}

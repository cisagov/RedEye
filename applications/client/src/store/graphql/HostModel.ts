import { isDefined } from '@redeye/client/components';
import { routes } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types/timeline';
import { computed, observable, reaction } from 'mobx';
import { ExtendedModel, getRoot, model, modelAction, prop } from 'mobx-keystone';
import type { Moment } from 'moment-timezone';
import { CampaignViews, Tabs } from '../../types';
import type { UUID } from '../../types/uuid';
import type { AppStore } from '../app-store';
import { getMinMaxTime } from '../util/min-max-time';
import { HostModelBase } from './HostModel.base';
import type { BeaconModel, OperatorModel, ServerModel } from './root';

/* A graphql query fragment builders for HostModel */
export { selectFromHost, hostModelPrimitives, HostModelSelector } from './HostModel.base';

/**
 * HostModel
 */
@model('Host')
export class HostModel extends ExtendedModel(HostModelBase, {
	// BLDSTRIKE-598: should be this.serverIds plural
	serverId: prop<string | undefined>().withSetter(),
}) {
	protected onAttachedToRootStore(rootStore: any): (() => void) | void {
		return reaction(
			() => [rootStore.campaign?.timeline.currentBeaconIds, rootStore.graphqlStore?.beacons, this.serverId],
			() => this.getMinMaxTime()
		);
	}

	@computed get hierarchy(): { host: string; server?: string } {
		return {
			host: this.id,
			server: this?.server?.id || this.serverId,
		};
	}

	@observable.ref minTime: Moment | undefined;
	@observable.ref maxTime: Moment | undefined;

	@computed get server(): ServerModel | undefined {
		// BLDSTRIKE-598: should be this.servers plural
		const appStore = getRoot<AppStore>(this);
		return this.serverId ? appStore?.graphqlStore?.servers.get(this.serverId) : undefined;
	}

	@computed get beacons(): Array<BeaconModel> {
		const appStore = getRoot<AppStore>(this);
		const beaconIds = appStore?.campaign?.timeline.currentBeaconIds;
		return (
			this.beaconIds
				?.filter((b) => beaconIds.includes(b))
				.map((b) => appStore?.graphqlStore?.beacons.get(b))
				.filter<BeaconModel>(isDefined) ?? []
		);
	}

	@computed get beaconCount(): number {
		return this.beaconIds?.length || 0;
	}

	@computed get commandsCount(): number {
		const appStore = getRoot<AppStore>(this);
		let commandsCount: number = 0;
		this.beaconIds?.forEach((beaconId) => {
			commandsCount += appStore?.graphqlStore?.beacons?.get(beaconId)?.commandsCount || 0;
		});
		return commandsCount;
	}

	@computed get operators(): Array<OperatorModel> {
		const appStore = getRoot<AppStore>(this);
		const operators: Array<OperatorModel> = [];
		appStore?.graphqlStore?.operators.forEach((operator) => {
			if (operator && this.beaconIds?.some((id) => operator?.beacons?.has(id))) operators.push(operator);
		});
		return operators;
	}

	@computed get state(): TimeStatus {
		const appStore = getRoot<AppStore>(this);
		if (appStore?.campaign?.interactionState.exitedHosts.has(this.id as string)) {
			return TimeStatus.DEAD;
		} else if (appStore?.campaign?.interactionState.currentHosts.has(this.id as string)) {
			return TimeStatus.ALIVE;
		} else {
			return TimeStatus.FUTURE;
		}
	}

	@modelAction select() {
		const appStore = getRoot<AppStore>(this);
		if (!this.cobaltStrikeServer && appStore) {
			const notPrimary =
				!!appStore.campaign?.interactionState.selectedBeacon ||
				this.id !== appStore.campaign?.interactionState.selectedHost?.id;
			appStore.router.updateRoute({
				path: routes[CampaignViews.EXPLORE],
				params: {
					view: CampaignViews.EXPLORE,
					tab: notPrimary ? Tabs.COMMANDS : Tabs.BEACONS,
					currentItem: notPrimary ? 'host' : 'all',
					currentItemId: notPrimary ? (this.id as UUID) : undefined,
				},
			});
		} else this.server?.select();
	}

	@modelAction navCommandSelect() {
		const appStore = getRoot<AppStore>(this);
		if (!this.cobaltStrikeServer && appStore) {
			appStore.router.updateRoute({
				path: routes[CampaignViews.EXPLORE],
				params: {
					view: CampaignViews.EXPLORE,
					tab: Tabs.COMMANDS,
					currentItem: 'host',
					currentItemId: this.id as UUID,
					activeItem: appStore.router.params.currentItem === 'beacon' ? undefined : appStore.router.params.activeItem,
					activeItemId:
						appStore.router.params.currentItem === 'beacon' ? undefined : appStore.router.params.activeItemId,
				},
			});
		} else {
			this.server?.searchSelect();
		}
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		if (!this.cobaltStrikeServer && appStore) {
			appStore.router.updateRoute({
				path: routes[CampaignViews.EXPLORE],
				params: {
					view: CampaignViews.EXPLORE,
					tab: Tabs.COMMANDS,
					currentItem: 'host',
					currentItemId: this.id as UUID,
					activeItem: undefined,
					activeItemId: undefined,
				},
			});
		} else {
			this.server?.searchSelect();
		}
	}

	@modelAction getMinMaxTime() {
		const appStore = getRoot<AppStore>(this);
		if (appStore) {
			const items = this.cobaltStrikeServer
				? Array.from(appStore?.graphqlStore?.beacons?.values?.() || []).filter((b) => b.serverId === this.serverId)
				: this.beaconIds;
			items?.forEach?.((beaconId) => {
				const originalBeaconId = beaconId;
				if (originalBeaconId) {
					const beacon = appStore?.graphqlStore?.beacons.get(originalBeaconId);

					if (beacon?.meta?.[0]?.current?.startTime) getMinMaxTime(this, beacon?.meta?.[0]?.current?.startTime);
					if (beacon?.meta?.[0]?.current?.endTime) getMinMaxTime(this, beacon?.meta?.[0]?.current?.endTime);
				}
			});
		}
	}
}

import type { CurrentItem } from '@redeye/client/types';
import { CampaignViews } from '@redeye/client/types';
import { computed, reaction } from 'mobx';
import type { Ref } from 'mobx-keystone';
import { ExtendedModel, model, modelAction, modelClass, prop } from 'mobx-keystone';
import {
	beaconCampaignRef,
	commandTypeCampaignRef,
	hostCampaignRef,
	operatorCampaignRef,
	serverCampaignRef,
} from '../app-store';
import type {
	BeaconModel,
	CommandModel,
	CommandTypeCountModel,
	HostModel,
	OperatorModel,
	ServerModel,
} from '../graphql';
import { RedEyeModel } from '../util/model';

export type ModelType = 'beacon' | 'host' | 'server' | 'operator' | 'command';
/**
 * The interaction state of the campaign.
 * Either through click, hover, timeline time-step change or presentation mode selection.
 *
 * @class InteractionState
 * @extends {RedEyeModel}
 */
@model('InteractionState')
export class InteractionState extends ExtendedModel(() => ({
	baseModel: modelClass<RedEyeModel>(RedEyeModel),
	props: {
		selectedBeacon: prop<Ref<BeaconModel> | undefined>().withSetter(),
		hoveredBeacon: prop<Ref<BeaconModel> | undefined>().withSetter(),
		selectedHost: prop<Ref<HostModel> | undefined>().withSetter(),
		hoveredHost: prop<Ref<HostModel> | undefined>().withSetter(),
		selectedServer: prop<Ref<ServerModel> | undefined>().withSetter(),
		hoveredServer: prop<Ref<ServerModel> | undefined>().withSetter(),
		selectedOperator: prop<Ref<OperatorModel> | undefined>().withSetter(),
		selectedCommandType: prop<Ref<CommandTypeCountModel> | undefined>().withSetter(),
	},
})) {
	protected onAttachedToRootStore(rootStore: any): (() => void) | void {
		return reaction(
			() => [rootStore.router.params.currentItemId, rootStore.router.params.slide, !!rootStore.campaign.graph],
			() => {
				this.changeSelected();
			},
			{ fireImmediately: false }
		);
	}

	@computed get exitedBeacons(): Map<string, BeaconModel> {
		const items = new Map<string, BeaconModel>();
		this.appStore?.campaign?.timeline.exitedBeaconIds?.forEach((id) => {
			const beacon = this.appStore?.graphqlStore.beacons.get(id);
			if (beacon) items.set(id, beacon);
		});
		return items;
	}

	@computed get exitedHosts(): Map<string, HostModel> {
		const items = new Map<string, HostModel>();
		this.exitedBeacons?.forEach((b) => {
			if (b.host?.id) items.set(b.host?.id, b.host?.current);
		});
		return items;
	}

	@computed get currentBeacons(): Map<string, BeaconModel> {
		const items = new Map<string, BeaconModel>();
		const isPresentation = this.appStore?.router.params.view === CampaignViews.PRESENTATION;
		if (isPresentation) {
			this.appStore?.campaign.presentation.selectedItem?.beaconIds?.forEach((id) => {
				const beacon = this.appStore?.graphqlStore.beacons.get(id);
				if (beacon) items.set(id, beacon);
			});
		} else {
			this.appStore?.campaign.timeline.currentBeaconIds?.forEach((id) => {
				const beacon = this.appStore?.graphqlStore.beacons.get(id);
				if (beacon) items.set(id, beacon);
			});
		}
		return (
			this.appStore?.campaign.timeline.isEnd && !isPresentation ? this.appStore?.graphqlStore.beacons : items
		) as Map<string, BeaconModel>;
	}

	@computed get currentHosts(): Map<string, HostModel> {
		const items = new Map<string, HostModel>();
		const isPresentation = this.appStore?.router.params.view === CampaignViews.PRESENTATION;
		if (isPresentation) {
			this.appStore?.campaign?.presentation.selectedItem?.beaconIds?.forEach((id) => {
				const beacon = this.appStore?.graphqlStore.beacons.get(id);
				if (beacon && beacon.host?.id) items.set(beacon.host?.id, beacon.host?.current);
			});
		} else {
			this.currentBeacons?.forEach((b) => {
				if (b.host?.id) items.set(b.host?.id, b.host?.current);
			});
			this.appStore?.graphqlStore.hosts?.forEach((comp) => {
				if (comp?.cobaltStrikeServer) {
					items.set(comp.id, comp);
				}
			});
		}
		return items;
	}

	getModel(
		modelType: CurrentItem,
		id: string
	): BeaconModel | HostModel | ServerModel | OperatorModel | CommandTypeCountModel | CommandModel | undefined {
		switch (modelType) {
			case 'beacon':
				return this.appStore?.graphqlStore.beacons.get(id);
			case 'host':
				return this.appStore?.graphqlStore.hosts.get(id);
			case 'server':
				return this.appStore?.graphqlStore.servers.get(id);
			case 'operator':
				return this.appStore?.graphqlStore.operators.get(id);
			case 'command-type':
				return this.appStore?.graphqlStore.commandTypeCounts.get(id);
			case 'command':
				return this.appStore?.graphqlStore.commands.get(id);
			default:
				return undefined;
		}
	}

	@computed get currentItem():
		| {
				type: string;
				items: {
					beacon?: string | null;
					host?: string | null;
					server?: string | null;
					operator?: string | null;
					commandType?: string | null;
				};
		  }
		| undefined {
		const currentItem = this.appStore?.router?.params.currentItem;
		const currentItemId = this.appStore?.router?.params.currentItemId;
		if (currentItem && currentItemId && currentItem !== 'all') {
			const type = currentItem;
			const itemValues = this.getModel(type, currentItemId!);
			return itemValues ? { type, items: itemValues.hierarchy } : undefined;
		}
		return undefined;
	}

	@modelAction changeSelected() {
		if (this.appStore) {
			this.appStore.campaign.timeline?.selectedBeacons.clear();
			this.appStore.campaign.timeline?.selectedChainedBeacons.clear();
			const isPresentation = this.appStore?.router.params.view === CampaignViews.PRESENTATION;
			if (isPresentation) {
				const beacons = this.appStore.campaign.presentation.currentSlide?.beacons;
				const beaconIds = beacons?.map((beacon) => beacon.id);
				if (beaconIds) {
					for (const beaconId of beaconIds) {
						this.appStore.campaign.timeline?.setBeacon(this.currentBeacons.get(beaconId));
					}
					this.appStore.campaign.graph?.graphData.selectNodes(beaconIds);
				} else {
					this.appStore.campaign.graph?.graphData.clearSelection();
				}
			} else {
				const { server, host, operator, beacon, commandType } = this.currentItem?.items || {};
				if (beacon) {
					this.appStore.campaign.timeline?.setBeacon(this.currentBeacons.get(beacon));
				} else if (host) {
					const comp = this.currentHosts.get(host);
					if (comp) {
						for (const hostBeaconId of comp.beaconIds) {
							this.appStore.campaign.timeline?.setBeacon(this.currentBeacons.get(hostBeaconId));
						}
					}
				} else if (server) {
					const comp = this.appStore.graphqlStore.servers.get(server);
					if (comp) {
						for (const serverBeacon of comp.beacons) {
							this.appStore.campaign.timeline?.setBeacon(this.currentBeacons.get(serverBeacon.id));
						}
					}
				}
				this.setSelectedModels(beacon, host, server, operator, commandType);
			}
		}
	}

	@modelAction
	setSelectedModels(
		beaconId: string | undefined | null,
		hostId: string | undefined | null,
		serverId: string | undefined | null,
		operatorId: string | undefined | null,
		commandTypeId: string | undefined | null
	) {
		if (beaconId && this.appStore?.graphqlStore.beacons.has(beaconId))
			this.selectedBeacon = beaconCampaignRef(this.appStore?.graphqlStore.beacons.get(beaconId)!);
		else this.selectedBeacon = undefined;
		if (hostId && this.appStore?.graphqlStore.hosts.has(hostId))
			this.selectedHost = hostCampaignRef(this.appStore?.graphqlStore.hosts.get(hostId)!);
		else this.selectedHost = undefined;
		if (serverId && this.appStore?.graphqlStore.servers.has(serverId))
			this.selectedServer = serverCampaignRef(this.appStore?.graphqlStore.servers.get(serverId)!);
		else this.selectedServer = undefined;
		if (operatorId && this.appStore?.graphqlStore.operators.has(operatorId))
			this.selectedOperator = operatorCampaignRef(this.appStore?.graphqlStore.operators.get(operatorId)!);
		else this.selectedOperator = undefined;
		if (commandTypeId && this.appStore?.graphqlStore.commandTypeCounts.has(commandTypeId))
			this.selectedCommandType = commandTypeCampaignRef(
				this.appStore?.graphqlStore.commandTypeCounts.get(commandTypeId)!
			);
		else this.selectedCommandType = undefined;

		if (beaconId || hostId || serverId) {
			this.appStore?.campaign.graph?.graphData.selectNodes(
				[(beaconId || hostId || this.selectedServer?.maybeCurrent?.serverHost?.id)!],
				false
			);
		} else {
			this.appStore?.campaign.graph?.graphData.clearSelection(false);
		}

		this.onHoverOut({ beacon: beaconId, host: hostId });
	}

	@modelAction onHover = ({
		beacon,
		host,
		server,
	}: {
		beacon?: string | null;
		host?: string | null;
		server?: string | null;
	}) => {
		if (beacon) {
			this.appStore?.campaign.graph?.graphData.previewNode(beacon);
		} else if (host) {
			this.appStore?.campaign.graph?.graphData.previewNode(host);
		} else if (server) {
			this.appStore?.campaign.graph?.graphData.previewNode(server);
		}

		if (beacon && this.appStore?.graphqlStore.beacons.has(beacon)) {
			this.hoveredBeacon = beaconCampaignRef(this.appStore.graphqlStore.beacons.get(beacon)!);
		}
		if (host && this.appStore?.graphqlStore.hosts.has(host)) {
			this.hoveredHost = hostCampaignRef(this.appStore.graphqlStore.hosts.get(host)!);
		}

		if (server && this.appStore?.graphqlStore.servers.has(server))
			this.hoveredServer = serverCampaignRef(this.appStore.graphqlStore.servers.get(server)!);
	};

	@modelAction onHoverOut({ beacon, host }: { beacon?: string | null; host?: string | null; server?: string | null }) {
		this.appStore?.campaign.graph?.graphData.clearPreview();
		if (
			this.hoveredHost?.current?.id === host ||
			(this.hoveredHost?.current?.id && !host) ||
			this.hoveredBeacon?.current?.id === beacon ||
			(this.hoveredBeacon?.current?.id && !beacon)
		) {
			this.hoveredHost = undefined;
			this.hoveredBeacon = undefined;
			this.hoveredServer = undefined;
		}
	}
}

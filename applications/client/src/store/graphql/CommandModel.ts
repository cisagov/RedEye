import { routes } from '@redeye/client/store';
import { computed } from 'mobx';
import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';
import type { Moment } from 'moment-timezone';
import type { UUID } from '../../types';
import { CampaignViews, Tabs } from '../../types';
import type { AppStore } from '../app-store';
import { CommandModelBase } from './CommandModel.base';
import { commandGroupsRef } from './RootStore.base';

/**
 * CommandModel
 */
@model('Command')
export class CommandModel extends ExtendedModel(CommandModelBase, {}) {
	minTime: Moment | undefined;
	maxTime: Moment | undefined;

	@computed get inputLog(): any {
		return this.input?.current;
	}

	@computed get hierarchy(): { command: string; beacon: string; host?: string; server?: string } {
		return {
			command: this.id,
			beacon: this.beacon.id,
			host: this.beacon.maybeCurrent?.hierarchy.host,
			server: this.beacon.maybeCurrent?.hierarchy.server,
		};
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				currentItem: 'beacon',
				currentItemId: this.hierarchy.beacon as UUID, // get beacon
				tab: Tabs.COMMANDS,
				activeItem: 'command',
				activeItemId: this.id as UUID,
			},
		});
	}

	@modelAction updateCurrentCommandGroups() {
		const appStore = getRoot<AppStore>(this);
		this.commandGroups?.forEach((cmG) => {
			appStore.campaign?.currentCommandGroups.set(cmG.id, commandGroupsRef(cmG.id));
		});
	}

	@computed get inputLine() {
		return this?.inputText && this?.input?.current?.blob?.split(`> ${this.inputText}`)?.[1];
	}

	@computed get outputLines() {
		return (
			this.output
				?.map((x) => x?.maybeCurrent?.blob ?? x?.maybeCurrent?.blob ?? '')
				.filter((x) => !!x)
				.reduce((a, b) => `${a}\n${b}`, '')
				.split('\n') ?? []
		);
	}

	@computed get uniqueAttackIds() {
		const attackIds: Set<string> = new Set();
		this?.attackIds?.forEach((attackId) => {
			attackIds.add(attackId);
		});

		return Array.from(attackIds);
	}

	@computed get info() {
		const appStore = getRoot<AppStore>(this);
		const time = appStore.settings.momentTz(this?.input?.current?.dateTime);
		const operator = formatOperatorName(this?.operator?.current.name || 'unknown');
		const server = this?.beacon?.current?.host?.current?.server?.displayName;
		const host = this?.beacon?.current?.host?.current?.displayName;
		const beaconName = this?.beacon?.current?.displayName;
		const beaconUser = this?.beacon?.current?.meta?.[0]?.maybeCurrent?.username;
		const beacon = [beaconName, beaconUser].join(' ');
		const contextArray = [time, operator, server, '/', host, '/', beacon];
		const contextTooltipText = contextArray.join(' ');

		const commandType = this?.inputText;
		const commandInput = this.inputLine;
		const commandTooltip = [commandType, commandInput].join(' ');

		return {
			time,
			operator,
			beacon,
			contextTooltipText,
			commandType,
			commandInput,
			commandTooltip,
			server,
			host,
			beaconName,
		};
	}
}

export function formatOperatorName(username?: string | null) {
	return `<${username}>`;
}

/* A graphql query fragment builders for CommandModel */
export { commandModelPrimitives, CommandModelSelector, selectFromCommand } from './CommandModel.base';

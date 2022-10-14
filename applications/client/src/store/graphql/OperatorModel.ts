import { TimeStatus } from '@redeye/client/types/timeline';
import type { ObservableMap } from 'mobx';
import { observable } from 'mobx';
import { ExtendedModel, getRoot, model, modelAction } from 'mobx-keystone';
import { Tabs } from '../../types';
import type { UUID } from '../../types/uuid';
import type { AppStore } from '../app-store';
import { OperatorModelBase } from './OperatorModel.base';
import type { BeaconModel } from './root';

/* A graphql query fragment builders for OperatorModel */
export { operatorModelPrimitives, OperatorModelSelector, selectFromOperator } from './OperatorModel.base';

/**
 * OperatorModel
 */
@model('Operator')
export class OperatorModel extends ExtendedModel(OperatorModelBase, {}) {
	get state(): TimeStatus {
		const appStore = getRoot<AppStore>(this);
		const currentTime = appStore.campaign?.timeline.scrubberTime?.valueOf() || 0;
		const endTime = new Date(this.endTime).valueOf();
		const startTime = new Date(this.startTime).valueOf();
		if (endTime < currentTime) {
			return TimeStatus.DEAD;
		} else if (endTime > currentTime && startTime < currentTime) {
			return TimeStatus.ALIVE;
		} else {
			return TimeStatus.FUTURE;
		}
	}
	get hierarchy() {
		return { operator: this.name };
	}

	get beacons(): ObservableMap<string, BeaconModel> {
		const appStore = getRoot<AppStore>(this);
		const beacons = observable.map();
		for (const b of this.beaconIds || []) beacons.set(b, appStore.graphqlStore.beacons.get(b));
		return beacons;
	}

	@modelAction select() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: appStore.router.currentRoute,
			params: {
				tab: Tabs.COMMANDS,
				currentItem: this.id !== appStore.campaign?.interactionState.selectedOperator?.id ? 'operator' : 'all',
				currentItemId: this.id !== appStore.campaign?.interactionState.selectedOperator?.id ? (this.id as UUID) : undefined,
			},
		});
	}

	@modelAction searchSelect() {
		const appStore = getRoot<AppStore>(this);
		appStore.router.updateRoute({
			path: appStore.router.currentRoute,
			params: {
				tab: Tabs.COMMANDS,
				currentItem: 'operator',
				currentItemId: this.id as UUID,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	}
}

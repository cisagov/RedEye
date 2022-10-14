import { isDefined } from '@redeye/client/components';
import { ExtendedModel, getRoot, model } from 'mobx-keystone';
import type { AppStore } from '../app-store';
import { PresentationCommandGroupModelBase } from './PresentationCommandGroupModel.base';
import type { BeaconModel } from './root';

/* A graphql query fragment builders for PresentationCommandGroupModel */
export {
	presentationCommandGroupModelPrimitives,
	PresentationCommandGroupModelSelector,
	selectFromPresentationCommandGroup,
} from './PresentationCommandGroupModel.base';

/**
 * PresentationCommandGroupModel
 */
@model('PresentationCommandGroup')
export class PresentationCommandGroupModel extends ExtendedModel(PresentationCommandGroupModelBase, {}) {
	get beacons(): Array<BeaconModel> {
		const appStore = getRoot<AppStore>(this);
		return this.beaconIds?.map((b) => appStore.graphqlStore.beacons.get(b)).filter<BeaconModel>(isDefined) ?? [];
	}
}

import { ExtendedModel, model, modelClass } from 'mobx-keystone';
import { RootStoreBase } from './RootStore.base';

@model('RootStore')
export class RootStore extends ExtendedModel(() => ({
	baseModel: modelClass<RootStoreBase>(RootStoreBase),
	props: {},
})) {}

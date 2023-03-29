import { ExtendedModel, model } from 'mobx-keystone';
import { RootStoreBase } from './RootStore.base';
@model('RootStore')
export class RootStore extends ExtendedModel(RootStoreBase, {}) {}

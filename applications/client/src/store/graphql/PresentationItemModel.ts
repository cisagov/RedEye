import { ExtendedModel, model } from 'mobx-keystone';
import { PresentationItemModelBase } from './PresentationItemModel.base';

/* A graphql query fragment builders for PresentationItemModel */
export {
	presentationItemModelPrimitives,
	PresentationItemModelSelector,
	selectFromPresentationItem,
} from './PresentationItemModel.base';

/**
 * PresentationItemModel
 */
@model('PresentationItem')
export class PresentationItemModel extends ExtendedModel(PresentationItemModelBase, {}) {}

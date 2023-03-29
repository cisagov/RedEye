import { ExtendedModel, model } from 'mobx-keystone';
import { CantHideEntitiesModelBase } from './CantHideEntitiesModel.base';

/* A graphql query fragment builders for CantHideEntitiesModel */
export {
	selectFromCantHideEntities,
	cantHideEntitiesModelPrimitives,
	CantHideEntitiesModelSelector,
} from './CantHideEntitiesModel.base';

/**
 * CantHideEntitiesModel
 */
@model('CantHideEntities')
export class CantHideEntitiesModel extends ExtendedModel(CantHideEntitiesModelBase, {}) {}

import { ExtendedModel, model } from 'mobx-keystone';
import { NonHidableEntitiesModelBase } from './NonHidableEntitiesModel.base';

/* A graphql query fragment builders for NonHidableEntitiesModel */
export {
	selectFromNonHidableEntities,
	nonHidableEntitiesModelPrimitives,
	NonHidableEntitiesModelSelector,
} from './NonHidableEntitiesModel.base';

/**
 * NonHidableEntitiesModel
 */
@model('NonHidableEntities')
export class NonHidableEntitiesModel extends ExtendedModel(NonHidableEntitiesModelBase, {}) {}

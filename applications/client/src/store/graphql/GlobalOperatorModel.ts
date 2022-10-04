import { ExtendedModel, model } from 'mobx-keystone';
import { GlobalOperatorModelBase } from './GlobalOperatorModel.base';

/* A graphql query fragment builders for GlobalOperatorModel */
export {
	globalOperatorModelPrimitives,
	GlobalOperatorModelSelector,
	selectFromGlobalOperator,
} from './GlobalOperatorModel.base';

/**
 * GlobalOperatorModel
 */
@model('GlobalOperator')
export class GlobalOperatorModel extends ExtendedModel(GlobalOperatorModelBase, {}) {}

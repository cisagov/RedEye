import { ExtendedModel, model } from 'mobx-keystone';
import { ParsingProgressModelBase } from './ParsingProgressModel.base';

/* A graphql query fragment builders for ParsingProgressModel */
export {
	parsingProgressModelPrimitives,
	ParsingProgressModelSelector,
	selectFromParsingProgress,
} from './ParsingProgressModel.base';

/**
 * ParsingProgressModel
 */
@model('ParsingProgress')
export class ParsingProgressModel extends ExtendedModel(ParsingProgressModelBase, {}) {}

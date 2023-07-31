import { ExtendedModel, model } from 'mobx-keystone';
import { ParserInfoModelBase } from './ParserInfoModel.base';

/* A graphql query fragment builders for ParserInfoModel */
export { selectFromParserInfo, parserInfoModelPrimitives, ParserInfoModelSelector } from './ParserInfoModel.base';

/**
 * ParserInfoModel
 */
@model('ParserInfo')
export class ParserInfoModel extends ExtendedModel(ParserInfoModelBase, {}) {}

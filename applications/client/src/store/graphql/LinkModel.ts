import { ExtendedModel, model } from 'mobx-keystone';
import { LinkModelBase } from './LinkModel.base';

/* A graphql query fragment builders for LinkModel */
export { linkModelPrimitives, LinkModelSelector, selectFromLink } from './LinkModel.base';

/**
 * LinkModel
 */
@model('Link')
export class LinkModel extends ExtendedModel(LinkModelBase, {}) {}

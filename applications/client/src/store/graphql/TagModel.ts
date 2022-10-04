import { ExtendedModel, model } from 'mobx-keystone';
import { TagModelBase } from './TagModel.base';

/* A graphql query fragment builders for TagModel */
export { selectFromTag, tagModelPrimitives, TagModelSelector } from './TagModel.base';

/**
 * TagModel
 */
@model('Tag')
export class TagModel extends ExtendedModel(TagModelBase, {}) {}

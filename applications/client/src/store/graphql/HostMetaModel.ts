import { ExtendedModel, model } from 'mobx-keystone';
import { HostMetaModelBase } from './HostMetaModel.base';

/* A graphql query fragment builders for HostMetaModel */
export { selectFromHostMeta, hostMetaModelPrimitives, HostMetaModelSelector } from './HostMetaModel.base';

/**
 * HostMetaModel
 */
@model('HostMeta')
export class HostMetaModel extends ExtendedModel(HostMetaModelBase, {}) {}

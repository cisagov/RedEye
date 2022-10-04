import { ExtendedModel, model } from 'mobx-keystone';
import { ServerMetaModelBase } from './ServerMetaModel.base';

/* A graphql query fragment builders for ServerMetaModel */
export { selectFromServerMeta, serverMetaModelPrimitives, ServerMetaModelSelector } from './ServerMetaModel.base';

/**
 * ServerMetaModel
 */
@model('ServerMeta')
export class ServerMetaModel extends ExtendedModel(ServerMetaModelBase, {}) {}

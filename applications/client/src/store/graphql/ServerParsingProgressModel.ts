import { ExtendedModel, model } from 'mobx-keystone';
import { ServerParsingProgressModelBase } from './ServerParsingProgressModel.base';

/* A graphql query fragment builders for ServerParsingProgressModel */
export {
	selectFromServerParsingProgress,
	serverParsingProgressModelPrimitives,
	ServerParsingProgressModelSelector,
} from './ServerParsingProgressModel.base';

/**
 * ServerParsingProgressModel
 */
@model('ServerParsingProgress')
export class ServerParsingProgressModel extends ExtendedModel(ServerParsingProgressModelBase, {}) {}

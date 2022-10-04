import { ExtendedModel, model } from 'mobx-keystone';
import { ImageModelBase } from './ImageModel.base';

/* A graphql query fragment builders for ImageModel */
export { imageModelPrimitives, ImageModelSelector, selectFromImage } from './ImageModel.base';

/**
 * ImageModel
 */
@model('Image')
export class ImageModel extends ExtendedModel(ImageModelBase, {}) {}

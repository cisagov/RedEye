import { ExtendedModel, model } from 'mobx-keystone';
import { UploadFormModelBase } from './UploadFormModel.base';

/* A graphql query fragment builders for UploadFormModel */
export { selectFromUploadForm, uploadFormModelPrimitives, UploadFormModelSelector } from './UploadFormModel.base';

/**
 * UploadFormModel
 */
@model('UploadForm')
export class UploadFormModel extends ExtendedModel(UploadFormModelBase, {}) {}

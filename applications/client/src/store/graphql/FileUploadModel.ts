import { ExtendedModel, model } from 'mobx-keystone';
import { FileUploadModelBase } from './FileUploadModel.base';

/* A graphql query fragment builders for FileUploadModel */
export { selectFromFileUpload, fileUploadModelPrimitives, FileUploadModelSelector } from './FileUploadModel.base';

/**
 * FileUploadModel
 */
@model('FileUpload')
export class FileUploadModel extends ExtendedModel(FileUploadModelBase, {}) {}

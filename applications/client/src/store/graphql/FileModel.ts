import { ExtendedModel, model } from 'mobx-keystone';
import { FileModelBase } from './FileModel.base';

/* A graphql query fragment builders for FileModel */
export { fileModelPrimitives, FileModelSelector, selectFromFile } from './FileModel.base';

/**
 * FileModel
 */
@model('File')
export class FileModel extends ExtendedModel(FileModelBase, {}) {}

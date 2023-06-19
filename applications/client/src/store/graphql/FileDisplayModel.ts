import { ExtendedModel, model } from 'mobx-keystone';
import { FileDisplayModelBase } from './FileDisplayModel.base';

/* A graphql query fragment builders for FileDisplayModel */
export { selectFromFileDisplay, fileDisplayModelPrimitives, FileDisplayModelSelector } from './FileDisplayModel.base';

/**
 * FileDisplayModel
 */
@model('FileDisplay')
export class FileDisplayModel extends ExtendedModel(FileDisplayModelBase, {}) {}

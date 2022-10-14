import { ExtendedModel, model } from 'mobx-keystone';
import { LogEntryModelBase } from './LogEntryModel.base';

/* A graphql query fragment builders for LogEntryModel */
export { logEntryModelPrimitives, LogEntryModelSelector, selectFromLogEntry } from './LogEntryModel.base';

/**
 * LogEntryModel
 */
@model('LogEntry')
export class LogEntryModel extends ExtendedModel(LogEntryModelBase, {}) {}

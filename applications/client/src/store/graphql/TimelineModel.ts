import { ExtendedModel, model } from 'mobx-keystone';
import { TimelineModelBase } from './TimelineModel.base';

/* A graphql query fragment builders for TimelineModel */
export { selectFromTimeline, timelineModelPrimitives, TimelineModelSelector } from './TimelineModel.base';

/**
 * TimelineModel
 */
@model('Timeline')
export class TimelineModel extends ExtendedModel(TimelineModelBase, {}) {}

import { ExtendedModel, model } from 'mobx-keystone';
import { TimelineCommandCountTupleModelBase } from './TimelineCommandCountTupleModel.base';

/* A graphql query fragment builders for TimelineCommandCountTupleModel */
export {
	selectFromTimelineCommandCountTuple,
	timelineCommandCountTupleModelPrimitives,
	TimelineCommandCountTupleModelSelector,
} from './TimelineCommandCountTupleModel.base';

/**
 * TimelineCommandCountTupleModel
 */
@model('TimelineCommandCountTuple')
export class TimelineCommandCountTupleModel extends ExtendedModel(TimelineCommandCountTupleModelBase, {}) {}

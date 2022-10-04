import { ExtendedModel, model } from 'mobx-keystone';
import { TimelineBucketModelBase } from './TimelineBucketModel.base';

/* A graphql query fragment builders for TimelineBucketModel */
export {
	selectFromTimelineBucket,
	timelineBucketModelPrimitives,
	TimelineBucketModelSelector,
} from './TimelineBucketModel.base';

/**
 * TimelineBucketModel
 */
@model('TimelineBucket')
export class TimelineBucketModel extends ExtendedModel(TimelineBucketModelBase, {}) {}

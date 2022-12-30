import type { AnnotationModel } from '@redeye/client/store';
import { computed, observable } from 'mobx';
import type { Ref } from 'mobx-keystone';
import { ExtendedModel, model } from 'mobx-keystone';
import type { Moment } from 'moment-timezone';
import { getMinMaxTime } from '../util/min-max-time';
import { CommandGroupModelBase } from './CommandGroupModel.base';

/* A graphql query fragment builders for CommandGroupModel */
export {
	commandGroupModelPrimitives,
	CommandGroupModelSelector,
	selectFromCommandGroup,
} from './CommandGroupModel.base';

/**
 * CommandGroupModel
 */
@model('CommandGroup')
export class CommandGroupModel extends ExtendedModel(CommandGroupModelBase, {}) {
	@observable minTime: Moment | undefined;
	@observable maxTime: Moment | undefined;

	@computed get minMaxTime() {
		this.annotations?.forEach?.((annotation: Ref<AnnotationModel>) => {
			if (annotation.maybeCurrent?.date) getMinMaxTime(this, annotation.maybeCurrent.date);
		});
		return {
			minTime: this.minTime,
			maxTime: this.maxTime,
		};
	}
}

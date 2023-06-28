import { Tabs } from '@redeye/client/types/explore';
import { reaction } from 'mobx';
import type { ObjectMap, Ref } from 'mobx-keystone';
import { ExtendedModel, model, modelAction, modelClass, objectMap, prop } from 'mobx-keystone';
import { computedFn } from 'mobx-utils';
import type { CommandModel } from '../graphql';
import { commandsRef } from '../graphql';
import { RedEyeModel } from '../util/model';

@model('CommentsStore')
export class CommentsStore extends ExtendedModel(() => ({
	baseModel: modelClass<RedEyeModel>(RedEyeModel),
	props: {
		commentsOpen: prop<string>('').withSetter(),
		commentGroupOpen: prop<string>('').withSetter(),
		annotationOpen: prop<string>('').withSetter(),
		groupSelect: prop<boolean>(false).withSetter(),
		newGroupComment: prop<boolean>(false).withSetter(),
		selectedCommands: prop<ObjectMap<Ref<CommandModel>>>(() => objectMap()),
		scrollToComment: prop<string | undefined>('').withSetter(),
	},
})) {
	protected onAttachedToRootStore(): (() => void) | void {
		return reaction(
			() => this.groupSelect,
			(curr) => {
				if (!curr) {
					this.clearSelectedCommand();
					this.setNewGroupComment(false);
				}
			}
		);
	}

	@modelAction addSelectedCommand(commandId: string) {
		if (this.appStore?.graphqlStore.commands.has(commandId))
			this.selectedCommands.set(commandId, commandsRef(this.appStore.graphqlStore.commands.get(commandId)!));
	}

	@modelAction removeSelectedCommand(commandId: string) {
		this.selectedCommands.delete(commandId);
	}

	@modelAction clearSelectedCommand() {
		this.selectedCommands.clear();
	}

	getCommandGroups = computedFn(() => {});

	@modelAction setSelectedCommentGroup(item: string, scrollOnly?: boolean) {
		if (!scrollOnly) {
			this.appStore?.campaign.setSelectedTab(Tabs.COMMENTS);
			this.commentsOpen = '';
		}
		this.scrollToComment = item;
	}

	@modelAction clearSelectedCommentGroup() {
		this.scrollToComment = '';
	}
}

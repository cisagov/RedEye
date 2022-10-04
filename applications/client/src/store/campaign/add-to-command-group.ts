import { computed } from 'mobx';
import { model, Model, modelAction, prop } from 'mobx-keystone';

@model('AddToCommandGroup')
export class AddToCommandGroup extends Model({
	commandId: prop<string | null>(null),
}) {
	@computed get isCommandSelected(): boolean {
		return !!this.commandId;
	}

	@modelAction openAddToCommandGroupDialog(commandId: string): void {
		this.commandId = commandId;
	}

	@modelAction closeAddToCommandGroupDialog(): void {
		this.commandId = null;
	}
}

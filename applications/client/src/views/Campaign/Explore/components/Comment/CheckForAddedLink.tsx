import type { LinkModel } from '@redeye/client/store';

// @Austin, this can't possibly be the right way to do things
export const getManualCommandLinks = (commandId?: string | null, links?: LinkModel[]) => {
	if (commandId == null || links == null) return [];
	return links
		.filter((link) => link.manual === true)
		.filter((link) => link.command?.id && link.command.id === commandId);
};

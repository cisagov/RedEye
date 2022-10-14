import type { UUID } from './uuid';

export type CurrentItem = 'beacon' | 'host' | 'server' | 'operator' | 'command' | 'command-type' | 'all';

export interface CurrentItemWithId {
	currentItem?: CurrentItem;
	currentItemId?: UUID | undefined;
}

export interface ActiveItemWithId {
	activeItem?: CurrentItem;
	activeItemId?: UUID | undefined;
}

export enum Views {
	LOGIN = 'login',
	CAMPAIGNS_LIST = 'campaigns',
	CAMPAIGN = 'campaign',
}

export enum CampaignViews {
	EXPLORE = 'explore',
	PRESENTATION = 'presentation',
	SEARCH = 'search',
}

interface CampaignParams {
	id: string;
	view: CampaignViews;
}

interface ExploreParams extends CampaignParams, CurrentItemWithId, ActiveItemWithId {
	tab?: string;
}

interface PresentationParams extends CampaignParams, CurrentItemWithId {
	presentation: string;
	slide?: string;
}

interface SearchParams extends CampaignParams {}

export type RouteParams = ExploreParams & PresentationParams & SearchParams;

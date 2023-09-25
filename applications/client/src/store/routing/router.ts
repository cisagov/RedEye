import type { RouteParams } from '@redeye/client/types/routing';
import { CampaignViews, Views } from '@redeye/client/types/routing';
import type { Location as UnknownStateLocation, Update } from 'history';
import { createHashHistory, History } from 'history';
import { observable } from 'mobx';
import { ExtendedModel, model, modelAction, prop } from 'mobx-keystone';
import { compile } from 'path-to-regexp';
import { createSearchParams } from 'react-router-dom';
import { Tabs } from '../../types';
import { uuidRegex } from '../../types/uuid';
import { RedEyeModel } from '../util/model';
import { matchUrl } from './match-url';

const itemParams = (key: string, idMatch: string) =>
	`:${key}(beacon|host|server|operator|command-type|command|all|comments_list)?{-:${key}Id(${idMatch})}?`;

const uuidOrAlphaNumIdRegex = `${uuidRegex}|[A-Za-z0-9\\-\\_\\(\\)\\:\\%\\.]+`;
const currentItemParams = itemParams('currentItem', uuidOrAlphaNumIdRegex);
const activeItemParams = itemParams('activeItem', uuidOrAlphaNumIdRegex);

const tabs = Object.values(Tabs).join('|');

export const RedEyeRoutes = {
	LOGIN: '/login',
	CAMPAIGNS_LIST: '/campaigns/:id',
	CAMPAIGN: '/campaign/:id',
	CAMPAIGN_EXPLORE: `${CampaignViews.EXPLORE}/:currentItem/:tab`,
	CAMPAIGN_PRESENTATION: `${CampaignViews.PRESENTATION}`,
	CAMPAIGN_PRESENTATION_SELECTED: ':presentation/:slide',
	CAMPAIGN_SEARCH: `${CampaignViews.SEARCH}`,
};

/**
 * URLs to actually match parameters - react-router removed a lot of utility in v6
 */
export const routes = {
	[Views.CAMPAIGN]: RedEyeRoutes.CAMPAIGN,
	[Views.CAMPAIGNS_LIST]: RedEyeRoutes.CAMPAIGNS_LIST,
	[CampaignViews.EXPLORE]: `${RedEyeRoutes.CAMPAIGN}/:view(${CampaignViews.EXPLORE})/${currentItemParams}/:tab(${tabs})?/${activeItemParams}`,
	[CampaignViews.PRESENTATION]: `${RedEyeRoutes.CAMPAIGN}/:view(${CampaignViews.PRESENTATION})/:presentation?/:slide?/${activeItemParams}`,
	[CampaignViews.SEARCH]: `${RedEyeRoutes.CAMPAIGN}/:view(${CampaignViews.SEARCH})`,
};

// history's location is not a generic and sets state as unknown
type Location = Omit<UnknownStateLocation, 'state'> & { state: { scrollKey?: number } };

@model('Router')
export class Router extends ExtendedModel(RedEyeModel, {
	params: prop<RouteParams>(() => ({} as RouteParams)).withSetter(),
	queryParams: prop<{ [key: string]: string }>(() => ({} as { [key: string]: string })).withSetter(),
	pathname: prop<string>(() => '').withSetter(),
	currentRoute: prop<string>(() => '').withSetter(),
}) {
	@observable history: History = createHashHistory({ window });
	@observable location: Location = this.history.location as Location;

	protected onAttachedToRootStore(): (() => void) | void {
		this.checkRoutes(this.history);
		this.history.listen((history) => this.checkRoutes(history));
	}

	/**
	 * Used by the history listener to check the current route and update params
	 * This is needed because react-router v6 removed optional params and regex matching
	 * @param {History | Update} history
	 */
	@modelAction checkRoutes = (history: History | Update) => {
		Object.values(routes).forEach((route) => {
			const params = matchUrl(decodeURI(history.location.pathname), route);
			if (params) {
				if (params.id && params.id !== this.params.id) this.appStore?.reset();
				this.location = history.location as Location;
				this.setPathname(history.location.pathname);
				this.setParams(params as any);
				this.setCurrentRoute(route);
				this.setQueryParams(
					Object.fromEntries(new URLSearchParams(decodeURIComponent(history.location.search)).entries())
				);
			}
		});
	};

	/**
	 * Push or replace state
	 * @param {string} path
	 * @param {boolean} replace
	 * @param {any} state
	 * @private
	 */
	@modelAction private setRoute({
		path,
		replace = false,
		state = {},
	}: {
		path: string;
		replace?: boolean;
		state: Location['state'];
	}) {
		const changeFunction = replace ? this.history.replace : this.history.push;
		changeFunction(path, state);
	}

	/**
	 * Update the route path
	 * @param {string} path
	 * @param {Partial<ExploreParams & PresentationParams & SearchParams>} params
	 * @param {{[p: string]: string | undefined}} queryParams
	 * @param {boolean} clear Clear all previous params and queryParams
	 * @param {boolean} replace Replace rather than push
	 */
	@modelAction updateRoute({
		path,
		params = {} as RouteParams,
		queryParams = {},
		clear = false,
		replace = false,
	}: {
		path: string;
		params?: Partial<RouteParams>;
		queryParams?: { [key: string]: string | undefined };
		clear?: boolean;
		replace?: boolean;
	}) {
		let newParams = clear
			? params
			: {
					...this.params,
					...params,
			  };
		newParams = Object.fromEntries(
			Object.entries(newParams).map(([key, value]) => [key, value ? encodeURIComponent(value) : value])
		);
		const toPath = compile(path, { encode: encodeURIComponent });
		this.setRoute({
			path: `${toPath(newParams)}${this.getQueryParams(queryParams, clear)}`,
			replace,
			state: {},
		});
	}

	/**
	 * Update just the query params
	 * @param {{[p: string]: string | undefined}} queryParams
	 * @param {boolean} clear
	 * @param {boolean} replace
	 */
	@modelAction updateQueryParams({
		queryParams = {},
		clear = false,
		replace = false,
	}: {
		queryParams: { [key: string]: string | undefined };
		clear?: boolean;
		replace?: boolean;
	}) {
		this.setRoute({
			path: `${this.pathname}${this.getQueryParams(queryParams, clear)}`,
			state: { ...this.location.state },
			replace,
		});
	}

	/**
	 * Replace the state of the current route - example: updating the scroll index
	 * @param {{[p: string]: any}} state
	 */
	@modelAction replaceState(state: { [key: string]: any }) {
		this.setRoute({
			path: `${this.pathname}${this.getQueryParams(this.queryParams)}`,
			state: {
				...this.location.state,
				...state,
			},
			replace: true,
		});
	}

	/**
	 * Get query params to append to the path
	 * @param {{[p: string]: string | undefined}} queryParams
	 * @param {boolean} clear
	 * @return {string}
	 */
	getQueryParams(queryParams: { [key: string]: string | undefined } = {}, clear?: boolean) {
		let newQueryParams = clear ? queryParams : { ...this.queryParams, ...queryParams };
		newQueryParams = Object.fromEntries(Object.entries(newQueryParams).filter(([, value]) => value !== undefined));
		return Object.keys(newQueryParams).length ? `?${createSearchParams(newQueryParams as any)}` : '';
	}
}

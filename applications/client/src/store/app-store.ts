import { QueryClient } from '@tanstack/react-query';
import { createHttpClient } from 'mk-gql';
import { reaction } from 'mobx';
import type { ObjectMap } from 'mobx-keystone';
import { detach, model, Model, modelAction, prop, registerRootStore } from 'mobx-keystone';
import { Auth } from './auth';
import { CampaignStore } from './campaign';
import type {
	BeaconModel,
	CommandModel,
	CommandTypeCountModel,
	HostModel,
	OperatorModel,
	ServerModel,
} from './graphql';
import { appRef, RootStore } from './graphql';
import { Router } from './routing/router';
import { Settings } from './settings';
import { campaignsQuery } from './util/cleaned-queries';

@model('AppStore')
export class AppStore extends Model({
	graphqlStore: prop<RootStore>(() => new RootStore({ enableCache: false })),
	campaign: prop<CampaignStore>(() => new CampaignStore({})),
	auth: prop<Auth>(() => new Auth({})),
	router: prop<Router>(() => new Router({})),
	settings: prop<Settings>(() => new Settings({})),
	appMeta: prop<{ blueTeam: boolean }>(() => ({ blueTeam: false })).withSetter(),
}) {
	queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});

	protected onAttachedToRootStore() {
		// Setup graphql store
		this.graphqlStore.middleWare = (resp: Promise<Response>) => {
			resp.catch((e) => {
				if (e.message.startsWith('Access denied! You need to be authorized to perform this action!'))
					this.auth.logOut();
				return e;
			});
		};

		fetch(`${this.auth.serverUrl}/api/appMetadata`, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
		})
			.then((res) => res.json())
			.then((value) => {
				this.setAppMeta(value);
			});

		this.graphqlStore.gqlHttpClient = createHttpClient(`${this.auth.serverUrl}/api/graphql`, {
			credentials: 'include',
		});

		// Get initial list of campaigns
		this.graphqlStore.queryCampaigns({}, campaignsQuery);

		return reaction(
			() => this.router.params.id,
			() => {
				this.reset();
				this.queryClient.getQueryCache().clear();
				this.queryClient.invalidateQueries();
			}
		);
	}

	@modelAction reset(withCampaign: boolean = true) {
		const detachAndClear = (item: ObjectMap<any>) => {
			item.clear();
		};

		if (withCampaign) {
			detach(this.campaign);
			this.campaign = new CampaignStore({ isLoading: '' });
		}
		detachAndClear(this.graphqlStore?.commands);
		detachAndClear(this.graphqlStore?.beacons);

		detachAndClear(this.graphqlStore?.servers);
		detachAndClear(this.graphqlStore?.links);
		detachAndClear(this.graphqlStore?.hosts);

		detachAndClear(this.graphqlStore?.commandGroups);
		detachAndClear(this.graphqlStore?.commandTypeCounts);
		detachAndClear(this.graphqlStore?.logEntries);
		detachAndClear(this.graphqlStore?.annotations);
		detachAndClear(this.graphqlStore?.tags);
		detachAndClear(this.graphqlStore?.operators);
	}
}

export const store = new AppStore({});
registerRootStore(store);

export const beaconCampaignRef = appRef<BeaconModel>(AppStore, 'Beacon', 'graphqlStore.beacons');
export const hostCampaignRef = appRef<HostModel>(AppStore, 'Host', 'graphqlStore.hosts');
export const serverCampaignRef = appRef<ServerModel>(AppStore, 'Server', 'graphqlStore.servers');
export const operatorCampaignRef = appRef<OperatorModel>(AppStore, 'Operator', 'graphqlStore.operators');
export const commandTypeCampaignRef = appRef<CommandTypeCountModel>(
	AppStore,
	'CommandTypeCount',
	'graphqlStore.commandTypeCounts'
);

export const commandCampaignRef = appRef<CommandModel>(AppStore, 'Command', 'graphqlStore.command');

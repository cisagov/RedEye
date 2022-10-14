// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'done.invoke.(machine).findCampaignData:invocation[0]': {
			type: 'done.invoke.(machine).findCampaignData:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.(machine).parsing:invocation[0]': {
			type: 'done.invoke.(machine).parsing:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).parsing:invocation[0]': {
			type: 'error.platform.(machine).parsing:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		findMetadata: 'done.invoke.(machine).findCampaignData:invocation[0]';
		parse: 'done.invoke.(machine).parsing:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingActions: {
		addCampaign: 'ADD_CAMPAIGN';
		addCampaignWhileParsing: 'ADD_CAMPAIGN';
		assignContext: 'ADD_CAMPAIGN';
		clearCurrentCampaign: 'done.invoke.(machine).findCampaignData:invocation[0]';
		popNextCampaign: 'done.invoke.(machine).findCampaignData:invocation[0]';
	};
	eventsCausingServices: {
		findMetadata: 'done.invoke.(machine).parsing:invocation[0]' | 'error.platform.(machine).parsing:invocation[0]';
		parse: 'ADD_CAMPAIGN' | 'done.invoke.(machine).findCampaignData:invocation[0]';
	};
	eventsCausingGuards: {
		queuedCampaignsEmpty: 'done.invoke.(machine).findCampaignData:invocation[0]';
	};
	eventsCausingDelays: {};
	matchesStates: 'findCampaignData' | 'idle' | 'parsing';
	tags: never;
}

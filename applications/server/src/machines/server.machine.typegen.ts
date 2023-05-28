// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]': {
			type: 'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]': {
			type: 'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.SERVER_MACHINE.moveBlueTeamDatabases:invocation[0]': {
			type: 'done.invoke.SERVER_MACHINE.moveBlueTeamDatabases:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.SERVER_MACHINE.initializeBlueHTTPServerService:invocation[0]': {
			type: 'error.platform.SERVER_MACHINE.initializeBlueHTTPServerService:invocation[0]';
			data: unknown;
		};
		'error.platform.SERVER_MACHINE.initializeHTTPServer:invocation[0]': {
			type: 'error.platform.SERVER_MACHINE.initializeHTTPServer:invocation[0]';
			data: unknown;
		};
		'error.platform.SERVER_MACHINE.loadDatabase:invocation[0]': {
			type: 'error.platform.SERVER_MACHINE.loadDatabase:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		createCacheService: 'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]';
		importLocalCampaignsDatabasesService: 'done.invoke.SERVER_MACHINE.moveBlueTeamDatabases:invocation[0]';
		migrateCampaignsService: 'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]';
		startBlueTeamHttpServerService: 'done.invoke.SERVER_MACHINE.initializeBlueHTTPServerService:invocation[0]';
		startHttpServerService: 'done.invoke.SERVER_MACHINE.initializeHTTPServer:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		delays: never;
		guards: never;
		services: never;
	};
	eventsCausingActions: {
		assignCacheManager: 'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]';
		cleanUp:
			| 'KILL_SERVICE'
			| 'error.platform.SERVER_MACHINE.initializeBlueHTTPServerService:invocation[0]'
			| 'error.platform.SERVER_MACHINE.initializeHTTPServer:invocation[0]'
			| 'error.platform.SERVER_MACHINE.loadDatabase:invocation[0]';
		spawnMessagingService: 'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]';
	};
	eventsCausingDelays: {};
	eventsCausingGuards: {
		isBlueTeam: 'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]';
	};
	eventsCausingServices: {
		createCacheService: 'xstate.init';
		importLocalCampaignsDatabasesService: 'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]';
		migrateCampaignsService: 'done.invoke.SERVER_MACHINE.loadDatabase:invocation[0]';
		startBlueTeamHttpServerService: 'done.invoke.SERVER_MACHINE.moveBlueTeamDatabases:invocation[0]';
		startHttpServerService: 'done.invoke.SERVER_MACHINE.migrateCampaigns:invocation[0]';
	};
	matchesStates:
		| 'critical_failure'
		| 'frozen'
		| 'initializeBlueHTTPServerService'
		| 'initializeHTTPServer'
		| 'loadDatabase'
		| 'migrateCampaigns'
		| 'moveBlueTeamDatabases'
		| 'ready';
	tags: never;
}

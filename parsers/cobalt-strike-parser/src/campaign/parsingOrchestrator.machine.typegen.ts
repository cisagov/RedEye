// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.stop': { type: 'xstate.stop' };
		'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]': {
			type: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]': {
			type: 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]';
			data: unknown;
		};
		'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]': {
			type: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]': {
			type: 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
			data: unknown;
		};
		'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]': {
			type: 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
		'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]': {
			type: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
	};
	invokeSrcNameMap: {
		entitiesIdentifyService: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]';
		entitiesPersistService: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
		linksParser: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingActions: {
		logTransition:
			| 'xstate.stop'
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]'
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'START'
			| 'PROCESS_SERVER_LOGS_DONE'
			| 'BEACON_CHILD_ACTOR_DONE'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
		unknownCriticalFailure:
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
		timestampPushEntitiesPhase:
			| 'xstate.stop'
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'xstate.init'
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]';
		saveRelationships: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
		removeSpawnLogIdentifiers: 'xstate.stop' | 'START' | 'PROCESS_SERVER_LOGS_DONE';
		timestampPushLogs:
			| 'xstate.stop'
			| 'START'
			| 'PROCESS_SERVER_LOGS_DONE'
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
		criticalFailureLogsPhase: 'START';
		sendLogIdentifierStart: 'START' | 'PROCESS_SERVER_LOGS_DONE';
		timestampPushCommands: 'xstate.stop' | 'START' | 'BEACON_CHILD_ACTOR_DONE' | 'PROCESS_SERVER_LOGS_DONE';
		criticalFailureNoBeaconsToParse: 'START';
		startFirstIdleBeaconActor: 'START' | 'BEACON_CHILD_ACTOR_DONE';
		updateTotalComputeTime: 'BEACON_CHILD_ACTOR_DONE';
		timestampPushLinks:
			| 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]'
			| 'BEACON_CHILD_ACTOR_DONE';
		timestampPushOrchestration: 'xstate.init';
		logEntryState: 'xstate.init';
		spawnAllLogParsers: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]';
		sendStart: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]' | 'PROCESS_SERVER_LOGS_DONE';
		spawnAllBeaconChildren: 'PROCESS_SERVER_LOGS_DONE';
		logFinalState: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
		logErrorFinalState:
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'START'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
		escalateErrors:
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesPersist:invocation[0]'
			| 'START'
			| 'error.platform.CAMPAIGN_PARSING_ORCHESTRATOR.identifyLinks:invocation[0]';
	};
	eventsCausingServices: {
		entitiesIdentifyService: 'xstate.init';
		entitiesPersistService: 'done.invoke.CAMPAIGN_PARSING_ORCHESTRATOR.entitiesIdentify:invocation[0]';
		linksParser: 'BEACON_CHILD_ACTOR_DONE';
	};
	eventsCausingGuards: {
		noLogIdentifiers: 'START';
		allLogIdentifiersActorsDone: 'PROCESS_SERVER_LOGS_DONE';
		allBeaconActorsDone: 'START' | 'BEACON_CHILD_ACTOR_DONE';
		canStartBeaconActor: 'BEACON_CHILD_ACTOR_DONE';
	};
	eventsCausingDelays: {};
	matchesStates:
		| 'entitiesIdentify'
		| 'entitiesPersist'
		| 'logsPhase'
		| 'commandsAndMetadataPhase'
		| 'identifyLinks'
		| 'done'
		| 'criticalFailure';
	tags: never;
}

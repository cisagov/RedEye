// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		timestampDatabaseDone: 'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
		assignOrm: 'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
		timestampParsingDone: 'done.invoke.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]';
		logEntryState: 'xstate.init';
		timestampStart: 'xstate.init';
		logTransition: 'xstate.init';
		logFinalState: 'xstate.init';
		logErrorFinalState: 'error.platform.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
	};
	internalEvents: {
		'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]': {
			type: 'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]': {
			type: 'done.invoke.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]': {
			type: 'error.platform.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
			data: unknown;
		};
		'error.platform.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]': {
			type: 'error.platform.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		databaseMachine: 'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
		parsingOrchestratorMachine: 'done.invoke.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]';
		closeOrm:
			| 'done.invoke.MAIN_CAMPAIGN_MACHINE.cleanup:invocation[0]'
			| 'done.invoke.MAIN_CAMPAIGN_MACHINE.criticalFailure:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {
		databaseMachine: 'xstate.init';
		parsingOrchestratorMachine: 'done.invoke.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]';
		closeOrm:
			| 'error.platform.MAIN_CAMPAIGN_MACHINE.connectingDb:invocation[0]'
			| 'done.invoke.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]'
			| 'error.platform.MAIN_CAMPAIGN_MACHINE.parsing:invocation[0]';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'connectingDb' | 'parsing' | 'cleanup' | 'criticalFailure' | 'done';
	tags: never;
}

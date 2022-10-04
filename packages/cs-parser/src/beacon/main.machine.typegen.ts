// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		assignOrm: 'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
		logDatabaseConnectionSuccess: 'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
		logDatabaseConnectionFailure: 'error.platform.MAIN_BEACON_MACHINE.connectingDb:invocation[0]' | 'FAILURE';
		logEntryState: 'xstate.init';
		logTransition: 'xstate.init';
		logFinalState: 'xstate.init';
		logErrorFinalState: 'xstate.init';
	};
	internalEvents: {
		'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]': {
			type: 'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.MAIN_BEACON_MACHINE.connectingDb:invocation[0]': {
			type: 'error.platform.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
			data: unknown;
		};
		'done.invoke.MAIN_BEACON_MACHINE.parsing:invocation[0]': {
			type: 'done.invoke.MAIN_BEACON_MACHINE.parsing:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		databaseMachine: 'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
		parsingOrchestratorMachine: 'done.invoke.MAIN_BEACON_MACHINE.parsing:invocation[0]';
		closeOrm:
			| 'done.invoke.MAIN_BEACON_MACHINE.cleanup:invocation[0]'
			| 'done.invoke.MAIN_BEACON_MACHINE.criticalFailure:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {
		databaseMachine: 'xstate.init';
		parsingOrchestratorMachine: 'done.invoke.MAIN_BEACON_MACHINE.connectingDb:invocation[0]';
		closeOrm:
			| 'error.platform.MAIN_BEACON_MACHINE.connectingDb:invocation[0]'
			| 'FAILURE'
			| 'done.invoke.MAIN_BEACON_MACHINE.parsing:invocation[0]';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'connectingDb' | 'parsing' | 'cleanup' | 'criticalFailure' | 'done';
	tags: never;
}

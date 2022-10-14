// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'done.invoke.(machine).fetchBeacon:invocation[0]': {
			type: 'done.invoke.(machine).fetchBeacon:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.(machine).findAllCommands:invocation[0]': {
			type: 'done.invoke.(machine).findAllCommands:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'done.invoke.(machine).findMetadata:invocation[0]': {
			type: 'done.invoke.(machine).findMetadata:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).fetchBeacon:invocation[0]': {
			type: 'error.platform.(machine).fetchBeacon:invocation[0]';
			data: unknown;
		};
		'error.platform.(machine).findAllCommands:invocation[0]': {
			type: 'error.platform.(machine).findAllCommands:invocation[0]';
			data: unknown;
		};
		'error.platform.(machine).findMetadata:invocation[0]': {
			type: 'error.platform.(machine).findMetadata:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
		'xstate.stop': { type: 'xstate.stop' };
	};
	invokeSrcNameMap: {
		fetchBeaconData: 'done.invoke.(machine).fetchBeacon:invocation[0]';
		findAllCommands: 'done.invoke.(machine).findAllCommands:invocation[0]';
		findAllMetadata: 'done.invoke.(machine).findMetadata:invocation[0]';
	};
	missingImplementations: {
		actions: 'logCriticalFailure';
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingActions: {
		assignBeacon: 'done.invoke.(machine).fetchBeacon:invocation[0]';
		logCriticalFailure:
			| 'error.platform.(machine).fetchBeacon:invocation[0]'
			| 'error.platform.(machine).findAllCommands:invocation[0]'
			| 'error.platform.(machine).findMetadata:invocation[0]';
		logEntryState: 'xstate.init';
		logErrorFinalState:
			| 'error.platform.(machine).fetchBeacon:invocation[0]'
			| 'error.platform.(machine).findAllCommands:invocation[0]'
			| 'error.platform.(machine).findMetadata:invocation[0]';
		logFinalState: 'done.invoke.(machine).findAllCommands:invocation[0]';
		logTransition:
			| 'done.invoke.(machine).fetchBeacon:invocation[0]'
			| 'done.invoke.(machine).findAllCommands:invocation[0]'
			| 'done.invoke.(machine).findMetadata:invocation[0]'
			| 'error.platform.(machine).fetchBeacon:invocation[0]'
			| 'error.platform.(machine).findAllCommands:invocation[0]'
			| 'error.platform.(machine).findMetadata:invocation[0]'
			| 'xstate.stop';
	};
	eventsCausingServices: {
		fetchBeaconData: 'xstate.init';
		findAllCommands: 'done.invoke.(machine).findMetadata:invocation[0]';
		findAllMetadata: 'done.invoke.(machine).fetchBeacon:invocation[0]';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'criticalFailure' | 'done' | 'fetchBeacon' | 'findAllCommands' | 'findMetadata';
	tags: never;
}

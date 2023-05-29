// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.stop': { type: 'xstate.stop' };
		'done.invoke.(machine).associateLogsWithBeacons:invocation[0]': {
			type: 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).associateLogsWithBeacons:invocation[0]': {
			type: 'error.platform.(machine).associateLogsWithBeacons:invocation[0]';
			data: unknown;
		};
		'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]': {
			type: 'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).persistBeaconLogsWithoutBeacons:invocation[0]': {
			type: 'error.platform.(machine).persistBeaconLogsWithoutBeacons:invocation[0]';
			data: unknown;
		};
		'done.invoke.(machine).persistBeaconLogs:invocation[0]': {
			type: 'done.invoke.(machine).persistBeaconLogs:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).persistBeaconLogs:invocation[0]': {
			type: 'error.platform.(machine).persistBeaconLogs:invocation[0]';
			data: unknown;
		};
		'done.invoke.(machine).persistKeystrokesLogs:invocation[0]': {
			type: 'done.invoke.(machine).persistKeystrokesLogs:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).persistKeystrokesLogs:invocation[0]': {
			type: 'error.platform.(machine).persistKeystrokesLogs:invocation[0]';
			data: unknown;
		};
		'done.invoke.(machine).persistImages:invocation[0]': {
			type: 'done.invoke.(machine).persistImages:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).persistImages:invocation[0]': {
			type: 'error.platform.(machine).persistImages:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
		'done.invoke.(machine).persistGenericLogs:invocation[0]': {
			type: 'done.invoke.(machine).persistGenericLogs:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'error.platform.(machine).persistGenericLogs:invocation[0]': {
			type: 'error.platform.(machine).persistGenericLogs:invocation[0]';
			data: unknown;
		};
	};
	invokeSrcNameMap: {
		parseFolderLogNames: 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]';
		persistBeaconLogWithoutBeacons: 'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]';
		persistAllBeaconLogLines: 'done.invoke.(machine).persistBeaconLogs:invocation[0]';
		persistKeystrokes: 'done.invoke.(machine).persistKeystrokesLogs:invocation[0]';
		persistImages: 'done.invoke.(machine).persistImages:invocation[0]';
		persistGenericLogs: 'done.invoke.(machine).persistGenericLogs:invocation[0]';
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
			| 'START'
			| 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]'
			| 'error.platform.(machine).associateLogsWithBeacons:invocation[0]'
			| 'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]'
			| 'error.platform.(machine).persistBeaconLogsWithoutBeacons:invocation[0]'
			| 'done.invoke.(machine).persistBeaconLogs:invocation[0]'
			| 'error.platform.(machine).persistBeaconLogs:invocation[0]'
			| 'done.invoke.(machine).persistKeystrokesLogs:invocation[0]'
			| 'error.platform.(machine).persistKeystrokesLogs:invocation[0]'
			| 'done.invoke.(machine).persistImages:invocation[0]'
			| 'error.platform.(machine).persistImages:invocation[0]';
		pushTimeStamp: 'xstate.stop' | 'START' | 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]';
		assignLogsIdentifyResults: 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]';
		updateBeaconPersistDuration:
			| 'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]'
			| 'done.invoke.(machine).persistBeaconLogs:invocation[0]';
		logEntryState: 'xstate.init';
		logFinalState: 'done.invoke.(machine).persistGenericLogs:invocation[0]';
		sendParentDone: 'done.invoke.(machine).persistGenericLogs:invocation[0]';
		logErrorFinalState:
			| 'error.platform.(machine).associateLogsWithBeacons:invocation[0]'
			| 'error.platform.(machine).persistBeaconLogsWithoutBeacons:invocation[0]'
			| 'error.platform.(machine).persistBeaconLogs:invocation[0]'
			| 'error.platform.(machine).persistKeystrokesLogs:invocation[0]'
			| 'error.platform.(machine).persistImages:invocation[0]'
			| 'error.platform.(machine).persistGenericLogs:invocation[0]';
	};
	eventsCausingServices: {
		parseFolderLogNames: 'START';
		persistBeaconLogWithoutBeacons: 'done.invoke.(machine).associateLogsWithBeacons:invocation[0]';
		persistAllBeaconLogLines: 'done.invoke.(machine).persistBeaconLogsWithoutBeacons:invocation[0]';
		persistKeystrokes: 'done.invoke.(machine).persistBeaconLogs:invocation[0]';
		persistImages: 'done.invoke.(machine).persistKeystrokesLogs:invocation[0]';
		persistGenericLogs: 'done.invoke.(machine).persistImages:invocation[0]';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates:
		| 'idle'
		| 'associateLogsWithBeacons'
		| 'persistBeaconLogsWithoutBeacons'
		| 'persistBeaconLogs'
		| 'persistKeystrokesLogs'
		| 'persistImages'
		| 'persistGenericLogs'
		| 'done'
		| 'criticalFailure';
	tags: never;
}

// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		setError: 'error.platform.ANONYMIZATION.anonymizing:invocation[0]' | 'SET_ERROR';
	};
	internalEvents: {
		'error.platform.ANONYMIZATION.anonymizing:invocation[0]': {
			type: 'error.platform.ANONYMIZATION.anonymizing:invocation[0]';
			data: unknown;
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		anonymizeService: 'done.invoke.ANONYMIZATION.anonymizing:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {
		anonymizeService: 'ANONYMIZE';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'idle' | 'anonymizing' | 'finished';
	tags: never;
}

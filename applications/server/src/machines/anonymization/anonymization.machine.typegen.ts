// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
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
	eventsCausingActions: {
		setError: 'error.platform.ANONYMIZATION.anonymizing:invocation[0]';
	};
	eventsCausingServices: {
		anonymizeService: 'ANONYMIZE';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'anonymizing' | 'finished' | 'idle';
	tags: never;
}

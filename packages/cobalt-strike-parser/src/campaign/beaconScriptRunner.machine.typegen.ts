// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	eventsCausingActions: {
		pushTimestamp: 'START';
		tellParentDone: 'done.invoke.(machine).running:invocation[0]';
	};
	internalEvents: {
		'done.invoke.(machine).running:invocation[0]': {
			type: 'done.invoke.(machine).running:invocation[0]';
			data: unknown;
			__tip: 'See the XState TS docs to learn how to strongly type this.';
		};
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		runScript: 'done.invoke.(machine).running:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingServices: {
		runScript: 'START';
	};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'idle' | 'running' | 'done';
	tags: never;
}

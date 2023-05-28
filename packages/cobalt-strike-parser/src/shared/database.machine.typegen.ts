// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		databaseCreate: 'done.invoke.(machine).creatingDatabase:invocation[0]';
		databaseConnect: 'done.invoke.(machine).connectingDatabase:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingActions: {
		sendStart: 'xstate.init';
	};
	eventsCausingServices: {
		databaseCreate: 'START';
		databaseConnect: 'START';
	};
	eventsCausingGuards: {
		databasePathDefined: 'START';
	};
	eventsCausingDelays: {};
	matchesStates: 'determine' | 'creatingDatabase' | 'connectingDatabase' | 'connected';
	tags: never;
}

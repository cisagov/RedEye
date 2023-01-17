// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {
		databaseConnect: 'done.invoke.(machine).connectingDatabase:invocation[0]';
		databaseCreate: 'done.invoke.(machine).creatingDatabase:invocation[0]';
	};
	missingImplementations: {
		actions: never;
		delays: never;
		guards: never;
		services: never;
	};
	eventsCausingActions: {
		sendStart: 'xstate.init';
	};
	eventsCausingDelays: {};
	eventsCausingGuards: {
		databasePathDefined: 'START';
	};
	eventsCausingServices: {
		databaseConnect: 'START';
		databaseCreate: 'START';
	};
	matchesStates: 'connected' | 'connectingDatabase' | 'creatingDatabase' | 'determine';
	tags: never;
}

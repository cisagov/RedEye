// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true;
	internalEvents: {
		'xstate.init': { type: 'xstate.init' };
	};
	invokeSrcNameMap: {};
	missingImplementations: {
		actions: never;
		services: never;
		guards: never;
		delays: never;
	};
	eventsCausingActions: {
		forwardParseMessage: 'PARSE_CAMPAIGN';
		spawnParsingMachine: 'xstate.init';
	};
	eventsCausingServices: {};
	eventsCausingGuards: {};
	eventsCausingDelays: {};
	matchesStates: 'idle';
	tags: never;
}

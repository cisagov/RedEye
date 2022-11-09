import { Field, InputType } from 'type-graphql';
import { assign, createMachine } from 'xstate';
import { anonymizeService } from './anonymize.service';

@InputType()
class FindReplaceInput {
	@Field(() => String, { defaultValue: '' })
	find: string = '';

	@Field(() => String, { defaultValue: '' })
	replace: string = '';
}

@InputType()
export class AnonymizationInput {
	@Field(() => Boolean, { defaultValue: false })
	removePasswordsHashes: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	removeHidden: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	removeKeystrokes: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	removeScreenshots: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	replaceUsernames: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	replaceHostnames: boolean = false;

	@Field(() => Boolean, { defaultValue: false })
	replaceDomainsAndIps: boolean = false;

	@Field(() => [FindReplaceInput])
	findReplace: FindReplaceInput[] = [];
}

export interface AnonymizationMachineContext extends AnonymizationInput {
	database: string;
	error?: string;
}

type AnonymizationMachineEvent = { type: 'ANONYMIZE' } | { type: 'SET_ERROR'; error: Error };

export const anonymizationMachine = createMachine(
	{
		id: 'ANONYMIZATION',
		tsTypes: {} as import('./anonymization.machine.typegen').Typegen0,
		schema: {
			context: {} as AnonymizationMachineContext,
			events: {} as AnonymizationMachineEvent,
		},
		initial: 'idle',
		states: {
			idle: {
				on: {
					ANONYMIZE: 'anonymizing',
				},
			},
			anonymizing: {
				invoke: {
					src: 'anonymizeService',
					onDone: {
						target: 'finished',
					},
					onError: {
						target: 'finished',
						actions: ['setError'],
					},
				},
				on: {
					SET_ERROR: {
						actions: ['setError'],
					},
				},
			},
			finished: {
				type: 'final',
			},
		},
	},
	{
		actions: {
			setError: assign((_, event) => ({
				error: 'error' in event ? event.error.message : undefined,
			})),
		},
		services: {
			anonymizeService,
		},
	}
);

import 'reflect-metadata';

import type { ActorRefFrom } from 'xstate';
import { actions, createMachine, spawn } from 'xstate';
import type { SpawnedParsingMachine } from './parser.machine';
import { parsingMachine } from './parser.machine';

import type { GraphQLContext } from '../types';
import type { ConfigDefinition } from '../config';

type MessengerMachineContext = {
	parsingMachine: SpawnedParsingMachine;
	config: ConfigDefinition;
};

type MessengerMachineEvents = { type: 'PARSE_CAMPAIGN'; campaignId: string; context: GraphQLContext };

export type SpawnedMessengerMachine = ActorRefFrom<typeof messengerMachine>;

export const messengerMachine = createMachine(
	{
		id: 'SERVER_MESSENGER',
		tsTypes: {} as import('./messenger.machine.typegen').Typegen0,
		schema: {
			context: {} as MessengerMachineContext,
			events: {} as MessengerMachineEvents,
		},
		initial: 'idle',
		states: {
			idle: {
				entry: 'spawnParsingMachine',
				on: {
					PARSE_CAMPAIGN: {
						actions: 'forwardParseMessage',
					},
				},
			},
		},
	},
	{
		actions: {
			spawnParsingMachine: actions.assign((ctx) => {
				const machine = spawn(
					parsingMachine.withContext({
						queuedCampaigns: [],
						currentCampaign: null,
						context: null,
						config: ctx.config,
					})
				);
				return { parsingMachine: machine };
			}),
			forwardParseMessage: actions.send(
				(_ctx, event) => ({
					type: 'ADD_CAMPAIGN',
					campaignId: event.campaignId,
					context: event.context,
				}),
				{ to: (ctx) => ctx.parsingMachine }
			),
		},
	}
);

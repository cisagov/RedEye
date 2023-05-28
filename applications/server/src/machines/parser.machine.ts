import { Campaign, ParsingStatus } from '@redeye/models';
import { actions, ActorRefFrom, createMachine } from 'xstate';
import { ConfigDefinition, DatabaseMode } from '../config';
import { getDatabaseFolderPath, getFullCampaignDbPath, getRuntimeDir } from '../util';
import { connectOrCreateDatabase } from './maindb.service';
import { updateProjectMetadata } from './updateProjectMetadata.service';
import { exec, execFile } from 'child_process';
import path from 'path';
import type { GraphQLContext } from '../types';
import { parserService } from './parser.service';

type ParserContext = {
	queuedCampaigns: { campaignId: string; parserName: string }[];
	currentCampaign: { campaignId: string; parserName: string } | null;
	config: ConfigDefinition;
	context: GraphQLContext | null;
};

type Events = { type: 'ADD_CAMPAIGN'; campaignId: string; context: GraphQLContext; parserName: string };

export type SpawnedParsingMachine = ActorRefFrom<typeof parsingMachine>;

const connectMainDb = (ctx: ParserContext) =>
	connectOrCreateDatabase({
		...ctx.config,
		databaseMode: ctx.config.production ? DatabaseMode.PRODUCTION : DatabaseMode.DEV_PERSIST,
	});

export const parsingMachine = createMachine(
	{
		tsTypes: {} as import('./parser.machine.typegen').Typegen0,
		schema: {
			context: {} as ParserContext,
			events: {} as Events,
			services: {} as {
				parse: { data: void };
				findMetadata: { data: void };
			},
		},
		initial: 'idle',
		states: {
			idle: {
				on: {
					ADD_CAMPAIGN: {
						target: 'parsing',
						actions: ['addCampaign', 'assignContext'],
					},
				},
			},
			parsing: {
				invoke: {
					src: 'parse',
					onDone: 'findCampaignData',
					onError: 'findCampaignData',
				},
				on: {
					ADD_CAMPAIGN: {
						actions: 'addCampaignWhileParsing',
					},
				},
			},
			findCampaignData: {
				invoke: {
					src: 'findMetadata',
					onDone: [
						{ cond: 'queuedCampaignsEmpty', target: 'idle', actions: 'clearCurrentCampaign' },
						{ target: 'parsing', actions: 'popNextCampaign' },
					],
					onError: [
						{ cond: 'queuedCampaignsEmpty', target: 'idle', actions: 'clearCurrentCampaign' },
						{ target: 'parsing', actions: 'popNextCampaign' },
					],
				},
				on: {
					ADD_CAMPAIGN: {
						actions: 'addCampaignWhileParsing',
					},
				},
			},
		},
	},
	{
		guards: {
			queuedCampaignsEmpty: (ctx) => ctx.queuedCampaigns.length === 0,
		},
		actions: {
			clearCurrentCampaign: actions.assign((_ctx) => {
				return { currentCampaign: null };
			}),
			popNextCampaign: actions.assign((ctx) => {
				const nextCampaign = ctx.queuedCampaigns.pop();
				if (nextCampaign) {
					connectMainDb(ctx).then((orm) =>
						orm.em.nativeUpdate(
							Campaign,
							{ id: nextCampaign.campaignId },
							{
								parsingStatus: ParsingStatus.PARSING_IN_PROGRESS,
							}
						)
					);
				}
				return { currentCampaign: nextCampaign };
			}),
			addCampaign: actions.assign((ctx, event) => {
				connectMainDb(ctx).then((orm) =>
					orm.em.nativeUpdate(
						Campaign,
						{ id: event.campaignId },
						{
							parsingStatus: ParsingStatus.PARSING_IN_PROGRESS,
						}
					)
				);
				return { currentCampaign: { campaignId: event.campaignId, parserName: event.parserName } };
			}),
			addCampaignWhileParsing: (ctx, event) => {
				connectMainDb(ctx).then((orm) =>
					orm.em.nativeUpdate(
						Campaign,
						{ id: event.campaignId },
						{
							parsingStatus: ParsingStatus.PARSING_QUEUED,
						}
					)
				);
				ctx.queuedCampaigns.push({ campaignId: event.campaignId, parserName: event.parserName });
			},
			assignContext: actions.assign((_ctx, event) => ({ context: event.context })),
		},
		services: {
			parse: (ctx) => {
				if (ctx.currentCampaign?.parserName === 'cobalt-strike-parser') {
					return invokeParsingScript({
						projectDatabasePath: getFullCampaignDbPath(
							ctx.currentCampaign?.campaignId as string,
							ctx.config.databaseMode
						),
						maxProcesses: ctx.config.maxParserSubprocesses,
						loggingFolderPath: getDatabaseFolderPath(
							ctx.currentCampaign?.campaignId as string,
							ctx.config.databaseMode
						),
					});
				} else {
					return parserService({
						parserName: ctx.currentCampaign?.parserName as string,
						projectDatabasePath: getFullCampaignDbPath(
							ctx.currentCampaign?.campaignId as string,
							ctx.config.databaseMode
						),
					});
				}
			},
			findMetadata: (ctx, event) => {
				const failure = event.type === 'error.platform.(machine).parsing:invocation[0]';
				return updateProjectMetadata(ctx.currentCampaign?.campaignId as string, ctx.context as GraphQLContext, failure);
			},
		},
	}
);

type ParsingScriptArgs = {
	projectDatabasePath: string;
	loggingFolderPath: string;
	maxProcesses: number;
};
const invokeParsingScript = ({ projectDatabasePath, loggingFolderPath, maxProcesses }: ParsingScriptArgs) => {
	return new Promise<void>((resolve, reject) => {
		const args = [`campaign`, `-d`, projectDatabasePath, `-p`, loggingFolderPath, `-t`, `${maxProcesses - 1}`];

		const execCallBack = (error: unknown, stdout: unknown, stderror: unknown) => {
			if (error || stderror) {
				console.debug('PARSING ERROR: error in exec callback', { error, stdout, stderror });
				reject();
			} else {
				console.debug('PARSING COMPLETE');
				resolve();
			}
		};
		try {
			if (process.pkg) {
				const baseCommand = path.resolve(getRuntimeDir(), 'parsers', 'cobalt-strike-parser');
				execFile(baseCommand, args, execCallBack);
			} else {
				exec(`cobalt-strike-parser ${args.join(' ')}`, execCallBack);
			}
		} catch (error) {
			console.debug('PARSING ERROR: throw in exec', error);
			reject();
		}
	});
};

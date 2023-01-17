// import { exec, execFile } from 'child_process';
import { actions, createMachine } from 'xstate';
// import path from 'path';
import prompts from 'prompts';
import fetch from 'node-fetch';
import type { LogLevel } from '../shared/commandOptions';
import { existsSync, unlink, stat, readFile } from 'fs-extra';
import path from 'path';
import { exec, execFile } from 'child_process';
import { getRuntimeDir, removeEmptyGuard } from '../shared/utils';
import { GraphQLClient } from 'graphql-request';
import { CAMPAIGNS, CAMPAIGN_CREATE, SERVERS, SERVER_FOLDER_CREATE, SERVER_UPDATE } from './requests';
import type {
	CAMPAIGNSQuery,
	CAMPAIGN_CREATEMutation,
	CAMPAIGN_CREATEMutationVariables,
	SERVERSQuery,
	SERVERSQueryVariables,
	SERVER_FOLDER_CREATEMutation,
	SERVER_FOLDER_CREATEMutationVariables,
	SERVER_UPDATEMutation,
	SERVER_UPDATEMutationVariables,
} from '../generated';
import { MikroORM } from '@mikro-orm/core';
import { getProjectMikroOrmConfig, Server } from '@redeye/models';
import FormData from 'form-data';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

type CampaignResult = { name: string; id: string; liveCampaign: boolean };
type CampaignServerData = { id: string; name: string; parsingPath: string; displayName: string };
type CampaignServerProperty = keyof CampaignServerData;
type CampaignServerUpdateObject = {
	parsingPath?: string;
	name?: string;
	displayName?: string;
};

const username = 'live-parsing-tool';

export type MainMachineContext = {
	serverAddress?: string;
	password?: string;
	maxChildProcesses: number;
	loggingFolderPath: string;
	logLevel: LogLevel;
	lastInvocationTime?: Date;
	parsingInterval: number;
	authToken?: string;
	cookie?: string;
	existingCampaignList?: CampaignResult[];
	campaignId?: string;
	campaignServers?: CampaignServerData[];
	client?: GraphQLClient;
	// only as an input
	folderPaths: string[];
	temporaryDatabasePath: string;
	orm?: MikroORM<BetterSqliteDriver>;
};

type Events = { type: 'KILL'; message: string };

enum SelectionOption {
	NEW = 'NEW',
	EXISTING = 'EXISTING',
	RESTART = 'RESTART',
	EXIT = 'EXIT',
	EDIT = 'EDIT',
	CONFIRM = 'CONFIRM',
}

const onlyLiveParsedCampaigns = (campaigns: CampaignResult[] = []) =>
	campaigns.filter(({ liveCampaign }) => liveCampaign);

export const mainMachine = createMachine(
	{
		tsTypes: {} as import('./main.machine.typegen').Typegen0,
		schema: {
			context: {} as MainMachineContext,
			events: {} as Events,
			services: {} as {
				runScript: { data: void };
				checkServerConnection: { data: void };
				promptServerAddress: { data: string };
				promptPassword: { data: string };
				// data is the token
				checkPassword: { data: { token: string; cookie: string } };
				fetchCampaignList: { data: CampaignResult[] };
				fetchFullCampaign: { data: unknown };
				fetchCampaignServers: { data: CampaignServerData[] };
				promptNewOrExistingCampaign: { data: SelectionOption.NEW | SelectionOption.EXISTING };
				// data is the campaign id
				promptWhichExistingCampaign: { data: string };
				promptCampaignActionSelection: {
					data: SelectionOption.NEW | SelectionOption.EXISTING | SelectionOption.EXIT | SelectionOption.RESTART;
				};
				promptFolderActionSelection: {
					data: SelectionOption.NEW | SelectionOption.EDIT | SelectionOption.EXIT | SelectionOption.CONFIRM;
				};
				promptCampaignName: { data: string };
				// data is the campaign id
				postNewCampaign: { data: string };
				promptFolderPath: { data: { path: string; id: string | undefined } };
				// data is server id
				promptServerFolderToEdit: { data: string };
				promptForServerToCreate: { data: { path: string; id: string | undefined; name: string } };
				persistServer: { data: SERVER_FOLDER_CREATEMutation['serverFolderCreate'] };
				editServerProperty: { data: { id: string; update: CampaignServerUpdateObject } };
				prepopulateDatabase: { data: MikroORM<BetterSqliteDriver> };
				runParser: { data: any };
				uploadResults: { data: void };
			},
		},
		id: 'Live Parsing Machine',
		description:
			'The main live parsing machine performs several functions. It walks a user through authenticating with a server, choosing or creating desired compaing, invoking the parser machine on a separate thread, and then if there is an existing parsing result of parsing, resolves the conflicts between them to a new database and uploads the result',
		initial: 'authenticating',
		on: {
			KILL: {
				target: '.cleanup',
			},
		},
		states: {
			authenticating: {
				description:
					'In the `authenticating` state, the primary goal is to successfully connect to the server and save the authentication token',
				initial: 'checkingServerAddress',
				states: {
					checkingServerAddress: {
						invoke: {
							src: 'checkServerConnection',
							onDone: [
								{
									target: 'promptingPassword',
								},
							],
							onError: [
								{
									target: 'promptingServerAddress',
								},
							],
						},
					},
					promptingServerAddress: {
						invoke: {
							src: 'promptServerAddress',
							onDone: [
								{
									actions: 'assignServerAddress',
									target: 'checkingServerAddress',
								},
							],
							onError: [
								{
									target: 'canceled',
								},
							],
						},
					},
					promptingPassword: {
						invoke: {
							src: 'promptPassword',
							onDone: [
								{
									actions: 'setPassword',
									target: 'checkingPassword',
								},
							],
							onError: [
								{
									target: 'canceled',
								},
							],
						},
					},
					checkingPassword: {
						invoke: {
							src: 'checkPassword',
							onDone: [
								{
									actions: 'setAuthTokens',
									target: 'done',
								},
							],
							onError: [
								{
									target: 'promptingPassword',
								},
							],
						},
					},
					canceled: {
						entry: 'cancelAuth',
					},
					done: {
						type: 'final',
					},
				},
				onDone: {
					target: 'campaignSelection',
				},
			},
			campaignSelection: {
				description:
					'The purpose of `campaignSelection` state is to either create a new campaign or create a new one to live parse',
				initial: 'fetchingCampaignList',
				states: {
					fetchingCampaignList: {
						invoke: {
							src: 'fetchCampaignList',
							onDone: [
								{
									actions: 'assignExistingCampaignList',
									cond: 'parsableExistingCampaignsExist',
									target: 'promptingNewOrExisting',
								},
								{
									actions: 'assignExistingCampaignList',
									target: 'promptingCampaignName',
								},
							],
						},
					},
					promptingNewOrExisting: {
						invoke: {
							src: 'promptNewOrExistingCampaign',
							onDone: [
								{
									cond: 'selectionOptionNew',
									target: 'promptingCampaignName',
								},
								{
									cond: 'selectionOptionExisting',
									target: 'selectingExistingCampaign',
								},
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					selectingExistingCampaign: {
						invoke: {
							src: 'promptWhichExistingCampaign',
							onDone: [
								{
									actions: 'assignCampaignId',
									cond: 'eventDataDefined',
									target: 'done',
								},
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					promptingCampaignName: {
						invoke: {
							src: 'promptCampaignName',
							onDone: [
								{
									target: 'creatingNewCampaign',
								},
							],
							onError: [
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					creatingNewCampaign: {
						invoke: {
							src: 'postNewCampaign',
							onDone: [
								{
									actions: 'assignCampaignId',
									target: 'done',
								},
							],
							onError: [
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					promptingNextAction: {
						description: 'reselect what state you would like to retry',
						invoke: {
							src: 'promptCampaignActionSelection',
							onDone: [
								{
									cond: 'selectionOptionExit',
									target: 'canceled',
								},
								{
									cond: 'selectionOptionRestart',
									target: 'fetchingCampaignList',
								},
								{
									cond: 'selectionOptionNew',
									target: 'creatingNewCampaign',
								},
								{
									cond: 'selectionOptionExisting',
									target: 'selectingExistingCampaign',
								},
								{
									target: 'canceled',
								},
							],
						},
					},
					canceled: {
						entry: 'cancelCampaignConnection',
					},
					done: {
						type: 'final',
					},
				},
				onDone: {
					target: 'chooseParsingFolders',
				},
			},
			chooseParsingFolders: {
				description: 'The purpose of the `chooseParsingFolders` state is to add, delete, and modify parsing folders.',
				initial: 'fetchingCampaignServers',
				states: {
					fetchingCampaignServers: {
						invoke: {
							src: 'fetchCampaignServers',
							onDone: [
								{
									actions: 'assignFullCampaign',
									cond: 'containsCampaignServers',
									target: 'promptingNextAction',
								},
								{
									actions: 'assignFullCampaign',
									target: 'promptingForServerToCreate',
								},
							],
						},
					},
					promptingNextAction: {
						description: 'reselect what state you would like to retry',
						invoke: {
							src: 'promptFolderActionSelection',
							onDone: [
								{
									cond: 'selectionOptionConfirm',
									target: 'done',
								},
								{
									cond: 'selectionOptionNew',
									target: 'promptingForServerToCreate',
								},
								{
									cond: 'selectionOptionEdit',
									target: 'promptingForServerToEdit',
								},
								{
									cond: 'selectionOptionExit',
									target: 'canceled',
								},
								{
									target: 'canceled',
								},
							],
						},
					},
					promptingForServerToCreate: {
						invoke: {
							src: 'promptForServerToCreate',
							onDone: [
								{
									target: 'persistingServer',
								},
							],
							onError: [
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					promptingForServerToEdit: {
						invoke: {
							src: 'promptServerFolderToEdit',
							onDone: [
								{
									target: 'editingServerFolderProperty',
								},
							],
							onError: [
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					editingServerFolderProperty: {
						invoke: {
							src: 'editServerProperty',
							onDone: [
								{
									target: 'updatingServer',
								},
							],
							onError: [
								{
									target: 'promptingNextAction',
								},
							],
						},
					},
					updatingServer: {
						invoke: {
							src: 'updateServer',
							onDone: [
								{
									target: 'fetchingCampaignServers',
								},
							],
						},
					},
					persistingServer: {
						invoke: {
							src: 'persistServer',
							onDone: [
								{
									target: 'fetchingCampaignServers',
								},
							],
						},
					},
					canceled: {
						entry: 'cancelAuth',
					},
					done: {
						type: 'final',
					},
				},
				onDone: {
					target: 'liveParsing',
				},
			},
			liveParsing: {
				initial: 'idle',
				states: {
					idle: {
						after: {
							IDLE_DELAY: {
								actions: 'setLastInvocationTime',
								target: 'prepopulatingDatabase',
							},
						},
					},
					prepopulatingDatabase: {
						invoke: {
							src: 'prepopulateDatabase',
							onDone: { target: 'running', actions: 'assignOrm' },
						},
					},
					running: {
						invoke: {
							src: 'runParser',
							onDone: 'uploadingResults',
						},
					},
					uploadingResults: {
						invoke: {
							src: 'uploadResults',
							onDone: { target: 'idle', actions: 'cleanOrm' },
							onError: { target: 'idle', actions: 'cleanOrm' },
						},
					},
				},
			},
			cleanup: {
				type: 'final',
			},
		},
	},
	{
		actions: {
			setLastInvocationTime: actions.assign((_ctx) => ({ lastInvocationTime: new Date() })),
			setPassword: actions.assign((_ctx, event) => ({ password: event.data })),
			setAuthTokens: actions.assign((ctx, event) => ({
				authToken: event.data.token,
				cookie: event.data.cookie,
				client: new GraphQLClient(`${ctx.serverAddress}/api/graphql`, {
					credentials: 'include',
					headers: { cookie: event.data.cookie },
				}),
			})),
			assignServerAddress: actions.assign((_ctx, event) => ({ serverAddress: event.data })),
			assignCampaignId: actions.assign((_ctx, event) => ({ campaignId: event.data })),
			assignExistingCampaignList: actions.assign((_ctx, event) => ({ existingCampaignList: event.data })),
			assignFullCampaign: actions.assign((_ctx, event) => ({ campaignServers: event.data })),
			assignOrm: actions.assign((_ctx, event) => ({ orm: event.data })),
			cancelAuth: actions.send({ type: 'KILL', message: 'authentication canceled' }),
			cancelCampaignConnection: actions.send({ type: 'KILL', message: 'campaign connection canceled' }),
			cleanOrm: actions.assign((_ctx) => ({ orm: undefined })),
		},
		services: {
			promptServerAddress: async (ctx): Promise<string> => {
				const { protocol } = await prompts({
					type: 'select',
					name: 'protocol',
					message: ctx.serverAddress ? `${ctx.serverAddress} could not be reached; enter a protocol` : `enter a protocol`,
					choices: [
						{ title: 'http', value: 'http' },
						{ title: 'https', value: 'https' },
						{ title: 'CANCEL', value: 'EXIT' },
					],
				});

				if (protocol === 'EXIT') return Promise.reject();

				const { address } = await prompts({
					type: 'text',
					name: 'address',
					message: `${protocol}://`,
				});
				return protocol + '://' + address;
			},
			promptPassword: async () => {
				const { password } = await prompts({
					type: 'password',
					name: 'password',
					message: 'Type password and press return',
				});

				if (password === undefined) return Promise.reject();

				return password;
			},
			promptNewOrExistingCampaign: async (ctx) => {
				const { selection } = await prompts({
					type: 'select',
					name: 'selection',
					message: 'Choose campaign selection method',
					choices: [
						{ title: 'Create new campaign', value: SelectionOption.NEW },
						{
							title: 'Resume existing campaign',
							value: SelectionOption.EXISTING,
							disabled: onlyLiveParsedCampaigns(ctx.existingCampaignList).length === 0,
						},
					],
				});

				return selection;
			},
			promptWhichExistingCampaign: async (ctx) => {
				const { campaign } = await prompts({
					type: 'select',
					name: 'campaign',
					message: 'select desired campaign',
					hint: 'Ineligible campaigns removed',
					choices: onlyLiveParsedCampaigns(ctx.existingCampaignList).map((el) => ({
						title: el.name,
						value: el.id,
					})),
				});
				return campaign;
			},
			promptCampaignActionSelection: async (ctx) => {
				const { selection } = await prompts({
					type: 'select',
					name: 'selection',
					message: 'select desired campaign',
					choices: [
						{ title: 'quit', value: SelectionOption.EXIT },
						{ title: 'check for more campaigns', value: SelectionOption.RESTART },
						{ title: 'create new campaign', value: SelectionOption.NEW },
						{
							title: 'resume existing campaign',
							disabled: onlyLiveParsedCampaigns(ctx.existingCampaignList).length === 0,
							value: SelectionOption.EXISTING,
						},
					],
				});

				return selection;
			},

			promptCampaignName: async (ctx) => {
				const { campaignName } = await prompts({
					type: 'text',
					name: 'campaignName',
					message: 'Name your new campaign',
					validate: (prev: string) => {
						return !ctx.existingCampaignList?.find(({ name }) => name === prev)
							? true
							: `campaign name must be unique, existing campaigns: ${ctx.existingCampaignList
									.map(({ name }) => `\n\t- ${name}`)
									.join('')}
            `;
					},
				});
				if (!campaignName) return Promise.reject();
				return campaignName;
			},
			// API requests
			checkServerConnection: async (ctx, _event): Promise<void> => {
				if (!ctx.serverAddress) return Promise.reject();
				try {
					const res = await fetch(`${ctx.serverAddress}/api/health`);
					await res.json();
					return;
				} catch {
					return Promise.reject();
				}
			},
			checkPassword: async (ctx, _event): Promise<{ token: string; cookie: string }> => {
				try {
					const response = await fetch(`${ctx.serverAddress}/api/login`, {
						method: 'POST',
						body: JSON.stringify({ password: ctx.password }),
						headers: { 'Content-Type': 'application/json' },
					});
					const cookie = response.headers.get('set-cookie') as string;
					const data: { auth: boolean; token?: string } = await response.json();

					if (!data || !data.auth) return Promise.reject();

					const response2 = await fetch(`${ctx.serverAddress}/api/loginStatus`, {
						method: 'GET',
						headers: { 'Content-Type': 'application/json', Cookie: cookie },
					});
					const data2 = await response2.json();
					if (!data2.auth) Promise.reject();

					if (data.auth && data.token) return { token: data.token, cookie };
					return Promise.reject();
				} catch {
					return Promise.reject();
				}
			},
			promptFolderActionSelection: async (ctx) => {
				const servers = ctx.campaignServers ?? [];
				const containsServers = servers.length > 0;
				const { selection } = await prompts({
					type: 'select',
					name: 'selection',
					message: 'Select desired action',
					choices: [
						{
							title: 'Confirm server folders and parse',
							value: SelectionOption.CONFIRM,
							disabled: !(allFoldersValidForParsing(servers) && containsServers),
						},
						{ title: 'Edit existing parsing folder', value: SelectionOption.EDIT, disabled: !containsServers },
						{ title: 'Create new parsing folder', value: SelectionOption.NEW },
						{ title: 'quit', value: SelectionOption.EXIT },
					],
				});
				return selection;
			},
			promptForServerToCreate: async (): Promise<{ name: string; path: string; id: undefined }> => {
				const path = await promptForFolderPath();
				if (!path) return Promise.reject();
				const pathNames = path.split('/');

				const tempName = pathNames[pathNames.length - 1];

				const { name } = await prompts({
					type: 'text',
					name: 'name',
					message: 'Enter a name for the server',
					initial: tempName,
					// TODO: validate name isn't a duplicate
				});
				if (!name) return Promise.reject();
				return { path, name: name as string, id: undefined };
			},

			promptServerFolderToEdit: async (ctx) => {
				const { serverId } = await prompts({
					type: 'select',
					name: 'serverId',
					message: 'Select server logs to edit',
					choices: ctx.campaignServers?.map((e) => ({
						title: e.parsingPath,
						value: e.id,
					})),
				});
				if (!serverId) Promise.reject();
				return serverId;
			},
			editServerProperty: async (ctx, event): Promise<{ id: string; update: CampaignServerUpdateObject }> => {
				const serverId = event.data;
				const res = await prompts({
					type: 'select',
					name: 'property',
					message: 'Select server folder property to change',
					choices: [
						{ title: 'Display Name', value: 'displayName' },
						{ title: 'Name', value: 'name' },
						{ title: 'Parsing Path', value: 'parsingPath' },
					],
				});
				const property = res.property as CampaignServerProperty;
				if (!property) return Promise.reject();
				const server = ctx.campaignServers?.find(({ id }) => id === serverId);
				const currentValue = server?.[property];

				let newValue: string | undefined;
				if (property === 'parsingPath') {
					newValue = await promptForFolderPath(currentValue);
				} else {
					const { value } = await prompts({
						type: 'text',
						initial: currentValue,
						name: 'value',
						message: `editing server ${property}`,
					});

					newValue = value;
				}
				if (!newValue) return Promise.reject();

				return { id: serverId, update: { [property]: newValue } };
			},

			// API requests
			fetchCampaignList: async (ctx): Promise<CampaignResult[]> => {
				try {
					const data = await ctx.client?.request<CAMPAIGNSQuery>(CAMPAIGNS);
					if (data?.campaigns) return data.campaigns.filter(removeEmptyGuard);
				} catch {}
				return Promise.reject();
			},
			postNewCampaign: async (ctx, event): Promise<string> => {
				try {
					const campaignName = event.data;
					const data = await ctx.client?.request<CAMPAIGN_CREATEMutation, CAMPAIGN_CREATEMutationVariables>(
						CAMPAIGN_CREATE,
						{ creatorName: username, campaignName }
					);

					if (data?.createCampaign.id) return data.createCampaign.id;
				} catch {}
				// TODO: Branch based on type of failure
				return Promise.reject();
			},
			fetchCampaignServers: async (ctx): Promise<CampaignServerData[]> => {
				try {
					const data = await ctx.client?.request<SERVERSQuery, SERVERSQueryVariables>(SERVERS, {
						campaignId: ctx.campaignId as string,
						username,
					});

					if (data?.servers) return data.servers.filter(removeEmptyGuard);
				} catch {}
				return Promise.reject();
			},
			persistServer: async (ctx, event): Promise<SERVER_FOLDER_CREATEMutation['serverFolderCreate']> => {
				try {
					const data = await ctx.client?.request<SERVER_FOLDER_CREATEMutation, SERVER_FOLDER_CREATEMutationVariables>(
						SERVER_FOLDER_CREATE,
						{ campaignId: ctx.campaignId as string, name: event.data.name, path: event.data.path }
					);

					if (data?.serverFolderCreate) return data?.serverFolderCreate;
				} catch {}
				return Promise.reject();
			},
			updateServer: async (ctx, event) => {
				try {
					const data = await ctx.client?.request<SERVER_UPDATEMutation, SERVER_UPDATEMutationVariables>(SERVER_UPDATE, {
						campaignId: ctx.campaignId as string,
						serverId: event.data.id,
						input: event.data.update,
					});

					if (data?.serverUpdate) return data.serverUpdate;
				} catch {}
				return Promise.reject();
			},
			prepopulateDatabase: async (ctx): Promise<MikroORM<BetterSqliteDriver>> => {
				const { campaignServers = [], temporaryDatabasePath } = ctx;
				if (existsSync(temporaryDatabasePath)) {
					console.debug('Deleting existing database');
					await unlink(temporaryDatabasePath);
				}

				const orm = await MikroORM.init(getProjectMikroOrmConfig(ctx.temporaryDatabasePath));

				const generator = orm.getSchemaGenerator();
				await generator.dropSchema();
				await generator.createSchema();
				await generator.updateSchema();

				const em = await orm.em.fork();

				const promises = campaignServers.map(({ name, displayName, parsingPath }) => {
					const newServer = new Server({ name, displayName, parsingPath });
					return em.nativeInsert(newServer);
				});

				await Promise.all(promises);
				return orm;
			},
			runParser: async (ctx) => {
				return new Promise<void>((resolve) => {
					const args: string[] = ['campaign', '-p', ctx.loggingFolderPath, '-d', ctx.temporaryDatabasePath];

					const execCallback = (error: unknown, stdout: unknown, stderror: unknown) => {
						console.debug({ error, stdout, stderror });
						resolve();
					};
					if (process.pkg) {
						const command = `${path.resolve(getRuntimeDir(), 'cs-parser')}`;

						execFile(command, [process.argv[1], ...args], execCallback);
					} else {
						const command = `redeye-cs-parser ${args.join(' ')}`;

						exec(command, execCallback);
					}

					return;
				});
			},
			uploadResults: async (ctx): Promise<void> => {
				console.debug('uploading results');
				try {
					await ctx.orm!.em.getDriver().execute('PRAGMA wal_checkpoint');
					await ctx.orm?.close(true);
					const form = new FormData();

					const fileBuffer = await readFile(ctx.temporaryDatabasePath);
					const stats = await stat(ctx.temporaryDatabasePath);
					form.append('file', fileBuffer, {
						filename: `temporary.redeye`,
						knownLength: stats.size,
					});

					const res = await fetch(`${ctx.serverAddress}/api/liveCampaign/upload/${ctx.campaignId}`, {
						method: 'POST',
						headers: {
							Cookie: ctx.cookie as string,
							// 'Content-Type': 'multipart/form-data'
						},
						body: form,
					});

					console.debug(res.status, res.statusText);
				} catch (e) {
					console.error(e);
					return Promise.reject();
				}
				return;
			},
		},

		guards: {
			eventDataDefined: (_ctx, event) => !!event.data,
			parsableExistingCampaignsExist: (_ctx, event) => !!onlyLiveParsedCampaigns(event.data).length,
			containsCampaignServers: (_ctx, event) => event.data.length > 0,

			// Selection options
			selectionOptionNew: (_ctx, event) => event.data === SelectionOption.NEW,
			selectionOptionExisting: (_ctx, event) => event.data === SelectionOption.EXISTING,
			selectionOptionExit: (_ctx, event) => event.data === SelectionOption.EXIT,
			selectionOptionRestart: (_ctx, event) => event.data === SelectionOption.RESTART,
			selectionOptionEdit: (_ctx, event) => event.data === SelectionOption.EDIT,
			selectionOptionConfirm: (_ctx, event) => event.data === SelectionOption.CONFIRM,
		},
		delays: {
			IDLE_DELAY: (ctx) => {
				// if this is the first time parsing, parse immediately
				if (!ctx.lastInvocationTime) return 1;
				// minimum ms time between parsing invocations
				const intervalMs = ctx.parsingInterval * 60 * 1000;
				const now = Date.now();
				const timeSinceLastInvocation = now - ctx.lastInvocationTime.getTime();

				// if it's been longer than the desired time between parsings, begin parsing again immediately
				if (timeSinceLastInvocation >= intervalMs) return 1;
				// if there is still dwell time until the next parsing time, wait that amount of time
				console.debug(`Next parsing starts in ${(intervalMs - timeSinceLastInvocation) / 1000} seconds`);
				return intervalMs - timeSinceLastInvocation;
			},
		},
	}
);

const allFoldersValidForParsing = (server: CampaignServerData[]) =>
	server.every(({ parsingPath }) => existsSync(parsingPath));

const promptForFolderPath = async (existingPath?: string): Promise<string | undefined> => {
	const { path } = await prompts({
		type: 'text',
		name: 'path',
		initial: existingPath,
		message: 'enter path to the server intended to be parsed',
		validate: (s: string) => {
			const exists = existsSync(s);
			return exists ? true : 'no folder exists at path';
		},
	});
	return path;
};

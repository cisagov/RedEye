import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs-extra';
import path from 'path';
import 'reflect-metadata';
import { AuthChecker, buildSchema } from 'type-graphql';
import { asciiArt } from '../asciiArt';
import { isAuth } from '../auth';
import { addRestRoutes } from '../routes';
import { ServerMachineContext } from './server.machine';
import { resolvers } from '../store';
import { getRootPath } from '../util';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import type { EndpointContext, GraphQLContext } from '../types';
import handler from 'serve-handler';
import open from 'open';

// @ts-ignore root package.json
import packageJson from '../../../../../package.json';

const graphqlPath = '/api/graphql';

const getOrigins = (clientPort: number) => [`http://localhost:${clientPort}`, `http://127.0.0.1:${clientPort}`];

const serverStartLogs = async (ctx: ServerMachineContext, clientUrl?: string): Promise<void> => {
	const origins = getOrigins(ctx.config.production ? ctx.config.port : ctx.config.clientPort);
	const usedClientUrl = clientUrl ?? origins[0];

	const logLine: string[] = [``];

	if (ctx.config.production) logLine.push(asciiArt);

	const ver = `v${packageJson.version}`;
	const helpLink = 'https://github.com/cisagov/redeye';

	logLine.push(
		`  ${cf.bold}${cf.white}RedEye Server${cf.reset} ${cf.dim}${ver}${cf.reset}`,
		`  RedEye Client ${cf.blue}${cf.underlined}${usedClientUrl}${cf.reset}`,
		`  Visit ${cf.underlined}${helpLink}${cf.reset} for help`,
		`  To quit, close terminal window or press ^C`,
		``
	);

	console.info(logLine.join('\n\n'));
};

export const startHttpServerService = (ctx: ServerMachineContext) => {
	const serverPort = ctx.config.port;
	const corsOptions = {
		origin: getOrigins(ctx.config.clientPort),
		credentials: true,
	};

	const authChecker: AuthChecker<any, string> = (resolverData, _roles) => {
		const authStatus = isAuth(ctx.config, resolverData.context.req?.cookies);
		return authStatus;
	};

	const production = ctx.config.production;

	const schemaFilePath = path.resolve(getRootPath(), 'schema.graphql');

	const endpointContext: EndpointContext = {
		config: ctx.config,
		cm: ctx.cm,
		messengerMachine: ctx.messagingService,
	};

	return new Promise<void>(async (resolve, reject) => {
		try {
			const schema = await buildSchema({
				resolvers,
				emitSchemaFile: schemaFilePath,
				authMode: 'error',
				validate: false,
				authChecker,
			});

			const schemaFile = await fs.readFile(schemaFilePath, 'utf-8');

			const apolloConfig: ApolloServerExpressConfig = {
				schema,
				typeDefs: schemaFile,
				plugins: !production ? [ApolloServerPluginLandingPageGraphQLPlayground()] : undefined,
				debug: !production,
				introspection: !production,
				context: ({ req, res }): GraphQLContext => ({
					req,
					res,
					...endpointContext,
				}),
			};

			// Create apollo server
			const apolloServer: ApolloServer = new ApolloServer(apolloConfig);

			const app = express();
			app.use(fileUpload({ createParentPath: true }));
			app.use(cors(corsOptions));
			app.use(cookieParser());
			addRestRoutes(app, endpointContext);
			await apolloServer.start();
			apolloServer.applyMiddleware({ app, path: graphqlPath, cors: corsOptions });

			if (process.pkg) {
				// Only used during pkg build, needs to be a hard path for pkg to bundle properly
				const clientPath = path.join(__dirname, '..', '..', '..', 'client');

				app.use((request, response) =>
					handler(request, response, {
						public: clientPath,
					})
				);
			}

			ctx.server = app.listen(serverPort, async () => {
				serverStartLogs(ctx);
				resolve();
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const startBlueTeamHttpServerService = (ctx: ServerMachineContext) => {
	const schemaFilePath = path.join(getRootPath(), 'schema.graphql');
	const PORT = ctx.config.port;
	const CLIENT_PORT = process.pkg ? PORT : ctx.config.clientPort;
	const corsOptions = {
		origin: getOrigins(CLIENT_PORT),
		credentials: true,
	};
	const production = ctx.config.production;

	const endpointContext: EndpointContext = {
		config: ctx.config,
		messengerMachine: ctx.messagingService,
		cm: ctx.cm,
	};

	return new Promise<void>(async (resolve, reject) => {
		try {
			const schema = await buildSchema({
				resolvers,
				emitSchemaFile: schemaFilePath,
				authMode: 'error',
				validate: false,
				authChecker: () => true,
			});
			const schemaFile = await fs.readFile(schemaFilePath, 'utf-8');

			const apolloConfig: ApolloServerExpressConfig = {
				schema,
				typeDefs: schemaFile,
				plugins: production ? [ApolloServerPluginLandingPageGraphQLPlayground()] : undefined,
				debug: !production,
				introspection: !production,
				context: ({ req, res }): GraphQLContext => ({
					req,
					res,
					...endpointContext,
				}),
			};

			// Create apollo server
			const apolloServer: ApolloServer = new ApolloServer(apolloConfig);

			const app = express();
			app.use(cors(corsOptions));
			app.use(cookieParser());
			app.use(fileUpload({ createParentPath: true }));
			addRestRoutes(app, endpointContext);
			await apolloServer.start();
			apolloServer.applyMiddleware({ app, path: graphqlPath, cors: corsOptions });

			const clientLocal = `http://localhost:${CLIENT_PORT}/index.html`;

			if (process.pkg) {
				// Only used during pkg build, needs to be a hard path for pkg to bundle properly
				const clientPath = path.join(__dirname, '..', '..', '..', 'client');
				app.use((request, response) =>
					handler(request, response, {
						public: clientPath,
					})
				);
				await open(clientLocal, {
					newInstance: true,
				});
			}

			ctx.server = app.listen(PORT, async () => {
				serverStartLogs(ctx, clientLocal);

				resolve();
			});
		} catch (e) {
			reject(e);
		}
	});
};

const consoleFormatting = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	underlined: '\x1b[4m',

	//text color

	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',

	white: '\x1b[97m',
	lightGray: '\x1b[37m',
	darkGray: '\x1b[90m',

	//background color

	blackBg: '\x1b[40m',
	redBg: '\x1b[41m',
	greenBg: '\x1b[42m',
	yellowBg: '\x1b[43m',
	blueBg: '\x1b[44m',
	magentaBg: '\x1b[45m',
	cyanBg: '\x1b[46m',
	whiteBg: '\x1b[47m',
};
const cf = consoleFormatting;

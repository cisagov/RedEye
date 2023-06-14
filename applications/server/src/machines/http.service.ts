import type { ApolloServerOptions } from '@apollo/server';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs-extra';
import path from 'path';
import 'reflect-metadata';
import type { AuthChecker } from 'type-graphql';
import { buildSchema } from 'type-graphql';
import { json } from 'body-parser';
import { asciiArt, consoleFormatting as cf } from '../asciiArt';
import { isAuth } from '../auth';
import { addRestRoutes } from '../routes';
import type { ServerMachineContext } from './server.machine';
import { resolvers } from '../store';
import { getRootPath } from '../util';
import type { EndpointContext, GraphQLContext } from '../types';
import handler from 'serve-handler';
import open from 'open';

// @ts-ignore
import packageJson from '../../../../package.json';

const graphqlPath = '/api/graphql';

const getOrigins = (clientPort: number) => [`http://localhost:${clientPort}`, `http://127.0.0.1:${clientPort}`];

const serverStartLogs = async (ctx: ServerMachineContext, clientUrl?: string): Promise<void> => {
	const origins = getOrigins(ctx.config.production ? ctx.config.port : ctx.config.clientPort);
	const usedClientUrl = clientUrl ?? origins[0];

	const logLine: string[] = [``];

	logLine.push(asciiArt()); // ctx.config.blueTeam));

	const ver = `v${packageJson.version}`;

	const helpLink = 'https://github.com/cisagov/redeye#readme';
	const mode = ctx.config.blueTeam ? `${cf.blueBg} BLUE TEAM ${cf.reset}` : `${cf.redBg} RED TEAM ${cf.reset}`;

	logLine.push(
		`  ${cf.bold}${cf.white}RedEye Server${cf.reset} ${ver}${cf.reset}`,
		`  RedEye Client ${cf.blue}${cf.underlined}${usedClientUrl}${cf.reset}`,
		`  Running in ${mode} mode`,
		`  Visit ${cf.underlined}${helpLink}${cf.reset} for help`,
		`  To quit, close terminal window or press ^C`,
		``
	);

	console.info(logLine.join('\n\n'));
};

const createServer = async ({
	ctx,
	authChecker,
	clientPort,
}: {
	ctx: ServerMachineContext;
	authChecker: AuthChecker;
	clientPort: number;
}): Promise<[Express, ApolloServer<GraphQLContext>]> => {
	const corsOptions = {
		origin: getOrigins(clientPort),
		credentials: true,
	};
	const schemaFilePath = path.resolve(getRootPath(), 'schema.graphql');
	const production = ctx.config.production;
	const schema = await buildSchema({
		resolvers,
		emitSchemaFile: schemaFilePath,
		authMode: 'error',
		validate: false,
		authChecker,
	});

	const schemaFile = await fs.readFile(schemaFilePath, 'utf-8');
	const apolloConfig = {
		cache: 'bounded',
		schema: schema,
		typeDefs: schemaFile,
		plugins: !production ? [ApolloServerPluginLandingPageLocalDefault()] : undefined,
		introspection: !production,
	};

	const endpointContext: EndpointContext = {
		config: ctx.config,
		cm: ctx.cm,
		messengerMachine: ctx.messagingService,
	};

	// Create apollo server
	const apolloServer = new ApolloServer<GraphQLContext>(apolloConfig as unknown as ApolloServerOptions<GraphQLContext>);

	const app = express();
	app.use(fileUpload({ createParentPath: true }));
	app.use(cors(corsOptions));
	app.use(cookieParser());
	addRestRoutes(app, endpointContext);
	await apolloServer.start();
	app.use(
		graphqlPath,
		cors(corsOptions),
		json(),
		expressMiddleware(apolloServer, {
			context: async ({ req, res }) => ({
				req,
				res,
				...endpointContext,
			}),
		})
	);

	return [app, apolloServer];
};

export const startHttpServerService = (ctx: ServerMachineContext) => {
	const serverPort = ctx.config.port;
	const authChecker: AuthChecker<any, string> = (resolverData, _roles) => {
		const authStatus = isAuth(ctx.config, resolverData.context.req?.cookies);
		return authStatus;
	};

	return new Promise<void>(async (resolve, reject) => {
		try {
			const [app] = await createServer({ ctx, authChecker, clientPort: ctx.config.clientPort });

			if (process.pkg) {
				// Only used during pkg build, needs to be a hard path for pkg to bundle properly
				const clientPath = path.join(__dirname, '..', '..', '..', 'client', 'dist');

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
	const PORT = ctx.config.port;
	const CLIENT_PORT = process.pkg ? PORT : ctx.config.clientPort;

	return new Promise<void>(async (resolve, reject) => {
		try {
			const [app] = await createServer({ ctx, authChecker: () => true, clientPort: CLIENT_PORT });

			const clientLocal = `http://localhost:${CLIENT_PORT}/index.html`;

			if (process.pkg) {
				// Only used during pkg build, needs to be a hard path for pkg to bundle properly
				const clientPath = path.join(__dirname, '..', '..', '..', 'client', 'dist');
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

import { randomUUID } from 'crypto';
import { boolean, InferType, number, object, string, array } from 'yup';
import type { cliArgs } from '.';
/**
 * The only places dotenv should ever be imported is in this file or in the mikro-orm.config.ts.
 * All other uses of the config object should be injected via other means.
 */
import dotenv from 'dotenv';
dotenv.config();

type EnvironmentObject = Record<string, string | number | undefined>;

export enum DatabaseMode {
	PRODUCTION = 'PRODUCTION',
	DEV_PERSIST = 'DEV_PERSIST',
	DEV_CLEAN = 'DEV_CLEAN',
}

export const configDefinition = object({
	production: boolean().required().default(true),
	blueTeam: boolean().required().default(true),
	port: number().positive().integer().required().default(4000),
	parsers: array(string().required()).default(['cobalt-strike-parser', 'brute-ratel-parser']),
	// purely informational, this is not used in production for anything
	clientPort: number().positive().integer().required().default(3500),
	databaseMode: string<DatabaseMode>().oneOf(Object.values(DatabaseMode)).required().default(DatabaseMode.PRODUCTION),
	secret: string().required().default(randomUUID()),
	password: string().when('blueTeam', {
		is: true,
		then: (schema) => schema.default(''),
		otherwise: (schema) =>
			schema.required(
				'`AUTHENTICATION_PASSWORD` environment variable undefined. Cannot run red team mode without a password'
			),
	}),
	maxParserSubprocesses: number().positive().integer().required().default(8),
})
	.from('SERVER_PRODUCTION', 'production')
	.from('SERVER_BLUE_TEAM', 'blueTeam')
	.from('SERVER_PORT', 'port')
	.from('DATABASE_MODE', 'databaseMode')
	.from('AUTHENTICATION_SECRET', 'secret')
	.from('AUTHENTICATION_PASSWORD', 'password')
	.from('MAX_PARSER_SUB_PROCESSES', 'maxParserSubprocesses')
	.from('CLIENT_PORT', 'clientPort');

export type ConfigDefinition = InferType<typeof configDefinition>;

const castConfig = (env: EnvironmentObject, cliArgs: cliArgs): ConfigDefinition => {
	const overrides: Record<string, string | boolean | number> = {};

	if (cliArgs.developmentMode) {
		overrides.SERVER_PRODUCTION = false;
		overrides.DATABASE_MODE = DatabaseMode.DEV_PERSIST;
	}
	if (cliArgs.port) overrides.SERVER_PORT = cliArgs.port;
	if (cliArgs.redTeam) overrides.SERVER_BLUE_TEAM = false;
	if (cliArgs.childProcesses) overrides.MAX_PARSER_SUB_PROCESSES = cliArgs.childProcesses;
	if (cliArgs.password) overrides.AUTHENTICATION_PASSWORD = cliArgs.password;

	return configDefinition.validateSync({
		...env,
		...overrides,
	});
};

export const createConfig = (cliArgs: cliArgs) => castConfig(process.env, cliArgs);

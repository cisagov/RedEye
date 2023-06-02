import { randomUUID } from 'crypto';
import { z } from 'zod';
import type { cliArgs } from '.';
import fs from 'fs-extra';
import { getRuntimeDir } from './util';
import path from 'path';

export enum DatabaseMode {
	PRODUCTION = 'PRODUCTION',
	DEV_PERSIST = 'DEV_PERSIST',
	DEV_CLEAN = 'DEV_CLEAN',
}

export const configDefinition = z.object({
	production: z.boolean().optional().default(true),
	redTeam: z.boolean().default(false),
	port: z.number().int().positive().optional().default(4000),
	parsers: z.array(z.string()).default(['cobalt-strike-parser', 'brute-ratel-parser']),
	clientPort: z
		.number()
		.int()
		.positive()
		.optional()
		.default(3500)
		.describe('purely informational, this is not used in production for anything'),
	databaseMode: z.nativeEnum(DatabaseMode).optional().default(DatabaseMode.PRODUCTION),
	secret: z.string().optional().default(randomUUID()),
	password: z.string().optional(),
	maxParserSubprocesses: z.number().int().positive().optional().default(8),
});

const configWithRequired = configDefinition.required({ password: true });
export type ConfigDefinition = z.infer<typeof configWithRequired>;

const castConfig = (cliArgs: cliArgs): ConfigDefinition => {
	let configFile: string | undefined;
	try {
		configFile = fs.readFileSync(path.join(getRuntimeDir(), 'config.json'), 'utf-8');
	} catch (err) {
		console.debug('No config file found, using defaults');
	}
	const overrides: ConfigDefinition = configFile ? JSON.parse(configFile) : {};

	if (cliArgs.developmentMode) {
		overrides.production = false;
		overrides.databaseMode = DatabaseMode.DEV_PERSIST;
	}
	if (cliArgs.port) overrides.port = cliArgs.port;
	if (cliArgs.redTeam) overrides.redTeam = true;
	if (cliArgs.childProcesses) overrides.maxParserSubprocesses = cliArgs.childProcesses;
	if (cliArgs.password) overrides.password = cliArgs.password;

	return configDefinition
		.refine((config) => {
			if (!config.redTeam && !config.password) {
				config.password = '';
			} else if (config.redTeam && !config.password) {
				throw new Error(
					'`password` config property and `--password` arg undefined. Cannot run red team mode without a password'
				);
			}
			return config;
		})
		.parse({
			...overrides,
		}) as ConfigDefinition;
};

export const createConfig = (cliArgs: cliArgs) => castConfig(cliArgs);

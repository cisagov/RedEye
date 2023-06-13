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
	parsers: z.array(z.string()).optional(),
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
type ConfigOverrides = Omit<ConfigDefinition, 'parsers'> & { parsers: boolean | string[] };
const castConfig = (cliArgs: cliArgs): ConfigDefinition => {
	let configFile: string | undefined;
	try {
		configFile = fs.readFileSync(path.join(getRuntimeDir(), 'config.json'), 'utf-8');
	} catch (err) {
		console.debug('No config file found, using defaults');
	}
	const overrides: ConfigOverrides = configFile ? JSON.parse(configFile) : {};

	if (cliArgs.developmentMode) {
		overrides.production = false;
		overrides.databaseMode = DatabaseMode.DEV_PERSIST;
	}
	if (cliArgs.port) overrides.port = cliArgs.port;
	if (cliArgs.redTeam) overrides.redTeam = true;
	if (cliArgs.childProcesses) overrides.maxParserSubprocesses = cliArgs.childProcesses;
	if (cliArgs.password) overrides.password = cliArgs.password;
	if (cliArgs.parsers) {
		if (cliArgs.parsers === true) {
			overrides.parsers = true;
		} else {
			overrides.parsers = cliArgs.parsers;
		}
	}

	// Check the parsers folder for available parsers
	if (overrides.parsers === true) {
		try {
			const parserFile = fs.readdirSync(path.join(getRuntimeDir(), 'parsers'), { withFileTypes: true });
			overrides.parsers = parserFile.filter((file) => file.isFile()).map((file) => file.name);
		} catch (e) {
			console.error('Could not read parser directory');
		}
	}

	return configDefinition
		.refine((config) => {
			if (!config.redTeam && !config.password) {
				config.password = '';
			}

			if (config.redTeam) {
				if (!config.password) {
					throw new Error(
						'`password` config property and `--password` arg undefined. Cannot run red team mode without a password'
					);
				}
				if (!config.parsers) {
					console.log('No parsers specified in config, only .redeye files can be uploaded');
				} else {
					console.log(`Using parsers: ${config.parsers.join(' ')}`);
				}
			}
			return config;
		})
		.parse({
			...overrides,
		}) as ConfigDefinition;
};

export const createConfig = (cliArgs: cliArgs) => castConfig(cliArgs);

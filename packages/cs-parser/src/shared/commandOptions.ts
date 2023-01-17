import { Command, Option } from 'commander';

export enum LogLevel {
	error = 'error',
	warn = 'warn',
	debug = 'debug',
}

export type SharedCommandOptions = {
	loggingFolderPath: string | undefined;
	logLevel: LogLevel;
};

const logLevelOptions = Object.keys(LogLevel);

export const addSharedCommandOptions = (command: Command): Command => {
	command.option('-p, --loggingFolderPath </absolute/path/to/folder>', 'Folder in which to put log files');
	command.addOption(
		new Option('-l, --logLevel <string>', 'log level to be pushed to logs').choices(logLevelOptions).default('warn')
	);
	return command;
};

export type SharedServerOptions = {
	folders?: string | string[];
	threads: number;
};

export const addSharedServerCommandOptions = (command: Command, minThreads: number): Command => {
	command
		.option('-f, --folders </absolute/path/to/folder...>', 'A list of folders to parse without an existing database')
		.addOption(
			new Option('-t, --threads [number]', 'max # of processes the parser can use')
				.default(minThreads + 1, `${minThreads + 1}, minimum ${minThreads}`)
				.argParser((c, defaultValue) => {
					const parsedCurrent = parseInt(c);
					if (!Number.isNaN(parsedCurrent)) {
						if (parsedCurrent >= minThreads) {
							return c;
						} else {
							return minThreads;
						}
					}
					return defaultValue;
				})
		);

	return command;
};

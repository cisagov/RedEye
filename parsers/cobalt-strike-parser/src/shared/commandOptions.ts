import type { Command } from 'commander';
import { Option } from 'commander';

export enum LogLevel {
	error = 'error',
	warn = 'warn',
	debug = 'debug',
}

export type SharedCommandOptions = {
	loggingFolderPath: string;
	logLevel: LogLevel;
};

const logLevelOptions = Object.keys(LogLevel);

export const addSharedCommandOptions = (command: Command): void => {
	command.option('-p, --loggingFolderPath </absolute/path/to/folder>', 'Folder in which to put log files', './');
	command.addOption(
		new Option('-l, --logLevel <string>', 'log level to be pushed to logs').choices(logLevelOptions).default('warn')
	);
};

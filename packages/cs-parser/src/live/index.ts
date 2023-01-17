import { Command, Option } from 'commander';
import {
	addSharedCommandOptions,
	addSharedServerCommandOptions,
	SharedCommandOptions,
	SharedServerOptions,
} from '../shared/commandOptions';
import { interpret } from 'xstate';
import { mainMachine, MainMachineContext } from './main.machine';

type LiveParsingCallbackOptions = {
	serverAddress?: string;
	parsingInterval: number;
} & SharedCommandOptions &
	SharedServerOptions;

export const registerLiveParsingCommand = (program: Command) => {
	const liveParsingCommand = program.command('live');
	liveParsingCommand
		.addOption(new Option('-s, --serverAddress [string]', 'Address to a running server'))
		.addOption(new Option('-i, --parsingInterval [number]', 'Number of minutes between parsings').default(15));

	addSharedServerCommandOptions(liveParsingCommand, 3);
	addSharedCommandOptions(liveParsingCommand);

	liveParsingCommand.action(liveParsingCommandAction);
};

const liveParsingCommandAction = (options: LiveParsingCallbackOptions) => {
	const { serverAddress, loggingFolderPath, threads, logLevel, folders, parsingInterval } = options;

	const folderPaths = folders ? (typeof folders === 'string' ? [folders] : folders) : [];

	const context: MainMachineContext = {
		serverAddress,
		maxChildProcesses: threads - 1,
		folderPaths,
		loggingFolderPath: loggingFolderPath ?? __dirname,
		logLevel,
		parsingInterval,
		temporaryDatabasePath: __dirname + `temporary.sqlite`,
	};

	const liveParsingService = interpret(mainMachine.withContext(context));

	liveParsingService.start();
	liveParsingService.onStop(() => {});
};

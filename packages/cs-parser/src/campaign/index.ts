import { type Command } from 'commander';
import { createLoggerInstance } from '../shared/logging';
import {
	addSharedCommandOptions,
	addSharedServerCommandOptions,
	LogLevel,
	type SharedCommandOptions,
	type SharedServerOptions,
} from '../shared/commandOptions';
import { interpret } from 'xstate';
import { hrtime } from 'process';
import { mainCampaignMachine, type MainContext } from './main.machine';

type CommandCallbackOptions = {
	databasePath?: string;
} & SharedCommandOptions &
	SharedServerOptions;

export const registerCampaignCommand = (program: Command) => {
	const campaignCommand = program.command('campaign');
	campaignCommand.option(
		'-d, --databasePath </absolute/path/to/database>',
		'parser with an existing database and unparsed server(s)'
	);

	addSharedServerCommandOptions(campaignCommand, 2);
	addSharedCommandOptions(campaignCommand);

	campaignCommand.action(campaignCommandAction);
};

const campaignCommandAction = (options: CommandCallbackOptions) => {
	const { logLevel = LogLevel.warn } = options;
	const logger = createLoggerInstance(options.loggingFolderPath ?? __dirname);
	logger('command invocation', { payload: options, tags: ['CAMPAIGN_SCRIPT_INVOCATION'], level: 'debug' });

	const start = hrtime.bigint();
	const completeCallback = () => {
		const end = hrtime.bigint();
		const seconds = Number(end - start) / 1e9;
		logger(`Total execution time: ${seconds} seconds`, { tags: ['CAMPAIGN_SCRIPT_INVOCATION'], level: 'debug' });
	};

	if (!options.folders && !options.databasePath) {
		logger('Either folders or a database must be defined', { tags: ['CAMPAIGN_SCRIPT_INVOCATION'], level: 'error' });
	} else if (options.folders && options.databasePath) {
		logger('Either folders or a database must be defined but not both', {
			tags: ['CAMPAIGN_SCRIPT_INVOCATION'],
			level: 'error',
		});
	} else if (options.folders) {
		const context: MainContext = {
			maxChildProcesses: options.threads,
			folderPaths: [...options.folders],
			databasePath: options.databasePath,
			timeMeasurements: {},
			loggingFolderPath: options.loggingFolderPath ?? __dirname,
			logger,
			logLevel,
		};

		const parsingService = interpret(mainCampaignMachine.withContext(context));

		parsingService.onDone(completeCallback);
		parsingService.start();
	} else {
		const context: MainContext = {
			maxChildProcesses: options.threads,
			folderPaths: [],
			loggingFolderPath: options.loggingFolderPath ?? __dirname,
			databasePath: options.databasePath,
			timeMeasurements: {},
			logger,
			logLevel,
		};

		const parsingService = interpret(mainCampaignMachine.withContext(context));
		parsingService.start();

		parsingService.onDone(completeCallback);
	}
};

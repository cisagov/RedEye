import type { Command } from 'commander';
import { Option } from 'commander';
import { createLoggerInstance } from '../shared/logging';
import type { SharedCommandOptions } from '../shared/commandOptions';
import { addSharedCommandOptions, LogLevel } from '../shared/commandOptions';
import { interpret } from 'xstate';
import { hrtime } from 'process';
import type { MainContext } from './main.machine';
import { mainCampaignMachine } from './main.machine';

type CommandCallbackOptions = {
	folders?: string | string[];
	databasePath?: string;
	childProcesses: number;
} & SharedCommandOptions;

export const registerCampaignCommand = (program: Command) => {
	const campaignCommand = program.command('campaign');
	campaignCommand.option(
		'-f, --folders </absolute/path/to/folder...>',
		'A list of folders to parse without an existing database',
		(value) => value?.replaceAll('"', '')
	);
	campaignCommand.option(
		'-d, --databasePath </absolute/path/to/database>',
		'parser with an existing database and unparsed server(s)',
		(value) => value?.replaceAll('"', '')
	);

	addSharedCommandOptions(campaignCommand);

	campaignCommand.addOption(
		new Option('-t, --childProcesses [number]', 'max # of child processes the parser can use')
			.default(3, '3, minimum 2')
			.argParser((c, defaultValue) => {
				const parsedCurrent = parseInt(c);
				if (!Number.isNaN(parsedCurrent)) {
					if (parsedCurrent >= 2) {
						return c;
					} else {
						return 2;
					}
				}
				return defaultValue;
			})
	);

	campaignCommand.action(campaignCommandAction);
};

const campaignCommandAction = (options: CommandCallbackOptions) => {
	const { logLevel = LogLevel.warn } = options;
	const logger = createLoggerInstance(options.loggingFolderPath);
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
			maxChildProcesses: options.childProcesses,
			folderPaths: [...options.folders],
			databasePath: options.databasePath,
			timeMeasurements: {},
			loggingFolderPath: options.loggingFolderPath,
			logger,
			logLevel,
		};

		const parsingService = interpret(mainCampaignMachine.withContext(context));

		parsingService.onDone(completeCallback);
		parsingService.start();
	} else {
		const context: MainContext = {
			maxChildProcesses: options.childProcesses,
			folderPaths: [],
			loggingFolderPath: options.loggingFolderPath,
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

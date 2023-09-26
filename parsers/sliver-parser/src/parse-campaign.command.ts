import type { Command } from 'commander';
import { ParserMessageTypes, writeParserMessage } from '@redeye/parser-core';
import { parseSliverFiles } from './parser/parse-sliver-files';

type CommandCallbackOptions = {
	folder?: string;
};

export const registerCampaignCommand = (program: Command) => {
	const campaignCommand = program.command('parse-campaign');
	campaignCommand.option(
		'-f, --folder </absolute/path/to/folder>',
		'The folder containing a Sliver campaign, includes a sliver.db file and json_*.log files',
		(value) => value.replaceAll('"', '')
	);

	campaignCommand.action(campaignCommandAction);
};

const campaignCommandAction = async (options: CommandCallbackOptions) => {
	if (options.folder) {
		writeParserMessage(ParserMessageTypes.Data, await parseSliverFiles(options.folder));
	} else {
		writeParserMessage(ParserMessageTypes.Error, 'No folder specified');
	}
};

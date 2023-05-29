import { Command } from 'commander';
import { ParserMessageTypes, writeParserMessage } from '@redeye/parser-core';
import { parseAutosaveProfile } from './profileParser';

type CommandCallbackOptions = {
	folder?: string;
};

export const registerCampaignCommand = (program: Command) => {
	const campaignCommand = program.command('campaign');
	campaignCommand.option(
		'-f, --folder </absolute/path/to/folder>',
		'The folder containing a Brute Ratel campaign, includes autosave.profile and logs folder'
	);

	campaignCommand.action(campaignCommandAction);
};

const campaignCommandAction = async (options: CommandCallbackOptions) => {
	if (options.folder) {
		writeParserMessage(ParserMessageTypes.Data, await parseAutosaveProfile(options.folder));
	} else {
		writeParserMessage(ParserMessageTypes.Error, 'No folder specified');
	}
};

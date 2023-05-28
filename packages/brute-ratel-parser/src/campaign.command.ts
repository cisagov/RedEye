import { Command } from 'commander';
import { ParserMessageTypes, writeParserMessage } from '@redeye/models';
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
		const ret = await parseAutosaveProfile(options.folder);
		writeParserMessage(ParserMessageTypes.Data, JSON.stringify(ret, mapReplacer));
	} else {
		writeParserMessage(ParserMessageTypes.Error, 'No folder specified');
	}
};

const mapReplacer = (_key: string, value: any) => {
	if (value instanceof Map) {
		return Object.fromEntries(value.entries());
	} else {
		return value;
	}
};

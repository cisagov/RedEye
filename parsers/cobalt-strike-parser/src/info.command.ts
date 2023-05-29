import { Command } from 'commander';
import {
	ParserInfo,
	ParserMessageTypes,
	ServerDelineationTypes,
	UploadType,
	ValidationMode,
	writeParserMessage,
} from '@redeye/parser-core';

export const registerInfoCommand = (program: Command) => {
	const infoCommand = program.command('info');

	infoCommand.action(() => {
		writeParserMessage(ParserMessageTypes.Data, aboutInfo);
	});
};

const aboutInfo: ParserInfo = {
	version: 1,
	id: 'cobalt-strike-parser',
	name: 'Cobalt Strike Parser',
	serverDelineation: ServerDelineationTypes.Folder,
	uploadForm: {
		enabledInBlueTeam: false,
		tabTitle: 'Upload Cobalt Strike logs',
		fileUpload: {
			type: UploadType.Directory,
			validate: ValidationMode.Parser,
			description:
				'Select a single Campaign Folder that contains CobaltStrike Server Folders.\n' +
				'Each Server Folder should contain beacon logs in dated (YYMMDD) folders.',
		},
		fileDisplay: {
			editable: true,
			description: '',
		},
	},
};

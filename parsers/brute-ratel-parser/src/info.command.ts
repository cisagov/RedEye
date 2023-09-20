import type { Command } from 'commander';
import type { ParserInfo } from '@redeye/parser-core';
import {
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
	id: 'brute-ratel-parser',
	name: 'Brute Ratel Parser',
	uploadForm: {
		serverDelineation: ServerDelineationTypes.Database,
		enabledInBlueTeam: false,
		tabTitle: 'Brute Ratel',
		fileUpload: {
			type: UploadType.Directory,
			validate: ValidationMode.Parser,
			description: 'Upload the Brute Ratel log folder containing an autosave.profile and logs folder',
		},
		fileDisplay: {
			editable: true,
		},
	},
};

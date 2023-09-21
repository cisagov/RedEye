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
	id: 'sliver-parser',
	name: 'Sliver Parser',
	uploadForm: {
		serverDelineation: ServerDelineationTypes.Database,
		enabledInBlueTeam: false,
		tabTitle: 'Sliver',
		fileUpload: {
			type: UploadType.Directory,
			validate: ValidationMode.Parser,
			description: 'Upload the Sliver log folder containing a sliver.db file and json_*.log files',
		},
		fileDisplay: {
			editable: true,
		},
	},
};

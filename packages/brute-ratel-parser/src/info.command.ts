import { Command } from 'commander';
import {
	ParserInfo,
	ParserMessageTypes,
	ServerDelineationTypes,
	UploadType,
	ValidationMode,
	writeParserMessage,
} from '@redeye/models';

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
	serverDelineation: ServerDelineationTypes.Database,
	uploadForm: {
		enabledInBlueTeam: false,
		tabTitle: 'Upload Brute Ratel logs',
		fileUpload: {
			type: UploadType.Directory,
			validate: ValidationMode.Parser,
			description: 'Upload the Brute Ratel log folder containing the autosave.profile',
		},
		fileDisplay: {
			editable: true,
			description: '',
		},
	},
};

import { Command } from 'commander';
import { ParserMessageTypes, ParserValidateFiles, writeParserMessage } from '@redeye/parser-core';
import { BruteRatelProfile } from './profile.types';
import fs from 'fs-extra';
import path from 'path';

type ValidateFilesCallbackOptions = {
	folder: string;
};

export const registerValidateFilesCommand = (program: Command) => {
	const validateFilesCommand = program.command('validate-files');
	validateFilesCommand.option(
		'-f, --folder </absolute/path/to/folder>',
		'A folder containing the Brute Ratel log files'
	);
	validateFilesCommand.action(async (options) => {
		writeParserMessage(ParserMessageTypes.Data, await validate(options));
	});
};

const validate = async (options: ValidateFilesCallbackOptions): Promise<ParserValidateFiles> => {
	const autosaveProfile: BruteRatelProfile = JSON.parse(
		fs.readFileSync(path.join(options.folder, 'autosave.profile'), 'utf8')
	);
	const files = await walkDir(options.folder);
	const validFiles: string[] = [];
	const invalidFiles: string[] = [];
	files.forEach((file) => {
		if (file.endsWith('.log') || file.endsWith('.profile')) {
			validFiles.push(file);
		} else {
			invalidFiles.push(file);
		}
	});
	const servers = Object.keys(autosaveProfile.listeners).map((listener) => ({ name: listener }));
	return { servers, valid: validFiles, invalid: invalidFiles };
};

async function walkDir(directory: string, originalDirectory = directory): Promise<string[]> {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];
	for (const file of entries) {
		if (file.isDirectory()) {
			files.push(...(await walkDir(path.join(directory, file.name, path.sep), originalDirectory)));
		} else {
			const filePath = path.join(directory, file.name).replace(originalDirectory, '').split(path.sep);
			filePath.shift();
			files.push(file.name);
		}
	}
	return files;
}

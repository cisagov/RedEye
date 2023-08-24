import type { Command } from 'commander';
import type { ParserValidateFiles } from '@redeye/parser-core';
import { ParserMessageTypes, writeParserMessage } from '@redeye/parser-core';
import type { BruteRatelProfile } from './profile.types';
import fs from 'fs-extra';
import path from 'path';

type ValidateFilesCallbackOptions = {
	folder: string;
};

type DirectoryFile = {
	name: string;
	path: string[];
};

export const registerValidateFilesCommand = (program: Command) => {
	const validateFilesCommand = program.command('validate-files');
	validateFilesCommand.option(
		'-f, --folder </absolute/path/to/folder>',
		'A folder containing the Brute Ratel log files',
		(value) => value.replaceAll('"', '')
	);
	validateFilesCommand.action(async (options) => {
		writeParserMessage(ParserMessageTypes.Data, await validate(options));
	});
};

const validate = async (options: ValidateFilesCallbackOptions): Promise<ParserValidateFiles> => {
	const autosaveProfile: BruteRatelProfile = JSON.parse(
		fs.readFileSync(path.join(options.folder, 'autosave.profile'), 'utf8')
	);
	const files = await walkDir(path.join(options.folder, '..'));
	const validFiles: string[] = [];
	const invalidFiles: string[] = [];
	files.forEach((file) => {
		if (file.name.endsWith('.log') || file.name.endsWith('.profile')) {
			validFiles.push(file.path.join('/'));
		} else {
			invalidFiles.push(file.path.join('/'));
		}
	});
	const servers = Object.keys(autosaveProfile.listeners).map((listener) => ({ name: listener }));
	return { servers, valid: validFiles, invalid: invalidFiles };
};

async function walkDir(directory: string, originalDirectory = directory): Promise<DirectoryFile[]> {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];
	for (const file of entries) {
		if (file.isDirectory()) {
			files.push(...(await walkDir(path.join(directory, file.name, path.sep), originalDirectory)));
		} else {
			const filePath = path.join(directory, file.name).replace(originalDirectory, '').split(path.sep);
			filePath.shift();
			files.push({ name: file.name, path: filePath });
		}
	}
	return files;
}

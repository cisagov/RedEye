import type { Command } from 'commander';
import type { ParserValidateFiles } from '@redeye/parser-core';
import { ParserMessageTypes, writeParserMessage } from '@redeye/parser-core';
import fs from 'fs-extra';
import { join, sep } from 'node:path';
import { connectToSliverDb } from './parser/parse-sliver-files';
import { Beacons } from './sliver-entities/Beacons';

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
		'A folder containing the Sliver db and log files',
		(value) => value.replaceAll('"', '')
	);
	validateFilesCommand.action(async (options) => {
		writeParserMessage(ParserMessageTypes.Data, await validate(options));
	});
};

const validate = async (options: ValidateFilesCallbackOptions): Promise<ParserValidateFiles> => {
	const sliverDbORM = await connectToSliverDb(join(options.folder, 'sliver.db'));
	const files = await walkDir(join(options.folder, '..'));
	const validFiles: string[] = [];
	const invalidFiles: string[] = [];
	files.forEach((file) => {
		if ((file.name.endsWith('.log') && file.name.startsWith('json_')) || file.name === 'sliver.db') {
			validFiles.push(file.path.join('/'));
		} else {
			invalidFiles.push(file.path.join('/'));
		}
	});
	const servers = Array.from(
		new Set((await sliverDbORM.em.find(Beacons, {})).map((beacon) => beacon.activeC2)),
		(server) => ({ name: server! })
	);
	await sliverDbORM.close(true);
	return { servers, valid: validFiles, invalid: invalidFiles };
};

async function walkDir(directory: string, originalDirectory = directory): Promise<DirectoryFile[]> {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];
	for (const file of entries) {
		if (file.isDirectory()) {
			files.push(...(await walkDir(join(directory, file.name, sep), originalDirectory)));
		} else {
			const filePath = join(directory, file.name).replace(originalDirectory, '').split(sep);
			filePath.shift();
			files.push({ name: file.name, path: filePath });
		}
	}
	return files;
}

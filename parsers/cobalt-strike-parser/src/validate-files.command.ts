import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { ParserMessageTypes, writeParserMessage } from '@redeye/parser-core';

type ValidateFilesCallbackOptions = {
	folder: string;
};
export const registerValidateFilesCommand = (program: Command) => {
	const validateFilesCommand = program.command('validate-files');
	validateFilesCommand.option(
		'-f, --folder </absolute/path/to/folder>',
		'A folder containing the Cobalt Strike log files',
		(value) => value.replaceAll('"', '')
	);
	validateFilesCommand.action(async (options) => {
		writeParserMessage(ParserMessageTypes.Data, await validate(options));
	});
};

type DirectoryFile = {
	name: string;
	path: string[];
};

export interface DirectoryTree {
	[key: string]: DirectoryTree | DirectoryFile;
}

const validate = async (options: ValidateFilesCallbackOptions) => {
	const folder = options.folder;
	if (!folder) throw Error('No Folder Provided');
	const rootFolder = path.join(folder, '..');
	const fileArray = await walkDir(rootFolder);
	const { tree, validFiles, invalidFiles, longestPath } = validateFiles(fileArray);
	if (!validFiles.length) throw Error('No Valid Files Found');
	// Create servers or return error
	const rootDirectory = Object.keys(tree)[0];
	const multiServerUpload = !!longestPath[2].match(dateFolder)?.length && !!longestPath[3].match(ipRegex)?.length;
	writeParserMessage(ParserMessageTypes.Debug, { multiServerUpload, rootDirectory, longestPath });
	// If not a multi server, use root directory name as server name
	if (!multiServerUpload) {
		const files = flattenTree(tree[rootDirectory] as DirectoryTree);
		const serverName = longestPath[longestPath.findIndex((p) => p.match(dateFolder)) - 1];
		return {
			servers: [{ name: serverName, fileCount: files.length }],
			valid: files.map((file) => file.name),
			invalid: invalidFiles.map((file) => file.name),
		};
	} else {
		const validFiles: string[] = [];
		const servers: { name: string; fileCount: number }[] = [];
		Object.entries(tree[rootDirectory]).forEach(([key, value]: [string, DirectoryTree]) => {
			const files = flattenTree(value);
			servers.push({ name: key.split('/')[0], fileCount: files.length });
			validFiles.push(...files.map((file) => file.name));
		});
		// Use the directory trees under root directory as servers
		return {
			servers,
			invalid: invalidFiles.map((file) => file.name),
			valid: validFiles,
		};
	}
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
			files.push({
				name: file.name,
				path: filePath,
			});
		}
	}
	return files;
}

const dateFolder = /^\d{6}$/;
const ipRegex =
	/^(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/;

const createTreeFromPaths = (file: DirectoryFile, path: string[], tree: any) => {
	let current = tree;
	for (let i = 0; i < path.length; i++) {
		const part = path[i];
		if (!current[part]) {
			if (i === path.length - 1) current[part] = file;
			else current[part] = {};
		}
		current = current[part];
	}
	return tree;
};

const flattenTree = (tree: DirectoryTree, path: string[] = []) => {
	const files: DirectoryFile[] = [];
	for (const [key, file] of Object.entries(tree)) {
		if (file.name) {
			files.push(file as DirectoryFile);
		} else {
			files.push(...flattenTree(file as DirectoryTree, path.concat(key)));
		}
	}
	return files;
};

const validateFiles = (files: DirectoryFile[]) => {
	const invalidFiles: DirectoryFile[] = [];
	const validFiles: DirectoryFile[] = [];
	// Validate files and create file tree from flat list
	let tree: DirectoryTree = {};
	let longestPath: string[] = [];
	files?.forEach((f: DirectoryFile) => {
		if (!(f.name.endsWith('.log') || f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.txt'))) {
			// Ignore secret/hidden files
			if (!f.name.startsWith('.')) invalidFiles.push(f);
			return;
		}

		if (f.path.some((pathItem) => pathItem.startsWith('.'))) return;
		// if path is not <date_folder>/<ip_address> or <date_folder>/<file> return;
		if (
			!(
				(f.path.at(-2)?.match(ipRegex) && f.path.at(-3)?.match(dateFolder)) ||
				(f.path.at(-3)?.match(ipRegex) && f.path.at(-4)?.match(dateFolder)) ||
				f.path.at(-2)?.match(dateFolder) ||
				f.path.at(-3)?.match(dateFolder)
			)
		)
			return;
		// If jpg and not in screenshots folder, don't use
		if ((f.name.endsWith('.jpg') || f.name.endsWith('.png')) && f.path.at(-2) !== 'screenshots') return;
		// If txt and not in keystrokes, don't use
		if (f.name.endsWith('.txt') && f.path.at(-2) !== 'keystrokes') return;
		// If log and not in ip folder, date folder or unknown folder, return
		if (
			f.name.endsWith('.log') &&
			!(f.path.at(-2)?.match(ipRegex) || f.path.at(-2)?.match(dateFolder) || f.path.at(-2) === 'unknown')
		)
			return;

		// If passed all, add to tree
		validFiles.push(f);
		longestPath = f.path.length > longestPath.length ? f.path : longestPath;
		tree = createTreeFromPaths(f, f.path, tree);
	});
	return { tree, longestPath, validFiles, invalidFiles };
};

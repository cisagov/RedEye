import type { DirectoryFile, DirectoryTree } from '../../../types';
import { DirectorWorkerType } from '../../../types';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

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
		f.path = f.webkitRelativePath.split('/');
		if (f.path.some((pathItem) => pathItem.startsWith('.'))) return;
		// if path is not <date_folder>/<ip_address> or <date_folder>/<file> return;
		if (
			!(
				(f.path[f.path.length - 2]?.match(ipRegex) && f.path[f.path.length - 3]?.match(dateFolder)) ||
				(f.path[f.path.length - 3]?.match(ipRegex) && f.path[f.path.length - 4]?.match(dateFolder)) ||
				f.path[f.path.length - 2]?.match(dateFolder) ||
				f.path[f.path.length - 3]?.match(dateFolder)
			)
		)
			return;
		// If jpg and not in screenshots folder, don't use
		if ((f.name.endsWith('.jpg') || f.name.endsWith('.png')) && f.path[f.path.length - 2] !== 'screenshots') return;
		// If txt and not in keystrokes, don't use
		if (f.name.endsWith('.txt') && f.path[f.path.length - 2] !== 'keystrokes') return;
		// If log and not in ip folder, date folder or unknown folder, return
		if (
			f.name.endsWith('.log') &&
			!(
				f.path[f.path.length - 2].match(ipRegex) ||
				f.path[f.path.length - 2].match(dateFolder) ||
				f.path[f.path.length - 2] === 'unknown'
			)
		)
			return;

		// If passed all, add to tree
		validFiles.push(f);
		longestPath = f.path.length > longestPath.length ? f.path : longestPath;
		tree = createTreeFromPaths(f, f.path, tree);
	});
	return { tree, longestPath, validFiles, invalidFiles };
};

ctx.addEventListener('message', (event) => {
	const { tree, validFiles, invalidFiles } = validateFiles(event.data.acceptedFiles);
	if (!validFiles.length) throw Error('No Valid Files Found');
	ctx.postMessage({ type: DirectorWorkerType.FILES, validFiles, invalidFiles });
	// Create servers or return error
	const rootDirectory = Object.keys(tree)[0];
	// If not a multi server, use root directory name as server name
	if (!event.data.multiServerUpload) {
		const files = flattenTree(tree[rootDirectory] as DirectoryTree);
		ctx.postMessage({ type: DirectorWorkerType.SERVER_FILES, serverFiles: files, serverName: rootDirectory });
	} else {
		// Use the directory trees under root directory as servers
		Object.entries(tree[rootDirectory]).forEach(([key, value]: [string, DirectoryTree]) => {
			const serverName = key.split('/')[0];
			const files = flattenTree(value);
			ctx.postMessage({ type: DirectorWorkerType.SERVER_FILES, serverFiles: files, serverName });
		});
	}
	ctx.postMessage({ type: DirectorWorkerType.FINISHED });
});

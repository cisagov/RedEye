// eslint-disable-next-line no-restricted-globals
const ctx = self;
const dateFolder = /^\d{6}$/;
const ipRegex =
	/^(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})$/;

const DirectorWorkerType = {};
DirectorWorkerType[(DirectorWorkerType.FILES = 0)] = 'FILES';
DirectorWorkerType[(DirectorWorkerType.SERVER_FILES = 1)] = 'SERVER_FILES';
DirectorWorkerType[(DirectorWorkerType.FINISHED = 2)] = 'FINISHED';

const createTreeFromPaths = function (file, path, tree) {
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
var flattenTree = function (tree, path) {
	if (path === void 0) {
		path = [];
	}
	const files = [];
	for (let _i = 0, _a = Object.entries(tree); _i < _a.length; _i++) {
		const _b = _a[_i];
		const key = _b[0];
		const file = _b[1];
		if (file.name) {
			files.push(file);
		} else {
			files.push.apply(files, flattenTree(file, path.concat(key)));
		}
	}
	return files;
};
const validateFiles = function (files) {
	const invalidFiles = [];
	const validFiles = [];
	// Validate files and create file tree from flat list
	let tree = {};
	let longestPath = [];
	files === null || files === void 0
		? void 0
		: files.forEach(function (f) {
				if (!(f.name.endsWith('.log') || f.name.endsWith('.jpg') || f.name.endsWith('.png') || f.name.endsWith('.txt'))) {
					// Ignore secret/hidden files
					if (!f.name.startsWith('.')) invalidFiles.push(f);
					return;
				}
				f.path = f.webkitRelativePath.split('/');
				if (
					f.path.some(function (pathItem) {
						return pathItem.startsWith('.');
					})
				)
					return;
				// if path is not <date_folder>/<ip_address> or <date_folder>/<file> return;
				if (
					!(
						(f.path[f.path.length - 2].match(ipRegex) &&
							f.path[f.path.length - 3] &&
							f.path[f.path.length - 3].match(dateFolder)) ||
						(f.path[f.path.length - 3] &&
							f.path[f.path.length - 3].match(ipRegex) &&
							f.path[f.path.length - 4] &&
							f.path[f.path.length - 4].match(dateFolder)) ||
						f.path[f.path.length - 2].match(dateFolder) ||
						(f.path[f.path.length - 3] && f.path[f.path.length - 3].match(dateFolder))
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
ctx.addEventListener('message', function (event) {
	const _a = validateFiles(event.data.acceptedFiles);
	const tree = _a.tree;
	const validFiles = _a.validFiles;
	const invalidFiles = _a.invalidFiles;
	if (!validFiles.length) throw Error('No Valid Files Found');
	ctx.postMessage({ type: DirectorWorkerType.FILES, validFiles, invalidFiles });
	// Create servers or return error
	const rootDirectory = Object.keys(tree)[0];
	// If not a multi server, use root directory name as server name
	if (!event.data.multiServerUpload) {
		const files = flattenTree(tree[rootDirectory]);
		ctx.postMessage({ type: DirectorWorkerType.SERVER_FILES, serverFiles: files, serverName: rootDirectory });
	} else {
		// Use the directory trees under root directory as servers
		Object.entries(tree[rootDirectory]).forEach(function (_a) {
			const key = _a[0];
			const value = _a[1];
			const serverName = key.split('/')[0];
			const files = flattenTree(value);
			ctx.postMessage({ type: DirectorWorkerType.SERVER_FILES, serverFiles: files, serverName });
		});
	}
	ctx.postMessage({ type: DirectorWorkerType.FINISHED });
});

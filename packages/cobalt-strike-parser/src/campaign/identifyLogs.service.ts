import { watch } from 'chokidar';

import { isBeaconLog, getBeaconFromPath, isLogFile, findFileName } from '../shared/regex';
import type { ProcessServerLogsMachineContext, BeaconPathsRegistry } from './processServerLogs.machine';

// A tuple of beacons and the paths associated with those beacons
// type BeaconPathsMap = [Beacon, string[]]

// key is the beacon identifier given by cobalt strike
type HandleFileAddArg = {
	ctx: ProcessServerLogsMachineContext;
	path: string;
	beaconPathRegistry: BeaconPathsRegistry;
	fileName: string;
	beaconLogsWithoutBeacons: string[];
	genericLogFiles: string[];
	keystrokeLogs: string[];
	imagePaths: string[];
};

const handleBeaconLog = ({ ctx, path, beaconPathRegistry, beaconLogsWithoutBeacons }: HandleFileAddArg) => {
	const beaconName = getBeaconFromPath(path);
	if (beaconName) {
		const record = beaconPathRegistry[beaconName];
		if (!record) {
			beaconPathRegistry[beaconName] = {
				paths: [path],
				beacon: ctx.beacons.find((beacon) => beacon.beaconName === beaconName),
			};
		} else {
			record.paths.push(path);
		}
		return null;
	} else {
		return beaconLogsWithoutBeacons.push(path);
	}
};

const handleLogAdd = (arg: HandleFileAddArg) => {
	if (isBeaconLog(arg.path)) handleBeaconLog(arg);
	else {
		arg.genericLogFiles.push(arg.path);
	}
};

const handleFileAdd = (arg: HandleFileAddArg) => {
	const { fileName, path, ctx } = arg;
	if (isLogFile(fileName)) handleLogAdd(arg);
	else if (fileName.includes('keystrokes')) {
		arg.keystrokeLogs.push(path);
	} else if (fileName.includes('screen')) {
		arg.imagePaths.push(path);
	} else {
		ctx.logger(`File ${fileName} ignored at ${path}`, {
			level: 'warn',
			tags: ['CAMPAIGN_PARSER', 'identifyLogsService'],
		});
	}
};

export type FolderLogNamesReturn = {
	beaconPathRegistry: BeaconPathsRegistry;
	beaconLogsWithoutBeacons: string[];
	genericLogFiles: string[];
	keystrokeLogs: string[];
	imagePaths: string[];
};

export const parseFolderLogNames = (ctx: ProcessServerLogsMachineContext): Promise<FolderLogNamesReturn> => {
	return new Promise<FolderLogNamesReturn>((resolve, reject) => {
		const beaconPathRegistry: BeaconPathsRegistry = {};
		const beaconLogsWithoutBeacons: string[] = [];
		const genericLogFiles: string[] = [];
		const keystrokeLogs: string[] = [];
		const imagePaths: string[] = [];
		let filesOpened = 0;
		let filesClosed = 0;
		let allFilesOpened = false;
		try {
			const watcher = watch(ctx.folderPath, {
				ignored: /(^|[/\\])\../, // ignore dotfiles
				persistent: false,
			});

			watcher.on('add', (path: string) => {
				filesOpened++;
				const fileName = findFileName(path);
				handleFileAdd({
					path,
					fileName,
					ctx,
					beaconPathRegistry,
					beaconLogsWithoutBeacons,
					genericLogFiles,
					keystrokeLogs,
					imagePaths,
				});
				filesClosed++;
				if (allFilesOpened && filesOpened === filesClosed) {
					resolve({ beaconPathRegistry, beaconLogsWithoutBeacons, genericLogFiles, keystrokeLogs, imagePaths });
				}
			});
			watcher.on('ready', () => {
				allFilesOpened = true;
				if (filesOpened === filesClosed) {
					resolve({ beaconPathRegistry, beaconLogsWithoutBeacons, genericLogFiles, keystrokeLogs, imagePaths });
				}
			});
		} catch (error) {
			ctx.logger('rejected', {
				level: 'error',
				error,
				tags: ['parseFolderLogNames', 'identifyLogsService'],
			});
			reject();
		}
	});
};

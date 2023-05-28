import { Beacon, BeaconLineType, File, FileFlag } from '@redeye/models';
import type { InternalCommand } from './identifyCommandGroupings';
import { findFirstCaptureGroup } from '../shared/baseRegex';

export const splitIndicatorLine = (line: string) => {
	const [, , , , md5, bytes, , fileName] = line.split(/\s/);
	return { md5, bytes, fileName };
};

export const findUploadFileNameFromTaskLine = (line: string) => {
	return findFirstCaptureGroup(/Tasked beacon to upload (\S+)/, line) ?? '';
};

export const processUploadCommand = (command: InternalCommand, beacon?: Beacon) => {
	// There is no output line for the upload command, rather it's an indicator
	const taskLog = command.output.find((log) => log.lineType === BeaconLineType.TASK);
	const indicatorLog = command.output.find((log) => log.lineType === BeaconLineType.INDICATOR);
	const errorLog = command.output.find((log) => log.lineType === BeaconLineType.ERROR);

	if (!errorLog && taskLog && indicatorLog) {
		const location = findUploadFileNameFromTaskLine(taskLog.blob ?? '');
		const { md5, fileName } = splitIndicatorLine(indicatorLog.blob ?? '');
		const file = new File({
			fileFlag: FileFlag.UPLOAD,
			dateTime: indicatorLog.dateTime as Date,
			location,
			fileName,
			beacon,
			md5,
		});
		return file;
	}
	return undefined;
};

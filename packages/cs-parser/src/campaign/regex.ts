import { findFirstCaptureGroup } from '../shared/baseRegex';

const fileNameFromPathRegex = new RegExp(/^(([A-Z]:)?[.]?[\\/]?.*[\\/])*(.+)\.(.+)/);
export function findFileName(string: string) {
	const resultArray = string.match(fileNameFromPathRegex);
	return `${resultArray?.[resultArray.length - 2]}.${resultArray?.[resultArray.length - 1]}`;
}

const beaconFromKeyLoggerNameRegex = new RegExp(/keystrokes_(\d+)\.(\S\.)*(?:txt)/, 'g');
export function beaconFromKeyLoggerName(fileName: string) {
	return findFirstCaptureGroup(beaconFromKeyLoggerNameRegex, fileName);
}

const beaconFromScreenShotNameRegex = new RegExp(/screen_\S+_(\d+)\.(?:jpeg|jpg)/, 'g');
export function getBeaconFromScreenShotName(fileName: string) {
	return findFirstCaptureGroup(beaconFromScreenShotNameRegex, fileName);
}

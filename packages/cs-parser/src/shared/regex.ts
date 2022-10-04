import { findFirstCaptureGroup } from './baseRegex';
export * from './dateTimeRegex';
export * from './beaconRegex';

export function findHostNameFromMetadataLine(line: string) {
	const regex = new RegExp(/computer:[\s]*([^;]+);/, 'g');
	return findFirstCaptureGroup(regex, line);
}

export function findFileName(string: string) {
	const resultArray = string.match(/^(([A-Z]:)?[.]?[\\/]?.*[\\/])*(.+)\.(.+)/);
	return `${resultArray?.[resultArray.length - 2]}.${resultArray?.[resultArray.length - 1]}`;
}

const identifyingDataRegex = new RegExp(/\s<(.+?)>\s/, 'g');
export function findOperatorName(string: string) {
	return findFirstCaptureGroup(identifyingDataRegex, string);
}

// ! untested
export function isLogFile(fileName: string) {
	return /.*\.log/.test(fileName);
}

/**
 * Checks if a given string is a valid IP address
 */
export const isIpAddress = (string: string): boolean => {
	const isIpAddressRegex = new RegExp(
		/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
	);
	return isIpAddressRegex.test(string);
};

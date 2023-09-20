import type { LogEntry } from '@redeye/models';
import { BeaconLineType } from '@redeye/models';
import { findFirstCaptureGroup } from '../shared/baseRegex';

export const findOsFromMetaLine = (line: string) => {
	const regex = new RegExp(/os:[\s]*([^;]+);/, 'g');
	return findFirstCaptureGroup(regex, line);
};

/**
 * Do not use with a metadata line. The IP for the host may often exist in the metadata line but it is not consistent and the first ip in the metadata line is often the origin host
 */
export const findHostIpFromPath = (path: string) => {
	const captureIpAddressRegex = new RegExp(
		/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\b/
	);
	return findFirstCaptureGroup(captureIpAddressRegex, path);
};

export const findPidFromMetaLine = (line: string): number | undefined => {
	const regex = new RegExp(/pid:[\s]*(\d+);/, 'g');
	const match = findFirstCaptureGroup(regex, line);
	// PID always seems to be there but just in case.
	return match ? parseInt(match) : undefined;
};

export const findUserNameFromMetaLine = (line: string) => {
	const regex = new RegExp(/user:[\s]*([^;]+);/, 'g');
	return findFirstCaptureGroup(regex, line);
};

export const findProcessFromMetaLine = (line: string) => {
	const regex = new RegExp(/process:[\s]*([^;]+);/, 'g');
	return findFirstCaptureGroup(regex, line);
};

const emptyCommand = '(empty)';
export const findCommandText = (string: string): string => {
	if (string) {
		// eslint-disable-next-line no-useless-escape
		const regex = new RegExp(/^(?:[0-9\/]+\s[0-9\:]+)(?:\sUTC)?\s?(?:\[[a-z]+\])?\s?(?:\<.+?\>)?\s?(\S*)/, 'gm');
		const arr = string.match(regex);
		return arr?.map((subString) => subString.replace(regex, '$1'))?.[0] || emptyCommand;
	} else {
		return emptyCommand;
	}
};

export const findMetadataOrigin = (line: string) => {
	const regex = new RegExp(/\[metadata\]\s(\S+)/, 'g');
	return findFirstCaptureGroup(regex, line);
};

const getAttackIdsFromBlob = (line: string) => {
	// gets a word wrapped in brackets which is wrapped in a single white space.
	const attackIdsRegex = new RegExp(/\s<(.+?)>\s/, 'g');
	return findFirstCaptureGroup(attackIdsRegex, line)?.split(', ') ?? [];
};

// ! untested
export const findAttackIds = (entries: LogEntry[]): string[] => {
	const tasks = entries.filter((entry) => entry.lineType === BeaconLineType.TASK);
	return tasks.flatMap((task) => getAttackIdsFromBlob(task.blob));
};

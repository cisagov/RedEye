import { BeaconLineType } from '@redeye/models';
import { findFirstCaptureGroup } from './baseRegex';

/**
 * Checks if a log line contains a beacon line type
 */
const beaconTypes: Readonly<string[]> = Object.keys(BeaconLineType);

// ! untested
export const isBeaconLog = (string: string) => {
	return string.includes('beacon_');
};

export const getBeaconFromPath = (path: string) => {
	const regex = new RegExp(/beacon_(\d+)/, 'g');
	return findFirstCaptureGroup(regex, path);
};

// Type validation
export const isTypeBeaconLineType = (
	value: keyof typeof BeaconLineType | string | undefined
): value is BeaconLineType => (value ? beaconTypes.includes(value) : false);

export const findBeaconLineType = (line: string): BeaconLineType | null => {
	const inBracketsRegex = new RegExp(/\[(.+?)\]/, 'g');
	const capturedString = findFirstCaptureGroup(inBracketsRegex, line);
	if (!capturedString) return null;
	const upperCaseCapturedString = capturedString.toUpperCase();
	if (isTypeBeaconLineType(upperCaseCapturedString)) return upperCaseCapturedString;
	return null;
};

export function containsBeaconLineType(string: string): boolean {
	return !!findBeaconLineType(string);
}

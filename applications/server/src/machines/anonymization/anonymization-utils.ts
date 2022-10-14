import { randomBytes } from 'crypto';

export const setIfNewProperty = (previousMatches: Record<string, string>, matchValue: string, replaceValue: string) => {
	if (!previousMatches[matchValue]) previousMatches[matchValue] = replaceValue;
	return previousMatches;
};

export const updateMatches = (previousMatches: Record<string, string>, matchValue: string, replaceValue: string) => {
	return setIfNewProperty(previousMatches, matchValue, replaceValue);
};

export const getRandomReplacement = (size = 15) => {
	return randomBytes(size).toString('hex');
};

export const getCurrentMatch = (currentMatches: string[] = []): [string[], (value: string) => string] => {
	return [
		currentMatches,
		(value: string) => {
			currentMatches.push(value);
			return value;
		},
	];
};

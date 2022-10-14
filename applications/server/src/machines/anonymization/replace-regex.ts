import type { LogEntry } from '@redeye/models';
import { getCurrentMatch, getRandomReplacement, updateMatches } from './anonymization-utils';

/** Regex patterns */
export const ipv4Regex = /((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}/gi;
export const ipv6Regex =
	/(?:^|(?<=\s))(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/gi;
const filePathRegex = /^(.+)\/([^\/]+)$/gi;
const hashRegex = /(?=.*[0-9]+)(?=.*[A-z]*)(?!.*[\\\\\[\]])([A-z0-9#.=_@{}$*+]{16,})/gim;
const passwordRegex = /(password((\s:)|(:)|(\s:\s)|(=))+(.{1,32}))/gim;
const fileExtensionRegex = /(\.[a-zA-Z0-9]{1,5})$/gi;

type ReplaceFunction = (
	blob: LogEntry['blob'],
	previousMatches: Record<string, string>,
	currentMatches?: string[]
) => LogEntry['blob'];

/** Replace functions */
export const replaceBlobValues: ReplaceFunction = (blob, previousMatches, currentMatches) => {
	if (!currentMatches) {
		return Object.entries(previousMatches).reduce((prev, [key, value]) => prev.replaceAll(key, value), blob);
	} else {
		return currentMatches.reduce((prev, key) => prev.replaceAll(key, previousMatches[key]), blob);
	}
};

export const replaceHashes: ReplaceFunction = (blob, previousMatches) => {
	const [currentMatches, updateMatch] = getCurrentMatch();
	const hashes = blob.matchAll(hashRegex);
	if (hashes) {
		for (const hash of hashes) {
			// If not a file path, a file name with file extension or a value of null
			if (!filePathRegex.test(hash[0]) && !hash[0].includes('null') && !hash[0].match(fileExtensionRegex)) {
				const matchedValue = updateMatch(hash[0].trim());
				previousMatches = updateMatches(previousMatches, matchedValue, getRandomReplacement());
			}
		}
	}
	return replaceBlobValues(blob, previousMatches, currentMatches);
};

export const replacePasswords: ReplaceFunction = (blob, previousMatches) => {
	const [currentMatches, updateMatch] = getCurrentMatch();
	for (const line of blob.split('\n')) {
		const passwords = line.matchAll(passwordRegex)?.next()?.value as RegExpMatchArray;
		if (passwords) {
			const matchedValue = updateMatch(passwords[passwords.length - 1]?.trim());
			previousMatches = updateMatches(previousMatches, matchedValue, `anonymize-password-${getRandomReplacement()}`);
		}
	}
	return replaceBlobValues(blob, previousMatches, currentMatches);
};

export const replaceDomainsAndIps: ReplaceFunction = (blob, previousMatches) => {
	const [currentMatches, updateMatch] = getCurrentMatch();
	const ipv4s = blob.matchAll(ipv4Regex);
	const ipv6s = blob.matchAll(ipv6Regex);
	for (const line of blob.split('\n')) {
		const domainMatch = line.matchAll(/^domain.*:(.*)$/gi)?.next()?.value as RegExpMatchArray;
		if (domainMatch?.length) {
			const matchedValue = updateMatch(domainMatch[1].trim());
			previousMatches = updateMatches(previousMatches, matchedValue, `anonymized-domain-${getRandomReplacement(4)}`);
		}
	}

	if (ipv4s) {
		for (const ipv4 of ipv4s) {
			const matchedValue = updateMatch(ipv4[0].trim());
			previousMatches = updateMatches(previousMatches, matchedValue, `anonymized-ipv4-${getRandomReplacement(4)}`);
		}
	}
	if (ipv6s) {
		for (const ipv6 of ipv6s) {
			const matchedValue = updateMatch(ipv6[0].trim());
			previousMatches = updateMatches(previousMatches, matchedValue, `anonymized-ipv6-${getRandomReplacement(4)}`);
		}
	}

	return replaceBlobValues(blob, previousMatches, currentMatches);
};

import type { AnyModel, ProcessedSearchItem } from '@redeye/client/types/search';
import { UtilityStyles, Txt } from '@redeye/ui-styles';
import type { ReactNode } from 'react';
import type { AppStore } from '../../../store';

export const searchableKeys = [
	// Commands
	'input.current.log.current.blob',
	'input.current.log.current.filePath',
	'output.current.blob',
	'output.current.filePath',
	'task.current.blob',
	'task.current.filePath',
	// Other
	'ip',
	'pid',
	'userName',
	'hostName',
	'os',
	'name',
];

export const getPaths = (store: AppStore, { server, host, beacon }: any): (string | null | undefined)[] => {
	if (beacon) {
		const beaconModel = store.graphqlStore.beacons.get(beacon)!;
		return [
			store.graphqlStore.servers.get(server)?.displayName,
			store.graphqlStore.hosts.get(host)?.displayName,
			[beaconModel.displayName, beaconModel.meta[0]?.current.username].join(' '),
		];
	}
	if (host)
		return [
			store.graphqlStore.servers.get(server)?.displayName, //
			store.graphqlStore.hosts.get(host)?.displayName,
		];
	if (server)
		return [
			store.graphqlStore.servers.get(server)?.displayName, //
		];
	else return [];
};

function resolve(path, obj, separator = '.') {
	const properties = Array.isArray(path) ? path : path.split(separator);
	return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export function getValue(parent, value) {
	for (const prop of searchableKeys) {
		const v = resolve(prop, parent);
		if (v && new RegExp(value, 'ig').test(v)) {
			return v;
		}
	}
}

// Sanitize input for use in regex
function sanitizeRegex(text: string): string {
	return (text ?? '').replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}

export function tokenize(str) {
	return str.split(/\s/gi);
}

function createRegex(pattern: string) {
	return `(?:${tokenize(sanitizeRegex(pattern)).join('|')})`;
}

export const highlightPattern = (text?: string, pattern?: string): ReactNode => {
	if (!text) return null;
	if (!pattern) return text;

	const regEx = new RegExp(createRegex(pattern), 'ig');
	const splitText = text?.split?.(regEx) || '';
	if (splitText.length <= 1) return text;

	const matches = text.match(regEx);
	if (!matches) return text;

	return splitText.reduce<ReactNode[]>(
		(arr, element, index) =>
			matches[index]
				? [
						...arr,
						element,
						// eslint-disable-next-line react/no-array-index-key
						<Txt key={`${element}-${index}`} css={UtilityStyles.textHighlight}>
							{matches[index]}
						</Txt>,
				  ]
				: [...arr, element],
		[]
	);
};

/** https://stackoverflow.com/a/7228322/5648839 */
export const randomIntFromInterval = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const placeholderOfInterval = (min: number, max: number) =>
	new Array(randomIntFromInterval(min, max)).fill('-').join('');

/** TODO: what does this do? */
export function getMatchValue(result: ProcessedSearchItem<AnyModel>): { field?: string; value?: string } {
	const attributeNames = Object.values(result.match).flat();
	if (attributeNames.includes('names') || attributeNames.length === 0) {
		return {};
	}
	const targetAttributeName = attributeNames[0];

	const field = result.fieldToNamesLookup[targetAttributeName];
	return {
		field,
		value: result[targetAttributeName],
	};
}

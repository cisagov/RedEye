import type { AnyModel, ProcessedSearchItem } from '@redeye/client/types/search';
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
		return [
			store.graphqlStore.servers.get(server)?.computedName,
			store.graphqlStore.hosts.get(host)?.computedName,
			store.graphqlStore.hosts.get(beacon)?.computedName,
		];
	}
	if (host)
		return [
			store.graphqlStore.servers.get(server)?.computedName, //
			store.graphqlStore.hosts.get(host)?.computedName,
		];
	if (server)
		return [
			store.graphqlStore.servers.get(server)?.computedName, //
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

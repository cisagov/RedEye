import { GraphHandler } from './GraphHandler';

export function defNum(value: number | undefined | null): number {
	return !value ? 0 : value;
}

export const setMapKeyIfUnset = <T extends Map<string, V>, V>(map: T, key: string, value: V): V | undefined => {
	if (!map.has(key)) {
		map.set(key, value);
	}
	return map.get(key);
};

export const noOp = () => undefined;

export type TestableWindow = typeof window & {
	Cypress: any; // ??
	graph: GraphHandler; // ??
};
// TODO: @Sebastian - this needs to be updated...
export function initializeTesting(graph: TestableWindow['graph']) {
	const testableWindow = window as TestableWindow;
	if (testableWindow.Cypress) {
		testableWindow.graph = graph;
	}
}

export function dedupeSortArray(array: string[]): string[] {
	return [...new Set(array)].sort();
}

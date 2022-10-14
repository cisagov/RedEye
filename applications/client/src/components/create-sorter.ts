import type { SortOption } from '../store';

/** Creates a generic sorter for a specific property and for ascending and descending */
export function createSorter<T>(
	sort?: SortOption | null | undefined | string | ((arg0: T) => any),
	isAscending: boolean = true
): (a: T, b: T) => number {
	if (!sort) return () => 0;
	return (aFull, bFull) => {
		// Select the values
		let a;
		let b;
		if (typeof sort === 'function') {
			a = sort(aFull);
			b = sort(bFull);
		} else {
			a = aFull[sort!];
			b = bFull[sort!];
		}

		// Check for undefined things (use == null so we catch undefined/null values)
		if (a == null || b == null) {
			if (a || b) {
				// either a or b is undefined (exclusively)
				if (!a) {
					return 1; // b should appear above a
				} else {
					return -1; // a should appear above b
				}
			} else {
				// both are undefined
				return 0;
			}
		}

		// case insensitive for strings
		if (typeof a === 'string' && typeof b === 'string') {
			a = a.toUpperCase();
			b = b.toUpperCase();
		}

		let returnVal = 0; // initially assume a === b
		if (a < b) {
			// a is less than b by some ordering criterion
			returnVal = -1;
		} else if (a > b) {
			// a is greater than b by the ordering criterion
			returnVal = 1;
		}

		// Reverse-ish ordering if descending
		if (!isAscending) {
			returnVal = -returnVal;
		}
		return returnVal;
	};
}

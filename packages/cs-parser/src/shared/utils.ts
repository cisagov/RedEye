import { resolve, join } from 'path';

export function removeEmptyGuard<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

export const getRuntimeDir = () => {
	if (process.pkg) {
		return resolve(process.execPath, '..');
	} else {
		return join(__dirname, '..');
	}
};

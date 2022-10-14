export function isDefined<T>(argument: T | undefined | unknown): argument is T {
	return argument !== undefined;
}

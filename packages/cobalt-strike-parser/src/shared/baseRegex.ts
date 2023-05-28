// Regex utilities not intended to be used by the parser directly

// ! untested
export function findFirstCaptureGroup(regex: RegExp, string: string): string | undefined {
	const arr = string.match(regex);
	return arr?.map((subString) => subString.replace(regex, '$1'))?.[0];
}

import { AES, SHA256, enc } from 'crypto-js';
import type { ConfigDefinition } from './config';

export function encrypt(config: ConfigDefinition, obj: Object): string {
	const { secret } = config;
	const stringified = JSON.stringify(obj);
	const words = AES.encrypt(stringified, secret);
	return words.toString();
}

export function decrypt<T extends Object>(
	config: ConfigDefinition,
	string: string,
	validate?: (obj: Object) => boolean
): T | null {
	try {
		const { secret } = config;
		const decryptedString = AES.decrypt(string, secret).toString(enc.Utf8);
		const parsedObj = JSON.parse(decryptedString) as T;
		if (validate) {
			return validate(parsedObj) ? parsedObj : null;
		} else {
			return parsedObj;
		}
	} catch (e) {
		return null;
	}
}

export function hash(message: string): string {
	return SHA256(message).toString();
}

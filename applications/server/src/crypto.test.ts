import { encrypt, decrypt, hash } from './crypto';
import type { ConfigDefinition } from './config';

const testHash = hash('boop');

describe('Encryption and decryption tests', () => {
	test('Encrypt and decrypt back', () => {
		const config: Partial<ConfigDefinition> = { secret: 'MY SUPER SECRET SECRET' };

		const mockConfig = config as ConfigDefinition;

		const originalObj = { test: 'TEST', expiration: new Date().toISOString() };
		const encryptedObj = encrypt(mockConfig, originalObj);
		const decryptedObj = decrypt(mockConfig, encryptedObj);
		expect(decryptedObj).toEqual(originalObj);
	});
	describe('Hashing to be deterministic', () => {
		expect(hash('boop')).toEqual(hash('boop'));
		expect(hash('boop')).toEqual(testHash);
	});
});

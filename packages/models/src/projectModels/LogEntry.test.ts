import { sanitizeBadCharacters } from './LogEntry';
import { sadText, fixedText } from './LogEntry.mock';

test('Text sanitization', () => {
	expect(sanitizeBadCharacters(sadText)).toEqual(fixedText);
});

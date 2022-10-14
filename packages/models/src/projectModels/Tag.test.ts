import { Tag } from './Tag';

describe('Tag search tests', () => {
	test('find all tags', () => {
		expect(Tag.matchTags('Oh dear, there are no tags in this string')).toEqual([]);
		expect(Tag.matchTags('find all #tags')).toEqual(['#tags']);
		expect(Tag.matchTags('This is my #test and these are my #tags')).toEqual(['#test', '#tags']);
		expect(Tag.matchTags('#wait#thats#not#illegal')).toEqual(['#wait', '#thats', '#not', '#illegal']);
		expect(Tag.matchTags('#wait-that-should-be-illegal')).toEqual(['#wait-that-should-be-illegal']);
		expect(Tag.matchTags('#Mumblecore #yr #synth #humblebrag #kale_chips')).toEqual([
			'#Mumblecore',
			'#yr',
			'#synth',
			'#humblebrag',
			'#kale_chips',
		]);
		expect(Tag.matchTags('#MFW all my #tests pass 🤓')).toEqual(['#MFW', '#tests']);
	});
});

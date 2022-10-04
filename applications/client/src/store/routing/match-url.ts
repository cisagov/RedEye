/**
 * MIT License
 *
 * Copyright (c) 2020 Naresh Bhatia
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Modified 2021 - Austin Golding
 */
import type { Key } from 'path-to-regexp';
import { pathToRegexp } from 'path-to-regexp';

interface PatternInfo {
	regExp: RegExp;
	keys: Key[];
}

interface PatternInfoCache {
	[pattern: string]: PatternInfo;
}

const patternInfoCache: PatternInfoCache = {};

const getPatternInfo = (pattern: string): PatternInfo => {
	const patternInfo = patternInfoCache[pattern];
	if (patternInfo) return patternInfo;
	const keys: Key[] = [];
	const regExp = pathToRegexp(pattern, keys);
	patternInfoCache[pattern] = { regExp, keys };
	return patternInfoCache[pattern];
};

export const matchUrl = (url: string, pattern: string): Record<string, any> | undefined => {
	const { regExp, keys } = getPatternInfo(pattern);
	const match = regExp.exec(url);
	if (!match) return undefined;

	const [, ...values] = match;

	return keys.reduce((params: Record<string, string>, key, index) => {
		params[key.name] = !values[index] ? values[index] : decodeURIComponent(values[index]);
		return params;
	}, {});
};

import { UtilityStyles } from '@redeye/ui-styles';
import type { ReactNode } from 'react';

// Sanitize input for use in regex
function sanitizeRegex(text: string): string {
	return (text ?? '').replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');
}

function tokenize(str) {
	return str.split(/\s/gi);
}

function createRegex(pattern: string) {
	return `(?:${tokenize(sanitizeRegex(pattern)).join('|')})`;
}

export const highlightPattern = (text?: string, pattern?: string): ReactNode => {
	if (!text) return null;
	if (!pattern) return text;

	const regEx = new RegExp(createRegex(pattern), 'ig');
	const splitText = text?.split?.(regEx) || '';
	if (splitText.length <= 1) return text;

	const matches = text.match(regEx);
	if (!matches) return text;

	return splitText.reduce<ReactNode[]>(
		(arr, element, index) =>
			matches[index]
				? [
						...arr,
						element,
						// eslint-disable-next-line react/no-array-index-key
						<span key={`${element}-${index}`} css={UtilityStyles.textHighlight}>
							{matches[index]}
						</span>,
				  ]
				: [...arr, element],
		[]
	);
};

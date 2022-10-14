export const updatePopper = document.createEvent('Event');
updatePopper.initEvent('resize', true, false);
// this forces Popper.js to update any instances by triggering a native window resize event
// document.dispatchEvent(updatePopper);

/**
 * Escapes arbitrary text to get it ready for regex. (like for user search text input)
 * @param text
 */
export function escapeRegExpChars(text: string) {
	return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

export const externalLinkAttributes = {
	target: '_blank',
	rel: 'noopener noreferrer',
};

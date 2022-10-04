import { Intent, Toaster } from '@blueprintjs/core';

export function copyText(textRaw: string) {
	const text = textRaw.replace(/\n/gi, '\r\n');
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(
		() => {
			toast(`Copied ${textRaw.length} char(s)`);
			window.console.log('Async: Copying to clipboard was successful!');
		},
		(err) => {
			window.console.error('Async: Could not copy text: ', err);
		}
	);
}

function fallbackCopyTextToClipboard(text) {
	const textArea = document.createElement('textarea');
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		const msg = successful ? 'successful' : 'unsuccessful';
		toast('Copied');
		window.console.log(`Fallback: Copying text command was ${msg}`);
	} catch (err) {
		window.console.error('Fallback: Oops, unable to copy', err);
	}

	document.body.removeChild(textArea);
}

export function toast(message: string) {
	const toaster = Toaster.create();
	toaster.show({ message, intent: Intent.PRIMARY, timeout: 2000 });
}

import { css } from '@emotion/react';

// font import
import './font-face-ibm-plex-local.css';
import './font-face-redacted-script-local.css';

export const redactedFontClassName = 'RedactedFont';

// maybe put this on parts of the UI that don't display data
export const unRedactedFontClassName = 'UnRedactedFont';

export const fontSettings = css`
	:root {
		&,
		.${unRedactedFontClassName} {
			--pt-font-family-sans: 'IBM Plex Sans', 'Helvetica Neue', -apple-system, 'Segoe UI', Arial, sans-serif;
			--pt-font-family-monospace: 'IBM Plex Mono', Menlo, Consolas, monospace;

			font-family: var(--pt-font-family-sans);

			code,
			pre {
				font-family: var(--pt-font-family-monospace);
			}
		}
		&.${redactedFontClassName}, & .${redactedFontClassName} {
			--pt-font-family-sans: 'Redacted Script';
			--pt-font-family-monospace: 'Redacted Script';
		}
	}
`;

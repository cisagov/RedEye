import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { TokensAll } from 'blueprint-styler/base/tokens';

export const extensionStyles = css`
	/* add these back to blueprint styler */

	/* TODO: notice/callout */

	.${Classes.DIALOG_HEADER} .${Classes.BUTTON} {
		.${Classes.ICON}, .${Classes.ICON_LARGE} {
			margin-right: initial; // reset
		}
	}

	.bp4-daterangepicker {
		.DayPicker-Day {
			&--hovered-range {
				color: ${TokensAll.PtTextColor};
				background-color: ${TokensAll.Gray1};
				&-end {
				}
			}
			&--selected-range {
			}
		}
	}
`;

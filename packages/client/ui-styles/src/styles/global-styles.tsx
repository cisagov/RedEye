import { Card, Classes, Tabs } from '@blueprintjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
// import { plexFontFace } from './font-face-local';
import { extensionStyles } from './ibm-carbon-extension-styles';
import { CoreTokens } from '../styles/tokens';

// font import
import './font-face-local.css';

export const disableSelectionClassName = 'disable-selection';
export const globalStyle = css`
	.toast-class {
		z-index: 999;
	}
	html,
	body {
		background-color: ${CoreTokens.Background0};
	}

	html,
	body,
	#root {
		height: 100%;
		width: 100%;
	}

	body {
		/* overflow: hidden; */ // we might need this
	}

	code,
	pre {
		font-family: ${CoreTokens.FontFamilyMonospace};
	}

	.${Classes.DIALOG_CONTAINER} {
		/* DialogCustom.tsx */
		align-items: flex-start;
		/* so it doesn't jump y if the content resizes */
	}
	.${Classes.DIALOG_HEADER} {
		padding-left: 1rem;
	}

	.${disableSelectionClassName} {
		user-select: none;
	}

	${extensionStyles}// button ellipsis
`;

export const FlexSplitter = styled.div`
	flex: 1 1 auto;
`;

export const TabsStyled = styled(Tabs)`
	overflow: hidden; // ???
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;

	.${Classes.TAB_LIST} {
		flex: 0 0 auto;
		padding: 0 1.5rem;
		border-bottom: 1px solid ${CoreTokens.BorderEmphasis};
		z-index: 1;
	}
	.${Classes.TAB_INDICATOR} {
		margin-bottom: -1px;
		height: 1px;
	}
	.${Classes.TAB_PANEL} {
		flex: 1 1 auto;
		margin: 0;
		overflow: hidden;

		&[aria-hidden='false'] {
			display: flex;
		}
		flex-direction: column;
	}
`;

export const CardStyled = styled(Card)`
	padding: unset;
	background-color: ${CoreTokens.Background1};
`;

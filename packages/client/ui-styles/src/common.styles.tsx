import { Card, Classes, Tabs } from '@blueprintjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
// import { plexFontFace } from './font-face-local';
import { extensionStyles } from './ibm-carbon-extensions';
import { Styles } from './text.styles';
import { Tokens } from './tokens';

// font import
import './font-face-local.css';

export const disableSelectionClassName = 'disable-selection';
export const globalStyle = css`
	.toast-class {
		z-index: 999;
	}
	html,
	body {
		background-color: ${Tokens.CoreTokens.Background0};
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
		font-family: ${Tokens.Variables.PtFontFamilyMonospace};
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

	${extensionStyles}// button elipsis
`;

export const FlexSplitter = styled.div`
	flex: 1 1 auto;
`;

/** @deprecated use Styles.textMeta */
export const textMeta = Styles.textMeta;

export const TabsStyled = styled(Tabs)`
	overflow: hidden; // ???
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;

	.${Classes.TAB_LIST} {
		flex: 0 0 auto;
		padding: 0 1.5rem;
		border-bottom: 1px solid ${Tokens.CoreTokens.BorderEmphasis};
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
	background-color: ${Tokens.CoreTokens.Background1};
`;

export const fillNoOverflowStyle = css`
	height: 100%;
	width: 100%;
	overflow: hidden;
`;

/**
 * Hover to a parent to reveal children
 * give the parent a css={[hoverRevealChildrenType]} and the child a className={hoverRevealClassName}
 */
export const hoverRevealClassName = 'hoverReveal';
export const hoverRevealChildrenVisibility = css`
	&:not(:hover) {
		.${hoverRevealClassName} {
			visibility: hidden;
		}
	}
`;
export const hoverRevealChildrenDisplay = css`
	&:not(:hover) {
		.${hoverRevealClassName} {
			display: none;
		}
	}
`;

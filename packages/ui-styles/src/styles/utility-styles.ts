import { css } from '@emotion/react';
import { innerBoxShadow, innerBoxShadowOverlay } from './shadow-styles';
import { AdvancedTokens, CoreTokens } from './tokens';

/**
 * Hover to a parent to reveal children
 * give the parent a css={[hoverRevealChildrenType]} and the child a className={hoverRevealClassName}
 */
const hoverRevealClassName = 'hoverReveal';
const hoverRevealChildrenVisibility = css`
	&:not(:hover) {
		.${hoverRevealClassName} {
			visibility: hidden;
		}
	}
`;
const hoverRevealChildrenOpacity = css`
	&:not(:hover) {
		.${hoverRevealClassName} {
			opacity: 0;
		}
	}
`;
const hoverRevealChildrenDisplay = css`
	&:not(:hover) {
		.${hoverRevealClassName} {
			display: none;
		}
	}
`;

export const UtilityStyles = {
	/** all caps small text - tiny title */
	textMeta: css`
		text-transform: uppercase;
		/* font-family: ${CoreTokens.FontFamilyMonospace}; */
		font-weight: ${CoreTokens.FontWeightBold};
		letter-spacing: 0.05ch;
	`,

	textRunning: css`
		line-height: 1.5;
	`,

	/** text will ellipsis on one line instead of wrapping... */
	textEllipsis: css`
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
	`,

	textHighlight: css`
		font-weight: ${CoreTokens.FontWeightBold};
		text-decoration: underline;
		color: ${CoreTokens.TextBody};
		background-color: hsla(${AdvancedTokens.PtIntentPrimaryHsl}, 0.6);
		border-radius: 2px;
		margin: 0 -1px;
		padding: 0 1px;
	`,

	fillNoOverflowStyle: css`
		height: 100%;
		width: 100%;
		overflow: hidden;
	`,

	innerBoxShadow,
	innerBoxShadowOverlay,

	hoverRevealClassName,
	hoverRevealChildrenVisibility,
	hoverRevealChildrenOpacity,
	hoverRevealChildrenDisplay,
};

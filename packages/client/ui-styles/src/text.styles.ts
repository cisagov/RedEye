import { css } from '@emotion/react';
import { AdvancedTokens, CoreTokens } from './tokens';

export const Styles = {
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

	// shadowGradient: (position: "top" | "left" | "right" | "bottom" = "top") => css`
	//   background-image: linear-gradient(from ${position}, ${CoreTokens.ShadowGradientColors});
	// `,
};

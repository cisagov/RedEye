import { css } from '@emotion/react';
import { TokensAll } from './tokens';

export const Styles = {
	/** all caps small text - tiny title */
	textMeta: css`
		text-transform: uppercase;
		/* font-family: ${TokensAll.PtFontFamilyMonospace}; */
		font-weight: ${TokensAll.FontWeightBold};
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
		font-weight: ${TokensAll.FontWeightBold};
		text-decoration: underline;
		color: ${TokensAll.ForegroundColorNormal};
		background-color: hsla(${TokensAll.PtIntentPrimaryHsl}, 0.6);
		border-radius: 2px;
		margin: 0 -1px;
		padding: 0 1px;
	`,

	// shadowGradient: (position: "top" | "left" | "right" | "bottom" = "top") => css`
	//   background-image: linear-gradient(from ${position}, ${TokensAll.ShadowGradientColors});
	// `,
};

import { css } from '@emotion/react';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { TokensAll } from '@redeye/ui-styles';

export const goldenTicketClassName = 'golden-ticket';

export const GraphTokens = {
	PresentFgColor: TokensAll.Gray3,
	PresentBgColor: TokensAll.DarkGray3,

	FutureFgColor: TokensAll.Black, // Black?
	FutureBgColor: TokensAll.DarkGray2, // DarkGray2?
	FutureDasharray: '0px 6px', // Dotted

	PastFgColor: TokensAll.DarkGray5,
	PastBgColor: TokensAll.DarkGray2,
	PastDasharray: '4px 4.5px', // Dashed

	SelectedFgColor: TokensAll.LightGray2,
	SelectedThickness: '3px',

	PreviewFgColor: TokensAll.White,
	PreviewThickness: '2px',

	SelectedFocusFgColor: TokensAll.Primary3,
	SelectedFocusBgColor: TokensAll.Primary1,
};

export const graphStyles = css`
	/** TEMP */
	.${goldenTicketClassName} {
		stroke: gold;
	}

	/* INTERACTION AND CONFIG */
	cursor: grab;
	&:active {
		cursor: grabbing;
	}
	.${GCN.superNode}, .${GCN.subNode} {
		cursor: pointer;
	}
	.${GCN.groupNode} {
		/* pointer-events: none; */ // set in code
	}
	&:not(.${GCN.isZooming}) .${GCN.superNode} {
		transition: r 0.2s cubic-bezier(0, 1, 0, 1);
	}
	.${GCN.occludedLabel} {
		display: none;
	}
	.${GCN.parentLinkNode} {
		display: none;
	}

	stroke-linecap: round;
	stroke-linejoin: round;

	text {
		font-size: ${TokensAll.FontSizeSmall};
		/* Need font and color for SVG Export -> */
		fill: ${TokensAll.LightGray5};
		font-family: ${TokensAll.PtFontFamilySans};
		/* <- Need font and color for SVG Export */
		stroke: ${TokensAll.Background0};
		paint-order: stroke;
		stroke-width: 3px;
		&.${GCN.selectedFocus} {
			font-weight: ${TokensAll.FontWeightBold};
			fill: ${GraphTokens.PreviewFgColor};
		}
	}

	.${GCN.groupGraph} {
		.${GCN.subNode} {
			fill: ${GraphTokens.SelectedFgColor};
		}
		line {
			stroke: ${GraphTokens.SelectedFgColor};
		}
	}

	line {
		stroke: ${GraphTokens.PresentFgColor};
		stroke-width: 2px;

		&.${GCN.past} {
			stroke: ${GraphTokens.PastFgColor};
			stroke-dasharray: ${GraphTokens.PastDasharray};
		}
		&.${GCN.future} {
			stroke: ${GraphTokens.FutureFgColor};
			stroke-dasharray: ${GraphTokens.FutureDasharray};
		}

		&.${GCN.selected} {
			stroke: ${GraphTokens.SelectedFgColor};
			stroke-width: ${GraphTokens.SelectedThickness};
		}
		&.${GCN.previewed} {
			stroke: ${GraphTokens.PreviewFgColor};
		}
	}
	circle {
		stroke-width: 1px;
	}

	.${GCN.groupNode} {
		fill: none;
		stroke: hsl(${TokensAll.WhiteHsl}, 0.03);
	}

	.${GCN.superNode} {
		fill: ${GraphTokens.PresentBgColor};
		stroke: ${GraphTokens.PresentFgColor};

		&.${GCN.past} {
			fill: ${GraphTokens.PastBgColor};
			stroke: ${GraphTokens.PastFgColor};
		}
		&.${GCN.future} {
			fill: ${GraphTokens.FutureBgColor};
			stroke: ${GraphTokens.FutureFgColor};
		}

		&.${GCN.previewed} {
			stroke-width: ${GraphTokens.PreviewThickness};
		}
		&.${GCN.selected} {
			stroke: ${GraphTokens.SelectedFgColor};
			stroke-width: ${GraphTokens.SelectedThickness};
		}
		&.${GCN.previewed} {
			stroke: ${GraphTokens.PreviewFgColor};
		}
		&.${GCN.selectedFocus} {
			fill: ${GraphTokens.SelectedFocusBgColor};
			stroke: ${GraphTokens.PreviewFgColor};
		}
	}

	.${GCN.superNodeCountLabel} {
		&.${GCN.past} {
			fill: ${TokensAll.PtTextColorMuted};
		}
		&.${GCN.future} {
			fill: ${TokensAll.PtTextColorDisabled};
		}
	}

	.${GCN.serverNode} {
		fill: ${GraphTokens.PresentFgColor};
		stroke: ${GraphTokens.PresentBgColor};
	}

	.${GCN.subNode} {
		fill: ${GraphTokens.PresentFgColor};
		stroke: ${GraphTokens.PresentBgColor};
		r: 4px;

		&.${GCN.past} {
			fill: ${GraphTokens.PastFgColor};
		}
		&.${GCN.future} {
			fill: ${GraphTokens.FutureFgColor};
		}

		&.${GCN.selected} {
			fill: ${GraphTokens.SelectedFgColor};
			r: 5px;
		}
		&.${GCN.previewed} {
			fill: ${GraphTokens.PreviewFgColor};
		}
		&.${GCN.selectedFocus} {
			fill: ${GraphTokens.SelectedFocusFgColor};
			stroke: ${GraphTokens.PreviewFgColor};
			stroke-width: ${GraphTokens.SelectedThickness};
			r: 6px;
			filter: drop-shadow(0 0 1px ${TokensAll.Black});
		}
	}
`;

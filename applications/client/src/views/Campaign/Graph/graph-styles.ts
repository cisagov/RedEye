import { css } from '@emotion/react';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { CoreTokens } from '@redeye/ui-styles';

export const goldenTicketClassName = 'golden-ticket';

export const GraphTokens = {
	PresentFgColor: CoreTokens.Colors.Gray3,
	PresentBgColor: CoreTokens.Colors.DarkGray3,

	FutureFgColor: CoreTokens.Colors.Black, // Black?
	FutureBgColor: CoreTokens.Colors.DarkGray2, // DarkGray2?
	FutureDasharray: '0px 6px', // Dotted

	PastFgColor: CoreTokens.Colors.DarkGray5,
	PastBgColor: CoreTokens.Colors.DarkGray2,
	PastDasharray: '4px 4.5px', // Dashed

	SelectedFgColor: CoreTokens.Colors.LightGray2,
	SelectedThickness: '3px',

	PreviewFgColor: CoreTokens.Colors.White,
	PreviewThickness: '2px',

	SelectedFocusFgColor: CoreTokens.Intent.Primary3,
	SelectedFocusBgColor: CoreTokens.Intent.Primary1,
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
		font-size: ${CoreTokens.FontSizeSmall};
		/* Need font and color for SVG Export -> */
		fill: ${CoreTokens.Colors.LightGray5};
		font-family: ${CoreTokens.FontFamilySans};
		/* <- Need font and color for SVG Export */
		stroke: ${CoreTokens.Background3};
		paint-order: stroke;
		stroke-width: 3px;
		&.${GCN.selectedFocus} {
			font-weight: ${CoreTokens.FontWeightBold};
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
		stroke: ${CoreTokens.transparentWhite(0.03)};
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
			fill: ${CoreTokens.TextMuted};
		}
		&.${GCN.future} {
			fill: ${CoreTokens.TextDisabled};
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
			filter: drop-shadow(0 0 1px ${CoreTokens.Colors.Black});
		}
	}
`;

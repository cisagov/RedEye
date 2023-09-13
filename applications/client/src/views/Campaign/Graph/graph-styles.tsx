import { css } from '@emotion/react';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { CoreTokens, GraphTokens } from '@redeye/ui-styles';

export const goldenTicketClassName = 'golden-ticket';

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
		/* &:active { cursor: grabbing; } */
	}
	/* .${GCN.groupNode} { pointer-events: none; } // set in GroupGraphRenderer */
	&:not(.${GCN.isZooming}) .${GCN.superNode} {
		transition: r 0.2s cubic-bezier(0, 1, 0, 1);
	}

	/* HIDE LABELS */
	.${GCN.occludedLabel}, .${GCN.hiddenLabel} {
		display: none;
	}
	.${GCN.subNodeNameLabel} {
		// &:not(...) is to avoid incorrectly applied syntax error
		&:not(.${GCN.selectedFocus}):not(.${GCN.previewedFocus}) {
			display: none;
		}
	}

	.${GCN.parentLinkNode} {
		display: none;
	}

	stroke-linecap: round;
	stroke-linejoin: round;

	text {
		font-size: ${CoreTokens.FontSizeSmall};
		/* Need font and color for SVG Export -> */
		fill: ${CoreTokens.TextBody};
		font-family: ${CoreTokens.FontFamilySans};
		/* <- Need font and color for SVG Export */
		stroke: ${GraphTokens.TextOutlineColor};
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
			stroke: ${GraphTokens.PreviewFgColor}; // not GraphTokens.SelectedFgColor
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
		stroke: ${GraphTokens.GroupNodeStrokeColor};
	}

	.${GCN.computerNode} {
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

		&.${GCN.selectedParent} {
			stroke: ${GraphTokens.PreviewFgColor};
		}

		&.${GCN.previewed} {
			stroke-width: ${GraphTokens.PreviewThickness};
		}
		&.${GCN.selected} {
			stroke: ${GraphTokens.PreviewFgColor};
			stroke-width: ${GraphTokens.SelectedThickness};
		}
		&.${GCN.previewed} {
			stroke: ${GraphTokens.PreviewFgColor};
		}
		&.${GCN.selectedFocus} {
			fill: ${GraphTokens.SelectedFocusBgColor};
			stroke: ${GraphTokens.PreviewFgColor}; // not GraphTokens.SelectedFgColor
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

	.${GCN.softwareNode}, .${GCN.serverNode} {
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
			fill: ${GraphTokens.PreviewFgColor}; // not GraphTokens.SelectedFgColor
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

export const showMoreLabelsGraphStyles = css`
	.${GCN.hiddenLabel} {
		display: initial; // show more labels
	}
	.${GCN.superNodeCountLabel}.${GCN.hiddenLabel} {
		display: none; // but still hide the counts
	}
	.${GCN.superGraph} {
		&.${GCN.selectedParent}, &.${GCN.previewedParent} {
			.${GCN.hiddenLabel} {
				fill: ${CoreTokens.TextMuted};
			}
		}
	}
`;

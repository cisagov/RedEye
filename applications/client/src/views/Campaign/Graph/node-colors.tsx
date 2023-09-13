import { css } from '@emotion/react';
import { CoreTokens } from '@redeye/ui-styles';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { Classes } from '@blueprintjs/core';

export const nodeColor = {
	default: { className: 'defaultNode', token: CoreTokens.TextBody, fgToken: 'none', bgToken: 'none' },
	vermilion: {
		className: 'vermilionNode',
		token: CoreTokens.Colors.Vermilion3,
		fgToken: CoreTokens.Colors.Vermilion5,
		bgToken: CoreTokens.Colors.Vermilion1,
	},
	red: {
		className: 'redNode',
		token: CoreTokens.Colors.Red3,
		fgToken: CoreTokens.Colors.Red5,
		bgToken: CoreTokens.Colors.Red1,
	},
	rose: {
		className: 'roseNode',
		token: CoreTokens.Colors.Rose3,
		fgToken: CoreTokens.Colors.Rose5,
		bgToken: CoreTokens.Colors.Rose1,
	},
	violet: {
		className: 'violetNode',
		token: CoreTokens.Colors.Violet3,
		fgToken: CoreTokens.Colors.Violet5,
		bgToken: CoreTokens.Colors.Violet1,
	},
	indigo: {
		className: 'indigoNode',
		token: CoreTokens.Colors.Indigo3,
		fgToken: CoreTokens.Colors.Indigo5,
		bgToken: CoreTokens.Colors.Indigo1,
	},
	/* blue: { // excluded because its the selection color
		className: 'blueNode',
		token: CoreTokens.Colors.Blue3,
		fgToken: CoreTokens.Colors.Blue5,
		bgToken: CoreTokens.Colors.Blue1,
	},
	cerulean: { // excluded because its almost blue
		className: 'ceruleanNode',
		token: CoreTokens.Colors.Cerulean3,
		fgToken: CoreTokens.Colors.Cerulean5,
		bgToken: CoreTokens.Colors.Cerulean1,
	}, */
	turquoise: {
		className: 'turquoiseNode',
		token: CoreTokens.Colors.Turquoise4,
		fgToken: CoreTokens.Colors.Turquoise5,
		bgToken: CoreTokens.Colors.Turquoise1,
	},
	green: {
		className: 'greenNode',
		token: CoreTokens.Colors.Green4,
		fgToken: CoreTokens.Colors.Green5,
		bgToken: CoreTokens.Colors.Green1,
	},
	forest: {
		className: 'forestNode',
		token: CoreTokens.Colors.Forest4,
		fgToken: CoreTokens.Colors.Forest5,
		bgToken: CoreTokens.Colors.Forest1,
	},
	lime: {
		className: 'limeNode',
		token: CoreTokens.Colors.Lime4,
		fgToken: CoreTokens.Colors.Lime5,
		bgToken: CoreTokens.Colors.Lime1,
	},
	gold: {
		className: 'goldNode',
		token: CoreTokens.Colors.Gold4,
		fgToken: CoreTokens.Colors.Gold5,
		bgToken: CoreTokens.Colors.Gold1,
	},
	orange: {
		className: 'orangeNode',
		token: CoreTokens.Colors.Orange3,
		fgToken: CoreTokens.Colors.Orange5,
		bgToken: CoreTokens.Colors.Orange1,
	},
};

export type NodeColor = keyof typeof nodeColor;

export const nodeColors = Object.keys(nodeColor) as NodeColor[];

const iNodeColorStyles = nodeColors
	.filter((colorKey) => colorKey !== 'default')
	.map(
		(colorKey) => css`
			text.${nodeColor[colorKey].className} {
				&:not(.${GCN.superNodeCountLabel}) {
					fill: ${nodeColor[colorKey].fgToken};
				}
			}

			&.${nodeColor[colorKey].className}, .${nodeColor[colorKey].className} {
				color: ${nodeColor[colorKey].fgToken};
				&.${Classes.ICON} {
					color: ${nodeColor[colorKey].token};
				}

				&.${GCN.softwareNode}, &.${GCN.serverNode} {
					fill: ${nodeColor[colorKey].token};
				}

				&.${GCN.computerNode} {
					stroke: ${nodeColor[colorKey].token};
					&.${GCN.selectedFocus} {
						stroke: ${nodeColor[colorKey].fgToken};
						fill: ${nodeColor[colorKey].bgToken};
					}
				}
			}
		`
	);

// we have to do this or our emotion generated class name we be wayyy too long
export const nodeColorStyles = css`
	${iNodeColorStyles}
`;

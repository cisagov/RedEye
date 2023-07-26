import { css } from '@emotion/react';
import { CoreTokens } from '@redeye/ui-styles';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';

export const nodeColor = {
	default: { className: 'defaultNode', token: CoreTokens.TextBody },
	vermilion: { className: 'vermilionNode', token: CoreTokens.Colors.Vermilion3 },
	red: { className: 'redNode', token: CoreTokens.Colors.Red3 },
	rose: { className: 'roseNode', token: CoreTokens.Colors.Rose3 },
	violet: { className: 'violetNode', token: CoreTokens.Colors.Violet3 },
	indigo: { className: 'indigoNode', token: CoreTokens.Colors.Indigo3 },
	// blue: { className: 'blueNode', token: CoreTokens.Colors.Blue3 }, // excluded because its the selection color
	// cerulean: { className: 'ceruleanNode', token: CoreTokens.Colors.Cerulean3 }, // excluded because its almost blue
	turquoise: { className: 'turquoiseNode', token: CoreTokens.Colors.Turquoise4 },
	green: { className: 'greenNode', token: CoreTokens.Colors.Green4 },
	forest: { className: 'forestNode', token: CoreTokens.Colors.Forest4 },
	lime: { className: 'limeNode', token: CoreTokens.Colors.Lime4 },
	gold: { className: 'goldNode', token: CoreTokens.Colors.Gold4 },
	orange: { className: 'orangeNode', token: CoreTokens.Colors.Orange3 },
};

export type NodeColor = keyof typeof nodeColor;

export const nodeColors = Object.keys(nodeColor) as NodeColor[];

const iNodeColorStyles = nodeColors
	.filter((colorKey) => colorKey !== 'default')
	.map(
		(colorKey) => css`
			&.${nodeColor[colorKey].className}, .${nodeColor[colorKey].className} {
				color: ${nodeColor[colorKey].token};
				&.${GCN.softwareNode}, &.${GCN.serverNode} {
					fill: ${nodeColor[colorKey].token};
				}
				&.${GCN.computerNode} {
					stroke: ${nodeColor[colorKey].token};
				}
			}
		`
	);

// we have to do this or our emotion generated class name we be wayyy too long
export const nodeColorStyles = css`
	${iNodeColorStyles}
`;

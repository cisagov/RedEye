import { css } from '@emotion/react';
import { CoreTokens } from '@redeye/ui-styles';

export const nodeColor = {
	default: { className: '', token: CoreTokens.TextBody },
	vermilion: { className: 'vermilionNode', token: CoreTokens.Colors.Vermilion3 },
	red: { className: 'redNode', token: CoreTokens.Colors.Red3 },
	rose: { className: 'roseNode', token: CoreTokens.Colors.Rose3 },
	violet: { className: 'violetNode', token: CoreTokens.Colors.Violet3 },
	indigo: { className: 'indigoNode', token: CoreTokens.Colors.Indigo3 },
	// blue: { className: 'blueNode', token: CoreTokens.Colors.Blue3 }, // excluded because its the selection color
	// cerulean: { className: 'ceruleanNode', token: CoreTokens.Colors.Cerulean3 }, // excluded because its almost blue
	turquoise: { className: 'turquoiseNode', token: CoreTokens.Colors.Turquoise3 },
	green: { className: 'greenNode', token: CoreTokens.Colors.Green3 },
	forest: { className: 'forestNode', token: CoreTokens.Colors.Forest3 },
	lime: { className: 'limeNode', token: CoreTokens.Colors.Lime3 },
	gold: { className: 'goldNode', token: CoreTokens.Colors.Gold3 },
	orange: { className: 'orangeNode', token: CoreTokens.Colors.Orange3 },
};

export type NodeColor = keyof typeof nodeColor;

export const nodeColors = Object.keys(nodeColor) as NodeColor[];

export const nodeColorStyles = css`
	${nodeColors
		.filter((colorKey) => colorKey !== 'default')
		.map((colorKey) => `.${nodeColor[colorKey].className}{ fill: ${nodeColor[colorKey].token}; }`)
		.join(`\n`)}
`;

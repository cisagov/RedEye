import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import type { NodeShape } from '@redeye/graph';
import { polygonShapePointsOpticallyEqualized, RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import type { NodeColor } from './node-colors';
import { nodeColorStyles, nodeColor } from './node-colors';

export type NodeIconProps = ComponentProps<'span'> & {
	type?: 'beacon' | 'server' | 'host';
	shape?: NodeShape;
	color?: NodeColor;
	size?: number;
};

export const NodeIcon = observer<NodeIconProps>(
	({ type = 'beacon', shape = 'circle', color = 'default', size = 16, className, ...props }) => {
		const { center, radius, y, classNames, points, shape2 } = useMemo(() => {
			const iShape = type === 'host' ? 'circle' : type === 'server' ? 'hexagonUp' : shape;
			const isTriangle = shape === 'triangleDown' || shape === 'triangleUp';
			const iCenter = size / 2;
			const iRadius = type !== 'beacon' ? size / 2.5 : isTriangle ? size / 3.5 : size / 3;
			const dy = 1.5;
			const iY = shape === 'triangleDown' ? -dy : shape === 'triangleUp' ? dy : 0;

			const typeClassName = {
				beacon: GCN.softwareNode,
				host: GCN.computerNode,
				server: GCN.serverNode,
			}[type];
			const colorClassName = nodeColor[color].className;
			const iClassNames = [Classes.ICON, className, typeClassName, colorClassName].join(' ');

			const iPoints = iShape === 'circle' ? '' : polygonShapePointsOpticallyEqualized(iShape, iRadius);

			return {
				center: iCenter,
				radius: iRadius,
				y: iY,
				classNames: iClassNames,
				points: iPoints,
				shape2: iShape,
			};
		}, [type, shape, color, size, className]);

		return (
			<span className={classNames} css={nodeColorStyles} {...props}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					css={{ overflow: 'visible' }}
				>
					{type === 'host' ? (
						<circle r={radius + 1} cx={center} cy={center} css={hostStyle} />
					) : shape2 === 'circle' ? (
						<circle r={radius} cx={center} cy={center} css={nodeStyle} />
					) : (
						<polygon points={points} transform={`translate(${center} ${center + y})`} css={nodeStyle} />
					)}
				</svg>
			</span>
		);
	}
);

const nodeStyle = css`
	stroke-width: 1px;
	stroke: ${CoreTokens.Background3};
`;

const hostStyle = css`
	stroke-width: 2px;
	.${nodeColor.default.className} & {
		stroke-width: 1px;
	}
	stroke: currentColor;
	fill: ${CoreTokens.Background3};
`;

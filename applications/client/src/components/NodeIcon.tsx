import { Classes } from '@blueprintjs/core';
import type { NodeShape } from '@redeye/graph';
import { polygonShapePointsOpticallyEqualized } from '@redeye/graph';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type NodeIconProps = ComponentProps<'span'> & {
	shape: NodeShape;
	size?: number;
};

export const NodeIcon = observer<NodeIconProps>(({ shape, size = 16, className, ...props }) => {
	const center = size / 2;
	const radius = size / 3;
	const dy = 1.5;
	const y = shape === 'triangleDown' ? -dy : shape === 'triangleUp' ? dy : 0;
	return (
		<span className={[Classes.ICON, className].join(' ')} css={{}} {...props}>
			<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				{shape === 'circle' ? (
					<circle r={radius} cx={center} cy={center} />
				) : (
					<polygon
						points={polygonShapePointsOpticallyEqualized(shape, radius)}
						transform={`translate(${center} ${center + y})`}
					/>
				)}
			</svg>
		</span>
	);
});

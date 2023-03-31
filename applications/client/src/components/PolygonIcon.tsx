import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import type { PolygonShapeEx } from '@redeye/graph';
import { polygonShapePointsOpticallyEqualized, polygonShapePoints } from '@redeye/graph';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type PolygonIconProps = ComponentProps<'div'> & {
	polygonShape: PolygonShapeEx;
	size?: number;
};

export const PolygonIcon = observer<PolygonIconProps>(({ polygonShape, size = 16, className, ...props }) => {
	const center = size / 2;
	const radius = size / 3;
	const dy = 1.5;
	const y = polygonShape === 'triangleDown' ? -dy : polygonShape === 'triangleUp' ? dy : 0;
	return (
		<span className={[Classes.ICON, className].join(' ')} css={{}} {...props}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				// xmlns:xlink="http://www.w3.org/1999/xlink"
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
			>
				{polygonShape === 'circle' ? (
					<circle r={radius} cx={center} cy={center} />
				) : (
					<polygon
						points={polygonShapePointsOpticallyEqualized(polygonShape, radius)}
						transform={`translate(${center} ${center + y})`}
					/>
				)}
			</svg>
		</span>
	);
});

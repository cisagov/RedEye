import { round } from './layout-utils';

export function polygonPoints(sides: number, radius = 1, rotationDeg = 0, center = 0): [number, number][] {
	sides = sides < 3 ? 3 : sides;
	rotationDeg = (rotationDeg * Math.PI) / 180;
	const angle = (2 * Math.PI) / sides;

	const points = [] as [number, number][];
	for (let i = 0; i < sides; i++) {
		points.push([
			center + round(radius * Math.sin(i * angle + rotationDeg), 2), // x
			center + round(radius * Math.cos(i * angle + rotationDeg), 2), // y
		]);
	}

	return points;
}

export function polygonPointsSvg(sides: number, radius?: number, rotationDeg?: number, center?: number) {
	return polygonPoints(sides, radius, rotationDeg, center)
		.map((xy) => xy.join(','))
		.join(' ');
}

const polygonShape = {
	// circle: [1, 0],
	triangleUp: [3, 180],
	triangleDown: [3, 0],
	diamond: [4, 90],
	square: [4, 45],
	pentagonUp: [5, 180],
	pentagonDown: [5, 0],
	HexagonUp: [6, 0],
	HexagonDown: [6, 90],
	// HeptagonUp: [7, 180],
	// HeptagonDown: [7, 0],
	// Octagon: [8, 22.5],
};

export type PolygonShape = keyof typeof polygonShape;
export type PolygonShapeEx = PolygonShape | 'circle';

export function polygonShapePoints(shape: PolygonShape, radius?: number, center?: number) {
	const [sides, rotationDeg] = polygonShape[shape];
	return polygonPointsSvg(sides, radius, rotationDeg, center);
}
export function polygonShapePointsOpticallyEqualized(shape: PolygonShape, area?: number, center?: number) {
	const [sides, rotationDeg] = polygonShape[shape];
	const adjust = 1 + sides * 0.03; // compensate slightly for the area equalization
	const radius = polygonCircumRadius(sides, area) * adjust;
	return polygonPointsSvg(sides, radius, rotationDeg, center);
}

function polygonArea(sides: number, radius = 1) {
	// A = n × R² × sin(2π/n) / 2
	return (sides * radius * radius * Math.sin((2 * Math.PI) / sides)) / 2;
}

function polygonCircumRadius(sides: number, area = Math.PI) {
	// A = n × R² × sin(2π/n) / 2
	// A × 2 = n × R² × sin(2π/n)
	// A × 2 / (sin(2π/n) * n) = R²
	// √(A × 2 / (sin(2π/n) * n)) = R
	return Math.sqrt((area * 2) / (Math.sin((2 * Math.PI) / sides) * sides));
}

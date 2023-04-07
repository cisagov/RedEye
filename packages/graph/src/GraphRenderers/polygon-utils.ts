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
	// name: [sides, rotationDeg] //
	// circle: [12, 0], // don't use this
	triangleUp: [3, 180],
	triangleDown: [3, 0],
	diamond: [4, 90],
	square: [4, 45],
	pentagonUp: [5, 180],
	pentagonDown: [5, 0],
	hexagonUp: [6, 0],
	hexagonDown: [6, 90],
	// heptagonUp: [7, 180],
	// heptagonDown: [7, 0],
	// octagon: [8, 22.5],
};

export type PolygonShape = keyof typeof polygonShape;

export type NodeShape = 'circle' | PolygonShape;

export const nodeShapes = ['circle'].concat(Object.keys(polygonShape)) as NodeShape[];

// this can be memoized
export function polygonShapePoints(shape: PolygonShape, radius?: number, center?: number) {
	const [sides, rotationDeg] = polygonShape[shape];
	return polygonPointsSvg(sides, radius, rotationDeg, center);
}

const polygonShapePointsOpticallyEqualizedMemo: Record<string, string> = {};
export function polygonShapePointsOpticallyEqualized(shape: PolygonShape, radius = 1, center?: number) {
	const memoId = [shape, radius, center].join('-');
	let points = polygonShapePointsOpticallyEqualizedMemo[memoId];
	if (points == null) {
		const [sides, rotationDeg] = polygonShape[shape];
		const area = Math.PI * radius * radius;
		const adjust = 1 + sides * 0.03; // compensate slightly for the area equalization
		const circumRadius = polygonCircumRadius(sides, area) * adjust;
		points = polygonPointsSvg(sides, circumRadius, rotationDeg, center);
		polygonShapePointsOpticallyEqualizedMemo[memoId] = points;
	}
	return points;
}

/* function polygonArea(sides: number, radius = 1) {
	// A = n × R² × sin(2π/n) / 2
	return (sides * radius * radius * Math.sin((2 * Math.PI) / sides)) / 2;
} */

function polygonCircumRadius(sides: number, area = Math.PI) {
	// A = n × R² × sin(2π/n) / 2
	// A × 2 = n × R² × sin(2π/n)
	// A × 2 / (sin(2π/n) * n) = R²
	// √(A × 2 / (sin(2π/n) * n)) = R
	return Math.sqrt((area * 2) / (Math.sin((2 * Math.PI) / sides) * sides));
}

function getRandomKeyGPT<T>(obj: Record<string, T>): string {
	const keys = Object.keys(obj);
	return keys[Math.floor(Math.random() * keys.length)];
}

export const getRandomPolygonShapeEx = () => getRandomKeyGPT({ ...polygonShape }) as PolygonShape;

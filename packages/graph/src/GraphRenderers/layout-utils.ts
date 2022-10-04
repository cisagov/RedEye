import { SimulationNodeDatum, ZoomTransform } from 'd3';
import { HierarchicalGraphNode, InteractionState, WithShortLine } from '../GraphData/types';
import { defNum } from '../utils';

export const clampXyToRadius = ([x, y]: [number, number], radius?: number) => {
	if (!radius) return { x, y, wasClamped: false };
	if (radius < 0) return { x: 0, y: 0, wasClamped: true };
	const length = Math.hypot(x, y);
	if (length > radius) {
		const theta = Math.atan2(x, y);
		x = Math.sin(theta) * radius;
		y = Math.cos(theta) * radius;
	}
	return { x, y, wasClamped: length > radius };
};

export function forceClampToRadius<T extends SimulationNodeDatum = SimulationNodeDatum>(
	radius: number | ((node: T, i: number, nodes: T[]) => number | undefined) = 30
) {
	let nodes: T[];

	function force() {
		nodes.forEach((node, i) => {
			const r = typeof radius === 'function' ? radius(node, i, nodes) : radius;
			const { wasClamped } = clampXyToRadius([node.x! + node.vx!, node.y! + node.vy!], r);
			if (wasClamped) {
				const vHypot = Math.hypot(node.vx!, node.vy!);
				const { x: fx, y: fy } = clampXyToRadius([node.x!, node.y!], r! - vHypot);
				node.vx = 0;
				node.vy = 0;
				node.x = fx;
				node.y = fy;
			}
		});
	}
	force.initialize = function (_: T[]) {
		nodes = _;
	};
	return force;
}

export function dotGrid(element: HTMLElement | SVGElement = document.documentElement, dotDistance = 40) {
	function draw(transform: ZoomTransform) {
		// https://stackoverflow.com/a/466256/5648839
		let roundDownToPower = Math.pow(2, Math.floor(Math.log2(transform.k)));
		let dotSpacing = (transform.k / roundDownToPower) * dotDistance;
		let dotOffsetX = transform.x % dotSpacing;
		let dotOffsetY = transform.y % dotSpacing;
		let dotSubOpacity = (dotSpacing - dotDistance) / dotDistance;

		element.style.setProperty('--dot-spacing', dotSpacing + 'px');
		element.style.setProperty('--dot-offset-x', dotOffsetX + 'px');
		element.style.setProperty('--dot-offset-y', dotOffsetY + 'px');
		element.style.setProperty('--dot-sub-opacity-multiplier', dotSubOpacity + '');
	}

	return draw;
}

export function positionParentLinkNodes(parentNode: HierarchicalGraphNode) {
	// TODO: make pure function // probably just the forEach part
	// add this as some kind of getter for things
	const parentLinkNodes = parentNode.children?.filter((d) => d.type === 'parentLinkNode') || [];

	parentLinkNodes.forEach((parentLinkNode) => {
		const { source, target } = parentLinkNode.parentLink!;
		let x = defNum(source.x) - defNum(target.x);
		let y = defNum(source.y) - defNum(target.y);
		const shouldSwapSourceAndTarget = parentNode.id === source.id;
		if (shouldSwapSourceAndTarget) {
			x *= -1;
			y *= -1;
		}
		const [fx, fy] = pointAlongLine(x, y, parentNode.r || 1);
		parentLinkNode.fx = fx;
		parentLinkNode.fy = fy;
	});
}

export function pointAlongLine(x: number, y: number, length: number) {
	const angle = Math.atan2(x, y);
	const x2 = Math.sin(angle) * length;
	const y2 = Math.cos(angle) * length;
	return [x2, y2];
}

export function shortenLine(
	sourceX: number,
	sourceY: number,
	targetX: number,
	targetY: number,
	length: number = 1,
	toOrBy: 'to' | 'by' = 'by'
): WithShortLine['shortLink'] {
	let x = targetX - sourceX;
	let y = targetY - sourceY;
	const radius = toOrBy === 'to' ? length : Math.hypot(x, y) - length;
	const [shortX, shortY] = pointAlongLine(x, y, radius);
	return {
		source: {
			x: sourceX,
			y: sourceY,
		},
		target: {
			x: sourceX + shortX,
			y: sourceY + shortY,
		},
	};
}

export const translateCenter = ({
	d,
	zk = 1,
	rk = 1,
	zx = 0,
	zy = 0,
	tx = 0,
	ty = 0,
}: {
	d: HierarchicalGraphNode;
	rk?: number;
	zk?: number;
	zx?: number;
	zy?: number;
	tx?: number;
	ty?: number;
}) => `translate(${defNum(d.x) * rk * zk + zx + tx}, ${defNum(d.y) * rk * zk + zy + ty})`;

export const isInteractionFocus = (d: InteractionState) =>
	d.previewedFocus || d.selectedFocus || d.selectedParent || d.previewedParent || false;

export const isInteractionRelated = (d: InteractionState) => d.selected || d.previewed || isInteractionFocus(d);

export const classNames = {
	// Root //
	graphRoot: 'graphRoot',
	isZooming: 'isZooming',

	transformWrapper: 'transformWrapper',

	// Graph Types (Nested) //
	superGraph: 'superGraph',
	groupGraph: 'groupGraph',
	subGraph: 'subGraph',

	// Node Types //
	superNode: 'superNode',
	groupNode: 'groupNode',
	subNode: 'subNode',
	serverNode: 'serverNode',

	// Label Types //
	superNodeCountLabel: 'superNodeCountLabel',
	superNodeNameLabel: 'superNodeNameLabel',
	subNodeNameLabel: 'subNodeNameLabel',
	occludedLabel: 'occludedLabel',

	// Simulation Nodes & Links //
	keyNode: 'keyNode',
	siblingLink: 'siblingLink',
	parentLinkNode: 'parentLinkNode',
	parentLink: 'parentLink',

	// Interaction State //
	previewed: 'previewed',
	previewedFocus: 'previewedFocus',
	selected: 'selected',
	selectedFocus: 'selectedFocus',

	// Time State //
	future: 'future',
	present: 'present',
	past: 'past',
};

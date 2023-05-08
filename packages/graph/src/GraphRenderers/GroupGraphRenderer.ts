import {
	forceLink as d3ForceLink,
	forceCollide as d3ForceCollide,
	forceManyBody as d3ForceManyBody,
	forceX as d3ForceX,
	forceY as d3ForceY,
} from 'd3';
import { SubGraphRenderer } from './SubGraphRenderer';
import { HierarchicalGraphRenderer, GraphHierarchicalConstructorProps } from './HierarchicalGraphRenderer';
import {
	classNames,
	positionParentLinkNodes,
	forceClampToRadius,
	shortenLine,
	translateCenter,
	isInteractionFocus,
	circleArea,
	circleRadius,
	interactionSort,
} from './layout-utils';
import { HierarchicalGraphLink, HierarchicalGraphNode } from '../GraphData/types';
import { defNum } from '../utils';

/** an intermediary graph that renders 'groups' of sub nodes */
export class GroupGraphRenderer extends HierarchicalGraphRenderer {
	constructor(props: GraphHierarchicalConstructorProps) {
		super(props);
		this.initialize(true);
		this.initializeChildGraphs(SubGraphRenderer);
	}

	initializeForces() {
		this.nodes.forEach((d) => (d.r = d.type === 'keyNode' ? GroupGraphRenderer.radius(d) : 1.5));

		const forceNode = d3ForceManyBody<HierarchicalGraphNode>().strength((d) => {
			return d.type === 'keyNode' ? (d.graphLinks.length || 1) * -2 - 1 : 0;
		});
		const forceLink = d3ForceLink(this.links)
			// .strength((d) => (d.children.length > 1 ? 0 : 0))
			// .strength((d) => (d.group ? 0.2 : 0.05))
			.strength((d) => d.source.graphLinks.length / 100)
			.distance(
				this.keyNodes.length < 2
					? () => this.rootNode.r!
					: (d: HierarchicalGraphLink) => this.rootNode.r! / this.links.length + (d.source.r || 1)
			);
		const forceClamp = forceClampToRadius<HierarchicalGraphNode>((d) =>
			d.type === 'keyNode' ? d.parent!.r! - d.r! - 2 : 0
		);
		const forceCollide = d3ForceCollide<HierarchicalGraphNode>()
			.strength(0.5)
			.radius((d): number => (d.type === 'keyNode' ? d.r! + 2 : 0));
		const forcePositionParentLinkNodes = () => positionParentLinkNodes(this.rootNode);

		const optional = true;
		this.simulationForces = [
			{ name: 'positionParentLinkNodes', force: forcePositionParentLinkNodes },
			{ name: 'link', force: forceLink, optional },
			{ name: 'charge', force: forceNode, optional },
			{ name: 'x', force: d3ForceX(0).strength(0.05), optional },
			{ name: 'y', force: d3ForceY(0).strength(0.05), optional },
			{ name: 'collide', force: forceCollide },
			{ name: 'clamp', force: forceClamp },
		];
		super.initializeForces();
	}

	initializeSelection() {
		this.rootGroupSelection = this.rootSelection
			.data([this.rootNode])
			.append('g')
			.classed(classNames.groupGraph, true)
			.attr('transform-origin', 'center');

		this.linkSelection = this.rootGroupSelection
			.selectAll('line')
			.data(this.links)
			.join('line')
			.classed(classNames.siblingLink, (d) => d.type === 'siblingLink')
			.classed(classNames.parentLink, (d) => d.type === 'parentLink');

		this.childGraphRootSelection = this.rootGroupSelection
			.selectAll('g')
			.data(this.nodes)
			.join('g')
			.call(this.graphHandler.initializeDrag(this));

		this.nodeSelection = this.childGraphRootSelection
			.append('g')
			.append('circle')
			.attr('r', (d) => d.r || 0)
			.style('pointer-events', 'none') // not interactive, layout only
			.classed(classNames.parentLinkNode, (d) => d.type === 'parentLinkNode')
			.classed(classNames.keyNode, (d) => d.type === 'keyNode')
			.classed(classNames.groupNode, true);

		super.initializeSelection();
	}

	drawLayout() {
		const { rk = 1 } = this.graphHandler.zoomTransform;

		// TODO: this doesn't work right for internal beacon connections
		// ...shortenLine assumes that only the source should be shortened?
		this.linkSelection
			.each((d) => {
				d.shortLink = shortenLine(
					defNum(d.target?.x),
					defNum(d.target?.y),
					defNum(d.source?.x),
					defNum(d.source?.y),
					d?.source?.r
				);
			})
			.attr('x1', (d) => d.shortLink.source.x * rk)
			.attr('y1', (d) => d.shortLink.source.y * rk)
			.attr('x2', (d) => d.shortLink.target.x * rk)
			.attr('y2', (d) => d.shortLink.target.y * rk);

		this.childGraphRootSelection.attr('transform', (d) => translateCenter({ d, rk }));

		this.nodeSelection.attr('r', (d) => defNum(d.r) * (d.descendants! ? rk : 1));
	}

	drawInteraction() {
		if (isInteractionFocus(this.rootNode!)) {
			this.showLayout();
			super.drawInteraction();
			this.rootGroupSelection
				.selectChildren<any, HierarchicalGraphNode | HierarchicalGraphLink>()
				.sort(interactionSort);
		} else {
			this.hideLayout();
		}
	}

	static radius = (d: HierarchicalGraphNode): number => {
		const keyNodeChildren = d.children?.filter((d) => d.type === 'keyNode') || [];
		let areaNeeded = 0;
		for (let i = 0; i < keyNodeChildren.length; i++) {
			const keyNodeChild = keyNodeChildren[i];
			areaNeeded += circleArea(SubGraphRenderer.radius(keyNodeChild) + 3);
		}
		return circleRadius(areaNeeded);
	};
}

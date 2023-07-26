import { forceLink as d3ForceLink, forceManyBody as d3ForceManyBody, forceX as d3ForceX, forceY as d3ForceY } from 'd3';
import type { HierarchicalGraphLink, HierarchicalGraphNode } from '../GraphData/types';
import { defNum } from '../utils';
import type { GraphHierarchicalConstructorProps } from './HierarchicalGraphRenderer';
import { HierarchicalGraphRenderer } from './HierarchicalGraphRenderer';
import {
	classNames,
	positionParentLinkNodes,
	forceClampToRadius,
	translateCenter,
	isInteractionFocus,
	isInteractionRelated,
	interactionSort,
	createSvgElement,
	updateClassName,
	assignId,
	assignIdLabel,
} from './layout-utils';
import { polygonShapePointsOpticallyEqualized } from './polygon-utils';

/** a graph that handles sub nodes (that have all been grouped because the same 'signature') */
export class SubGraphRenderer extends HierarchicalGraphRenderer {
	constructor(props: GraphHierarchicalConstructorProps) {
		super(props);
		super.initialize(true);
	}

	initializeForces() {
		this.nodes.forEach((d) => (d.r = d.type === 'parentLinkNode' ? 1 : SubGraphRenderer.radius(d)));

		const forceNode = d3ForceManyBody<HierarchicalGraphNode>().strength((d) => (d.type === 'keyNode' ? -4 : 0));
		const forceLink = d3ForceLink(this.links)
			.strength(0)
			.distance(this.rootNode.r! * 0.3);
		const forceClamp = forceClampToRadius<HierarchicalGraphNode>((d) =>
			d.type === 'keyNode' ? this.rootNode.r! - 2 : 0
		);

		const optional = true;
		this.simulationForces = [
			{ name: 'positionParentLinkNodes', force: () => positionParentLinkNodes(this.rootNode) },
			{ name: 'link', force: forceLink, optional },
			{ name: 'charge', force: forceNode, optional },
			{ name: 'x', force: d3ForceX(0), optional },
			{ name: 'y', force: d3ForceY(0), optional },
			{ name: 'clamp', force: forceClamp },
		];

		super.initializeForces();
	}

	initializeSelection() {
		this.rootGroupSelection = this.rootSelection
			.data([this.rootNode])
			.append('g')
			.attr(classNames.subGraph, true)
			.attr('transform-origin', 'center')
			.attr('cy-test', 'subGSelection')
			.attr('id', assignId);

		this.linkSelection = this.rootGroupSelection
			.selectAll('line')
			.data(this.links)
			.join('line')
			.classed(classNames.siblingLink, (d) => d.type === 'siblingLink')
			.classed(classNames.parentLink, (d) => d.type === 'parentLink')
			.attr('cy-test', 'subLinkSelection')
			.attr('id', assignId);

		this.nodeSelection = this.rootGroupSelection
			.selectAll('.testing')
			.data(this.nodes) // , (d) => (d as HierarchicalGraphNode).data.id)
			.join('g')
			.classed('testing', true)
			.attr('cy-test', 'beaconsGraph')
			.attr('id', assignId)
			.each(updateClassName)
			.classed(classNames.parentLinkNode, (d) => d.type === 'parentLinkNode')
			.classed(classNames.keyNode, (d) => d.type === 'keyNode')
			.classed(classNames.subNode, true)
			.classed(classNames.softwareNode, true)
			.on('click', this.graphHandler.clickNode.bind(this.graphHandler))
			.on('mouseover', this.graphHandler.mouseOverNode.bind(this.graphHandler));

		this.drawUpdateNodeVisual();

		this.labelSelection = this.rootGroupSelection
			.append('g')
			.attr('cy-test', 'selectedLabel')
			.selectAll('text')
			.data(this.nodes.filter((d) => d.type === 'keyNode'))
			.join('text')
			.attr('id', assignIdLabel)
			.each(updateClassName)
			.classed(classNames.subNodeNameLabel, true)
			.text(createLabel);

		super.initializeSelection();
	}

	drawUpdateNodeVisual() {
		this.nodeSelection.each(updateClassName);
		this.nodeSelection.selectChildren().remove();
		this.nodeSelection
			.append((d) => createSvgElement(d.data.shape === 'circle' || d.data.shape == null ? 'circle' : 'polygon'))
			.attr('r', (d) => d.r || 0)
			.attr('points', (d) =>
				d.data.shape && d.data.shape !== 'circle'
					? polygonShapePointsOpticallyEqualized(d.data.shape, defNum(d.r) + 1)
					: null
			);
	}

	drawLayout() {
		if (!this.parentNode) return;

		const { rk = 1 } = this.graphHandler.zoomTransform;

		this.linkSelection
			.attr('x1', (d) => defNum(d.source.x) * rk)
			.attr('y1', (d) => defNum(d.source.y) * rk)
			.attr('x2', (d) => defNum(d.target.x) * rk)
			.attr('y2', (d) => defNum(d.target.y) * rk);

		this.nodeSelection.attr('transform', (d) => translateCenter({ d, rk }));
		this.labelSelection?.attr('transform', (d) => translateCenter({ d, rk, tx: 10, ty: 4 }));
	}

	drawInteraction() {
		this.labelSelection?.style('display', (d) => (isInteractionRelated(d) ? '' : 'none'));

		if (isInteractionFocus(this.parentNode!)) {
			this.showLayout();
			super.drawInteraction();
			this.rootGroupSelection
				.selectChildren<any, HierarchicalGraphNode | HierarchicalGraphLink>()
				.sort(interactionSort);
		} else {
			this.hideLayout();
		}
	}

	drawUpdateLabel() {
		this.labelSelection?.text(createLabel);
	}

	static radius = (_d: HierarchicalGraphNode) => 4;
	// static radius = (d: HierarchyReturnNode): number => 2 + (d.descendants ? d.descendants().length : 0);
}

const createLabel = (d: HierarchicalGraphNode) => `– ${d.data.name || '(missing)'}`;

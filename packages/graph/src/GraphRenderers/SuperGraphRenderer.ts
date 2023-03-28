import {
	forceLink as d3ForceLink,
	forceManyBody as d3ForceManyBody,
	forceSimulation as d3ForceSimulation,
	forceCollide as d3ForceCollide,
	forceX as d3ForceX,
	forceY as d3ForceY,
} from 'd3';
import { GroupGraphRenderer } from './GroupGraphRenderer';
import { HierarchicalGraphRenderer, GraphHierarchicalConstructorProps } from './HierarchicalGraphRenderer';
import { classNames, isInteractionFocus, isInteractionRelated, translateCenter } from './layout-utils';
import { HierarchyNodeSelection, HierarchicalGraphNode } from '../GraphData/types';
import { defNum } from '../utils';

/** The super graph that contains all the group and sub graphs */
export class SuperGraphRenderer extends HierarchicalGraphRenderer {
	countLabelSelection: HierarchyNodeSelection;
	positionSelection: HierarchyNodeSelection;

	constructor(props: GraphHierarchicalConstructorProps) {
		super(props);

		this.nodes.forEach((d) => (d.r = SuperGraphRenderer.radius(d)));

		const forceNode = d3ForceManyBody<HierarchicalGraphNode>().strength(
			(d) => -300 * d.children!.filter((dd) => dd.type === 'parentLinkNode').length
		); // parentLinkNodes?.length);
		const forceLink = d3ForceLink(this.links); // .strength(0.1)
		const forceCollide = d3ForceCollide<HierarchicalGraphNode>()
			.strength(0.1)
			.radius((d) => SuperGraphRenderer.radius(d) + 4);

		this.simulation = d3ForceSimulation(this.nodes)
			.force('link', forceLink)
			.force('charge', forceNode)
			.force('collide', forceCollide)
			.force('x', d3ForceX(0))
			.force('y', d3ForceY(0))
			.on('tick', this.drawLayout.bind(this));

		this.rootGroupSelection = this.rootSelection
			.data([this.rootNode])
			.append('g')
			.classed(classNames.superGraph, true)
			.attr('transform-origin', 'center');

		this.linkSelection = this.rootGroupSelection
			.append('g')
			.selectAll('line')
			.data(this.links)
			.join('line')
			.classed(classNames.parentLink, true)
			.classed(classNames.siblingLink, (d) => d.type === 'siblingLink');
		// .attr('stroke-width', d => d.linkIndexes.length);

		this.positionSelection = this.rootGroupSelection
			.append('g')
			.selectAll('g')
			.data(this.nodes)
			.join('g')
			.call(this.graphHandler.initializeDrag(this));

		this.nodeSelection = this.positionSelection
			.append('g')
			.append('circle')
			.attr('r', (d) => d.r || 0)
			.attr('data-id', (d) => d.data.id!)
			.attr('cy-test', 'graphNode')
			.attr('class', (d) => (d.type === 'parentLinkNode' ? classNames.parentLinkNode : classNames.keyNode))
			.classed(classNames.superNode, true)
			.classed(classNames.serverNode, (d) => d.data.isServer)
			.on('click', this.graphHandler.clickNode.bind(this.graphHandler))
			.on('mouseover', this.graphHandler.mouseOverNode.bind(this.graphHandler));

		this.childGraphRootSelection = this.positionSelection.append('g');

		this.labelSelection = this.rootGroupSelection
			.append('g')
			.selectAll('text')
			.data(this.nodes)
			.join('text')
			.attr('text-anchor', 'end')
			.attr('cy-test', 'selectedLabel')
			.classed(classNames.superNodeNameLabel, true)
			.style('display', 'none') // start hidden
			.text(createLabel);

		this.countLabelSelection = this.rootGroupSelection
			.append('g')
			.selectAll('text')
			.data(this.nodes.filter((d) => d.leaves().filter((dd) => dd.type === 'keyNode').length > 1))
			.join('text')
			// .filter((d) => d.leaves().length > 1)
			.attr('text-anchor', 'middle')
			.classed(classNames.superNodeCountLabel, true)
			.text((d) => d.leaves().filter((dd) => dd.type === 'keyNode').length);

		super.initialize(GroupGraphRenderer);
	}

	drawTime() {
		super.drawTime([this.countLabelSelection]);
	}

	drawLayout() {
		const { k: zk, x: zx, y: zy } = this.graphHandler.zoomTransform;

		this.linkSelection
			.attr('x1', (d) => defNum(d.source.x) * zk + zx)
			.attr('y1', (d) => defNum(d.source.y) * zk + zy)
			.attr('x2', (d) => defNum(d.target.x) * zk + zx)
			.attr('y2', (d) => defNum(d.target.y) * zk + zy);

		this.positionSelection.attr('transform', (d) => translateCenter({ d, zk, zx, zy }));
		this.countLabelSelection?.attr('transform', (d) => translateCenter({ d, zk, zx, zy, ty: 4 }));

		this.drawDynamicLayout();
		super.drawLayout();
	}

	drawDynamicLayout() {
		const { k: zk, x: zx, y: zy, rk } = this.graphHandler.zoomTransform;
		this.nodeSelection.attr('r', (d) => SuperGraphRenderer.shrinkRadius(d, rk));
		this.labelSelection?.attr('transform', (d) =>
			translateCenter({ d, zk, zx, zy, tx: SuperGraphRenderer.shrinkRadius(d, rk) * -1 - 4, ty: 4 })
		);
	}

	drawInteraction() {
		this.drawDynamicLayout();
		this.countLabelSelection?.style('display', (d) => (isInteractionFocus(d) ? 'none' : ''));
		this.labelSelection?.style('display', (d) => (isInteractionRelated(d) ? '' : 'none'));
		super.drawInteraction();
	}

	drawUpdateLabel() {
		this.labelSelection?.text(createLabel);
	}

	static radius = (d: HierarchicalGraphNode) =>
		defNum(d.children!.filter((dd) => dd.type == 'keyNode').length) * 1.5 +
		d.descendants().filter((dd) => dd.type == 'keyNode').length +
		5;

	static shrinkRadius = (d: HierarchicalGraphNode, rk = 1) => {
		const radius = defNum(d.r) * rk;
		if (isInteractionFocus(d)) return radius;
		else return Math.max(radius * 0.6, 8);
	};
}

const createLabel = (d: HierarchicalGraphNode) => `${d.data.name || '(missing)'} –`;

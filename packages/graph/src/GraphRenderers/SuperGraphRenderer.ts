import {
	forceLink as d3ForceLink,
	forceManyBody as d3ForceManyBody,
	forceCollide as d3ForceCollide,
	forceX as d3ForceX,
	forceY as d3ForceY,
} from 'd3';
import { GroupGraphRenderer } from './GroupGraphRenderer';
import { HierarchicalGraphRenderer, GraphHierarchicalConstructorProps } from './HierarchicalGraphRenderer';
import {
	circleArea,
	circleRadius,
	classNames,
	interactionSort,
	isInteractionFocus,
	isInteractionRelated,
	polygonPointsSVG,
	translateCenter,
} from './layout-utils';
import { HierarchyNodeSelection, HierarchicalGraphNode, HierarchicalGraphLink } from '../GraphData/types';
import { defNum } from '../utils';

/** The super graph that contains all the group and sub graphs */
export class SuperGraphRenderer extends HierarchicalGraphRenderer {
	countLabelSelection!: HierarchyNodeSelection;
	graphSelection!: HierarchyNodeSelection;
	positionSelection!: HierarchyNodeSelection;
	serverSelection!: HierarchyNodeSelection;
	hostSelection!: HierarchyNodeSelection;

	constructor(props: GraphHierarchicalConstructorProps) {
		super(props);
		this.initialize();
		this.initializeChildGraphs(GroupGraphRenderer);
	}

	initializeForces() {
		this.nodes.forEach((d) => (d.r = d.data.isServer ? 10 : SuperGraphRenderer.radius(d)));

		const forceNode = d3ForceManyBody<HierarchicalGraphNode>().strength(
			(d) => -300 * d.children!.filter((dd) => dd.type === 'parentLinkNode').length
		); // parentLinkNodes?.length);
		const forceLink = d3ForceLink(this.links); // .strength(0.1)
		const forceCollide = d3ForceCollide<HierarchicalGraphNode>()
			.strength(0.1)
			.radius((d) => SuperGraphRenderer.radius(d) + 4);

		const optional = true;
		this.simulationForces = [
			{ name: 'link', force: forceLink, optional },
			{ name: 'charge', force: forceNode, optional },
			{ name: 'x', force: d3ForceX(0), optional },
			{ name: 'y', force: d3ForceY(0), optional },
			{ name: 'collide', force: forceCollide },
		];

		super.initializeForces();
	}

	initializeSelection() {
		this.rootGroupSelection = this.rootSelection
			.data([this.rootNode])
			.append('g')
			.classed(classNames.superGraph, true)
			.attr('transform-origin', 'center');

		this.graphSelection = this.rootGroupSelection.append('g');

		this.linkSelection = this.graphSelection
			// .append('g')
			.selectAll('line')
			.data(this.links)
			.join('line')
			.classed(classNames.parentLink, true)
			.classed(classNames.siblingLink, (d) => d.type === 'siblingLink');
		// .attr('stroke-width', d => d.linkIndexes.length);

		this.positionSelection = this.graphSelection
			// .append('g')
			.selectAll('g')
			.data(this.nodes)
			.join('g')
			.call(this.graphHandler.initializeDrag(this));

		this.hostSelection = this.positionSelection
			.filter((d) => !d.data.isServer)
			.append('g')
			.append('circle')
			.attr('r', (d) => d.r || 0)
			.classed(classNames.computerNode, true);

		this.serverSelection = this.positionSelection
			.filter((d) => d.data.isServer)
			.append('g')
			.append('polygon') // polygon
			.attr('points', (d) => polygonPointsSVG(6, d.r || 0))
			.classed(classNames.serverNode, true);

		// select this.hostSelection & this.serverSelection
		this.nodeSelection = this.positionSelection.selectChild().selectChild();

		this.nodeSelection
			.attr('data-id', (d) => d.data.id!)
			.attr('cy-test', 'graphNode')
			.classed(classNames.parentLinkNode, (d) => d.type === 'parentLinkNode')
			.classed(classNames.keyNode, (d) => d.type === 'keyNode')
			.classed(classNames.superNode, true)
			.on('click', this.graphHandler.clickNode.bind(this.graphHandler))
			.on('mouseover', this.graphHandler.mouseOverNode.bind(this.graphHandler));

		this.childGraphRootSelection = this.positionSelection //
			.append('g')
			.filter((d) => !d.data.isServer);

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

		super.initializeSelection();
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
		this.hostSelection.attr('r', (d) => SuperGraphRenderer.shrinkRadius(d, rk));
		this.labelSelection?.attr('transform', (d) => {
			const tx = (d.data.isServer ? defNum(d.r) : SuperGraphRenderer.shrinkRadius(d, rk)) * -1 - 4;
			return translateCenter({ d, zk, zx, zy, ty: 4, tx });
		});
	}

	drawInteraction() {
		this.drawDynamicLayout();
		this.countLabelSelection?.style('display', (d) => (isInteractionFocus(d) ? 'none' : ''));
		this.labelSelection?.style('display', (d) => (isInteractionRelated(d) ? '' : 'none'));
		super.drawInteraction();
		this.graphSelection.selectChildren<any, HierarchicalGraphNode | HierarchicalGraphLink>().sort(interactionSort);
	}

	drawUpdateLabel() {
		this.labelSelection?.text(createLabel);
	}

	static radius = (d: HierarchicalGraphNode) => {
		const keyNodeChildren = d.children?.filter((d) => d.type === 'keyNode') || [];
		let areaNeeded = 0;
		for (let i = 0; i < keyNodeChildren.length; i++) {
			const keyNodeChild = keyNodeChildren[i];
			areaNeeded += circleArea(GroupGraphRenderer.radius(keyNodeChild) + 10);
		}
		return circleRadius(areaNeeded);
	};

	static shrinkRadius = (d: HierarchicalGraphNode, rk = 1) => {
		const radius = defNum(d.r) * rk;
		if (isInteractionFocus(d)) return radius;
		else return Math.max(radius * 0.6, 8);
	};
}

const createLabel = (d: HierarchicalGraphNode) => `${d.data.name || '(missing)'} –`;

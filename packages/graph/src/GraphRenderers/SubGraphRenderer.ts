import {
	forceLink as d3ForceLink,
	forceManyBody as d3ForceManyBody,
	forceSimulation as d3ForceSimulation,
	forceX as d3ForceX,
	forceY as d3ForceY,
} from 'd3';
import { HierarchicalGraphNode } from '../GraphData/types';
import { defNum } from '../utils';
import { HierarchicalGraphRenderer, GraphHierarchicalConstructorProps } from './HierarchicalGraphRenderer';
import {
	classNames,
	positionParentLinkNodes,
	forceClampToRadius,
	translateCenter,
	isInteractionFocus,
	isInteractionRelated,
} from './layout-utils';

/** a graph that handles sub nodes (that have all been grouped because the same 'signature') */
export class SubGraphRenderer extends HierarchicalGraphRenderer {
	constructor(props: GraphHierarchicalConstructorProps) {
		super(props);

		this.nodes.forEach((d) => (d.r = d.type === 'parentLinkNode' ? 1 : SubGraphRenderer.radius()));

		const forceNode = d3ForceManyBody<HierarchicalGraphNode>().strength((d) => (d.type === 'keyNode' ? -1 : 0));
		const forceLink = d3ForceLink(this.links)
			.strength(0)
			.distance(this.rootNode.r! * 0.3);
		const forceClamp = forceClampToRadius<HierarchicalGraphNode>((d) =>
			d.type === 'keyNode' ? this.rootNode.r! - 2 : 0
		);

		this.simulation = d3ForceSimulation(this.nodes)
			.force('positionParentLinkNodes', () => positionParentLinkNodes(this.rootNode))
			.force('link', forceLink)
			.force('charge', forceNode)
			.force('x', d3ForceX(0))
			.force('y', d3ForceY(0))
			.force('clamp', forceClamp)
			.on('tick', this.drawLayout.bind(this));

		this.rootGroupSelection = this.rootSelection
			.data([this.rootNode])
			.append('g')
			.attr('class', classNames.subGraph)
			.attr('transform-origin', 'center')
			.attr('cy-test', 'subGSelection');

		this.linkSelection = this.rootGroupSelection
			.append('g')
			.selectAll('line')
			.data(this.links)
			.join('line')
			.attr('class', (d) => (d.type === 'siblingLink' ? classNames.siblingLink : classNames.parentLink))
			.attr('cy-test', 'subLinkSelection');

		this.nodeSelection = this.rootGroupSelection
			.append('g')
			.selectAll('circle')
			.data(this.nodes)
			.join('circle')
			.attr('r', (d) => d.r || 0)
			.attr('cy-test', 'beaconsGraph')
			.attr('class', (d) => (d.type === 'parentLinkNode' ? classNames.parentLinkNode : classNames.keyNode))
			.classed(classNames.subNode, true)
			.on('click', this.graphHandler.clickNode.bind(this.graphHandler))
			.on('mouseover', this.graphHandler.mouseOverNode.bind(this.graphHandler));

		// TODO: this will currently z-index under (some) super and group nodes
		// ... to fix this, these will need to render inside the SuperGraph.rootSelection
		this.labelSelection = this.rootGroupSelection
			.append('g')
			.attr('cy-test', 'selectedLabel')
			.selectAll('text')
			.data(this.nodes)
			.join('text')
			// .attr('text-anchor', 'end')
			.classed(classNames.subNodeNameLabel, true)
			.text(createLabel);

		this.hideLayout(); // start hidden
		super.initialize();
	}

	drawLayout() {
		if (!this.parentNode) return;

		const { rk = 1 } = this.graphHandler.zoomTransform;

		this.linkSelection
			.attr('x1', (d) => defNum(d.source.x) * rk)
			.attr('y1', (d) => defNum(d.source.y) * rk)
			.attr('x2', (d) => defNum(d.target.x) * rk)
			.attr('y2', (d) => defNum(d.target.y) * rk);

		this.nodeSelection.attr('transform', (d) => translateCenter({ d, rk })).attr('r', (d) => defNum(d.r));
		this.labelSelection?.attr('transform', (d) => translateCenter({ d, rk, tx: 10, ty: 4 }));
	}

	drawInteraction() {
		this.labelSelection?.style('display', (d) => (isInteractionRelated(d) ? '' : 'none'));

		if (isInteractionFocus(this.parentNode!)) {
			this.showLayout();
			super.drawInteraction();
		} else {
			this.hideLayout();
		}
	}

	drawUpdateLabel() {
		this.labelSelection?.text(createLabel);
	}

	static radius = () => 4;
	// static radius = (d: HierarchyReturnNode): number => 2 + (d.descendants ? d.descendants().length : 0);
}

const createLabel = (d: HierarchicalGraphNode) => `– ${d.data.name || '(missing)'}`;

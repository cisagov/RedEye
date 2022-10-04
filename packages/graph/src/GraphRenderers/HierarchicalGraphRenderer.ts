import { select as d3Select, Simulation } from 'd3';
import { GraphHandler } from '../GraphHandler';
import { HierarchicalGraphLinkDatum } from '../GraphData/GraphNodesAndLinks';
import { classNames, isInteractionRelated } from './layout-utils';
import {
	HierarchyLinkSelection,
	HierarchyNodeSelection,
	HierarchicalGraphLink,
	HierarchicalGraphNode,
	GenericSelection,
} from '../GraphData/types';

/**
 * the base class for the hierarchical structure of the graph tree
 * should be abstract but can't be because of the `typeof GraphHierarchical` in initialize
 */
export class HierarchicalGraphRenderer {
	rootNode: HierarchicalGraphNode;
	parentNode?: HierarchicalGraphNode; // TODO: not null
	links: HierarchicalGraphLink[];
	nodes: HierarchicalGraphNode[];
	keyNodes: HierarchicalGraphNode[];
	parentLinkNodes: HierarchicalGraphNode[];
	simulation!: Simulation<HierarchicalGraphNode, HierarchicalGraphLinkDatum>;
	/**
	 * The parent selection element to append this graph to.
	 * Graphs are nested for proper DOM event bubbling. This does however cause some complications with z-indexing
	 */
	rootSelection!: HierarchyNodeSelection;
	rootGroupSelection!: HierarchyNodeSelection;
	childGraphRootSelection!: HierarchyNodeSelection;
	linkSelection!: HierarchyLinkSelection;
	nodeSelection!: HierarchyNodeSelection;
	labelSelection?: HierarchyNodeSelection;
	parentGraph?: HierarchicalGraphRenderer;
	childGraphs: HierarchicalGraphRenderer[] = [];
	graphHandler: GraphHandler;

	constructor({ rootNode, rootSelection, parentGraph, graphHandler }: GraphHierarchicalConstructorProps) {
		this.rootNode = rootNode;
		this.parentNode = this.rootNode.parent || undefined;
		this.links = this.rootNode.graphLinks || [];
		this.nodes = this.rootNode.children || [];
		this.keyNodes = this.nodes.filter((d) => d.type === 'keyNode') || [];
		this.parentLinkNodes = this.nodes.filter((d) => d.type === 'parentLinkNode') || [];
		this.parentGraph = parentGraph;
		this.graphHandler = graphHandler;
		this.rootSelection = rootSelection;
	}

	initialize(ChildGraphClass?: typeof HierarchicalGraphRenderer) {
		this.initializeSimulationLayout();
		this.initializeChildGraphs(ChildGraphClass);
	}
	initializeSimulationLayout() {
		this.simulation
			.alphaDecay(0.001)
			.alphaTarget(0.7)
			.tick(300) // tick 500 times for initial layout
			.alphaTarget(0) // cool alpha
			.alphaDecay(0.1)
			.restart()
			.tick(500) // tick another 500 times for stability
			.stop(); // freeze the simulation // wait for interactions

		this.drawLayout();
	}
	initializeChildGraphs(ChildGraphClass?: typeof HierarchicalGraphRenderer) {
		if (this.childGraphRootSelection && ChildGraphClass != null) {
			this.childGraphs = [];
			this.childGraphRootSelection
				.filter((d) => d.type === 'keyNode')
				.each((data, i, nodes) => {
					this.childGraphs?.push(
						new ChildGraphClass!({
							rootNode: data,
							rootSelection: d3Select(nodes[i]!) as HierarchyNodeSelection,
							parentGraph: this,
							graphHandler: this.graphHandler,
						})
					);
				});
		}
	}

	reheat(alphaTarget: number = 0) {
		this.simulation.alphaTarget(alphaTarget).restart();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.reheat(alphaTarget);
		});
	}
	cool() {
		this.simulation.alphaTarget(0);
		this.childGraphs?.forEach((childGraph) => {
			childGraph.cool();
		});
	}
	freeze() {
		this.simulation.stop(); // hammer time
		this.childGraphs?.forEach((childGraph) => {
			childGraph.freeze();
		});
	}

	drawLayout() {}

	drawLayoutAllChildren() {
		this.drawLayout();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.drawLayoutAllChildren();
		});
	}

	drawInteraction() {
		// could use selection.merge()... instead of array?
		[
			this.rootSelection,
			this.rootGroupSelection,
			this.linkSelection as unknown as HierarchyNodeSelection, // ??
			this.nodeSelection,
			this.labelSelection,
		].forEach((selection) => {
			selection
				?.classed(classNames.selected, (d) => !!d.selected)
				.classed(classNames.selectedFocus, (d) => !!d.selectedFocus)
				.classed(classNames.previewed, (d) => !!d.previewed)
				.classed(classNames.previewedFocus, (d) => !!d.previewedFocus)
				.filter(isInteractionRelated)
				.raise();
		});
	}

	drawInteractionAllChildren() {
		this.drawInteraction();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.drawInteractionAllChildren();
		});
	}

	drawTime(additionalSelections: GenericSelection[] = []) {
		const timeClassNames = [classNames.present, classNames.past, classNames.future].join(' ');

		[
			this.nodeSelection,
			this.linkSelection, // as unknown as HierarchyNodeSelection, // ??
			this.labelSelection,
			...additionalSelections,
		].forEach((selection) => {
			(selection as HierarchyNodeSelection)
				?.classed(timeClassNames, false)
				.filter((d) => !d.data.isServer)
				.classed(classNames.past, (d) => d.currentTimeState === 'past')
				.classed(classNames.present, (d) => d.currentTimeState === 'present')
				.classed(classNames.future, (d) => d.currentTimeState === 'future');
		});
	}

	drawTimeAllChildren() {
		this.drawTime();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.drawTimeAllChildren();
		});
	}

	drawUpdateLabel() {}
	drawUpdateLabelAllChildren() {
		this.drawUpdateLabel();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.drawUpdateLabelAllChildren();
		});
	}

	isHidden = false;
	hideLayout() {
		if (!this.isHidden) this.rootGroupSelection.remove();
		this.isHidden = true;
	}
	hideLayoutAllChildren() {
		this.hideLayout();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.hideLayoutAllChildren();
		});
	}
	showLayout() {
		if (this.isHidden) this.rootSelection.node()?.appendChild(this.rootGroupSelection.node()!);
		this.isHidden = false;
	}
	showLayoutAllChildren() {
		this.showLayout();
		this.childGraphs?.forEach((childGraph) => {
			childGraph.showLayoutAllChildren();
		});
	}
}

export interface GraphHierarchicalConstructorProps {
	rootNode: HierarchicalGraphNode;
	rootSelection: HierarchicalGraphRenderer['rootSelection'];
	parentGraph?: HierarchicalGraphRenderer['parentGraph'];
	graphHandler: HierarchicalGraphRenderer['graphHandler'];
}

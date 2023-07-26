/* eslint-disable @typescript-eslint/no-empty-function */
import { select as d3Select, forceSimulation as d3ForceSimulation } from 'd3';
import type { GraphHandler } from '../GraphHandler';
import { classNames } from './layout-utils';
import type {
	HierarchyLinkSelection,
	HierarchyNodeSelection,
	HierarchicalGraphLink,
	HierarchicalGraphNode,
	GenericSelection,
	HierarchicalSimulationForce,
	HierarchicalSimulation,
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
	simulation!: HierarchicalSimulation;
	simulationForces: HierarchicalSimulationForce[] = [];
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

	initialize(startHidden = false) {
		this.initializeForces();
		this.initializeSelection();
		if (startHidden) this.hideLayout();
		this.initializeSimulationLayout();
	}
	initializeForces() {
		this.simulation = d3ForceSimulation(this.nodes).on('tick', this.drawLayout.bind(this));
	}
	initializeSelection() {}
	initializeSimulationLayout() {
		this.useGraphForces();
		this.simulation
			.alphaDecay(0.001)
			.alphaTarget(0.7)
			.tick(300) // tick 300 times for initial layout
			.alphaTarget(0) // cool alpha
			.alphaDecay(0.1)
			.restart()
			.tick(500) // tick another 500 times for stability
			.stop(); // freeze the simulation // wait for interactions

		// this.useSimpleForces();
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

	callChildrenRecursively(method: HierarchicalGraphRendererMethods) {
		this[method]();
		this.childGraphs?.forEach((childGraph) => childGraph.callChildrenRecursively(method));
	}

	useGraphForces() {
		for (let i = 0; i < this.simulationForces.length; i++) {
			const { name, force } = this.simulationForces[i];
			this.simulation.force(name, force);
		}
	}
	useSimpleForces() {
		for (let i = 0; i < this.simulationForces.length; i++) {
			const { name, force: _force, optional } = this.simulationForces[i];
			const force = optional ? null : _force;
			this.simulation.force(name, force);
		}
	}

	reheat(alphaTarget: number = 0) {
		this.simulation.alphaTarget(alphaTarget).restart();
		this.childGraphs?.forEach((childGraph) => childGraph.reheat(alphaTarget));
	}
	cool() {
		this.simulation.alphaTarget(0);
		this.childGraphs?.forEach((childGraph) => childGraph.cool());
	}
	freeze() {
		this.simulation.stop();
		this.childGraphs?.forEach((childGraph) => childGraph.freeze());
	}

	drawLayout() {}

	drawInteraction() {
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
				.classed(classNames.selectedParent, (d) => !!d.selectedParent)
				.classed(classNames.previewed, (d) => !!d.previewed)
				.classed(classNames.previewedFocus, (d) => !!d.previewedFocus)
				.classed(classNames.previewedParent, (d) => !!d.previewedParent);
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

	drawUpdateLabel() {}

	drawUpdateNodeVisual() {}

	isHidden = false;
	hideLayout() {
		if (!this.isHidden) this.rootGroupSelection.remove();
		this.isHidden = true;
	}

	showLayout() {
		if (this.isHidden) this.rootSelection.node()?.appendChild(this.rootGroupSelection.node()!);
		this.isHidden = false;
	}
}

export interface GraphHierarchicalConstructorProps {
	rootNode: HierarchicalGraphNode;
	rootSelection: HierarchicalGraphRenderer['rootSelection'];
	parentGraph?: HierarchicalGraphRenderer['parentGraph'];
	graphHandler: HierarchicalGraphRenderer['graphHandler'];
}

type HierarchicalGraphRendererMethods =
	| 'useGraphForces'
	| 'useSimpleForces'
	| 'drawLayout'
	| 'drawTime'
	| 'drawInteraction'
	| 'drawUpdateLabel'
	| 'drawUpdateNodeVisual'
	| 'hideLayout'
	| 'showLayout';

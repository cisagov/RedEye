import { stratify as d3Stratify } from 'd3';
import {
	HierarchicalGraphLinkDatum,
	HierarchicalGraphNodeDatum,
	HierarchicalGraphBaseLink,
} from './GraphNodesAndLinks';
import { noOp } from '../utils';
import {
	GraphData,
	GraphDataEvent,
	NodeOrLink,
	HierarchicalGraphLink,
	HierarchicalGraphNode,
	SerializableHierarchicalGraphData,
	CurrentTimeType,
} from './types';
import { hierarchicalGraphDataParser } from './hierarchicalGraphDataParser';

export class HierarchicalGraphData {
	// DATA //
	rootNode!: HierarchicalGraphNode;
	rootLink!: HierarchicalGraphLink;
	baseLinks = new Map<string, HierarchicalGraphBaseLink>();
	allNodes = new Map<string, HierarchicalGraphNode>();
	allLinks = new Map<string, HierarchicalGraphLink>();

	/** TODO: returns the current SerializableHierarchicalGraphData including simulation x,y data */
	get parsedGraphData(): SerializableHierarchicalGraphData {
		throw new Error('Not Implemented');
		// TODO: return the object below after removing all links to other things and replacing them with id strings
		// ...ie, the opposite of stratify
		return {
			nodes: [], // this.allNodes to Array
			links: [], // this.allLinks to Array
			baseLinks: [], // this.baseLinks to Array
		};
	}

	constructor({
		graphData,
		onSelectionChange = noOp,
		onPreviewChange = noOp,
		onTimeChange = noOp,
		onDataChange = noOp,
	}: {
		graphData: GraphData;
		onSelectionChange: HierarchicalGraphData['onSelectionChange'];
		onPreviewChange: HierarchicalGraphData['onPreviewChange'];
		onTimeChange: HierarchicalGraphData['onTimeChange'];
		onDataChange: HierarchicalGraphData['onDataChange'];
	}) {
		this.onSelectionChange = onSelectionChange;
		this.onPreviewChange = onPreviewChange;
		this.onTimeChange = onTimeChange;
		this.onDataChange = onDataChange;
		this.updateGraphData(graphData, false, false);
	}

	/** fires when updateGraphData is called an the underlying dataset is updated */
	private onDataChange: () => void;

	/** merges new GraphData with the existing GraphData, retaining x,y coordinates for nodes that existed previously */
	updateGraphData(graphData: GraphData, mergeWithCurrentGraphData = true, fireEvent = true) {
		const parsedGraphData = hierarchicalGraphDataParser(graphData);

		if (mergeWithCurrentGraphData && this.allNodes.size > 0) {
			parsedGraphData.nodes = parsedGraphData.nodes.map((node) => {
				const currentNode = this.allNodes.get(node.id);
				if (currentNode) {
					node.x = currentNode.x;
					node.y = currentNode.y;
				}
				return node;
			});
		}

		this.stratifyGraph(parsedGraphData);
		if (fireEvent) this.onDataChange();
	}

	stratifyGraph(serializableData: SerializableHierarchicalGraphData) {
		const data: SerializableHierarchicalGraphData = Object.assign(serializableData);
		// d3.stratify the Links so they are traversable
		this.rootLink = d3Stratify<HierarchicalGraphLinkDatum>()
			.id((d) => d.id)
			.parentId((d) => d.parent)(data.links) as HierarchicalGraphLink;
		this.rootNode = d3Stratify<HierarchicalGraphNodeDatum>()
			.id((d) => d.id)
			.parentId((d) => d.parent)(data.nodes) as HierarchicalGraphNode;

		this.allLinks = new Map<string, HierarchicalGraphLink>(this.rootLink.descendants().map((link) => [link.id!, link]));
		this.allNodes = new Map<string, HierarchicalGraphNode>(this.rootNode.descendants().map((node) => [node.id!, node]));
		this.baseLinks = new Map<string, HierarchicalGraphBaseLink>(
			data.baseLinks.map((baseLink) => [
				baseLink.id!,
				new HierarchicalGraphBaseLink({
					source: this.allNodes.get(baseLink.source)!,
					target: this.allNodes.get(baseLink.target)!,
					id: baseLink.id,
					graphLinks: baseLink.graphLinks.map((graphLink) => this.allLinks.get(graphLink)!),
				}),
			])
		);

		this.allNodes.forEach((node) => {
			node.graphLinks = []; // initialize
			if (node.parent == null) return; // rootNode
			node.baseLinks = node.data.baseLinks.map((baseLink) => this.baseLinks.get(baseLink)!);
			// if (node.baseLinks.length > 0) console.log(node);
			node.type = node.data.type;
			if (node.data.parentLink) node.parentLink = this.allLinks.get(node.data.parentLink);
			node.x = node.data.x;
			node.y = node.data.y;
			node.fx = node.data.fx;
			node.fy = node.data.fy;
		});
		this.allLinks.forEach((link) => {
			if (link.parent == null) return; // rootLink
			link.source = this.allNodes.get(link.data.source)!;
			link.target = this.allNodes.get(link.data.target)!;
			link.baseLinks = link.data.baseLinks.map((baseLink) => this.baseLinks.get(baseLink)!);
			// if (link.baseLinks.length > 0) console.log(link);
			link.type = link.data.type;
			const parentNode = this.allNodes.get(link.data.parentNode)!;

			// if (parentNode.graphLinks == null) console.log(link);

			parentNode.graphLinks.push(link);
		});
	}

	// TIMELINE //

	/** Unix epoch time */
	private currentTime = 0;
	private pastSet = new Set<NodeOrLink>();
	private presentSet = new Set<NodeOrLink>();
	private onTimeChange: () => void;
	/** future state is the default, it is applied when the other timeStates are not. */
	// private futureSet = new Set<NodeOrLink>();
	get timeState() {
		return {
			currentTime: this.currentTime,
			pastNodeIds: setToIds(this.pastSet),
			presentNodeIds: setToIds(this.presentSet),
			// futureNodeIds: setToIds(this.futureSet),
		};
	}
	setTimeState(timeState: HierarchicalGraphData['timeState'], fireEvent = true) {
		this.clearTime(false);

		const {
			currentTime,
			pastNodeIds,
			presentNodeIds,
			// futureNodeIds,
		} = timeState;
		this.currentTime = currentTime;

		// unlike selectionSet and previewSet, the timeSets only store baseNodes, no links or ancestorNodes
		this.pastSet = setFromIds(pastNodeIds, this.allNodes);
		this.presentSet = setFromIds(presentNodeIds, this.allNodes);
		// this.futureSet = setFromIds(futureNodeIds, this.allNodes);

		// set to default
		// TODO: servers currently have no currentTimeState, this should be fixed later
		this.allNodes.forEach((node) => (node.data.isServer ? undefined : (node.currentTimeState = 'future')));

		const timeSets: [Set<NodeOrLink>, CurrentTimeType][] = [
			// [this.futureSet, 'future'],
			[this.pastSet, 'past'],
			[this.presentSet, 'present'],
		];
		timeSets.forEach(([timeSet, timeState]) => {
			timeSet.forEach((node) => {
				let current: NodeOrLink | null = node;
				while (current) {
					current.currentTimeState = timeState;
					current = current.parent;
				}
			});
		});

		this.allLinks.forEach((link) => (link.currentTimeState = 'future'));
		this.baseLinks.forEach((baseLink) => (baseLink.currentTimeState = undefined));

		const pastBaseLinks = new Set<HierarchicalGraphBaseLink>();
		const presentBaseLinks = new Set<HierarchicalGraphBaseLink>();
		// const futureBaseLinks = new Set<HierarchicalGraphBaseLink>();

		this.baseLinks.forEach((baseLink) => {
			baseLink.currentTimeState = linkConnectionTimeState(baseLink.source, baseLink.target);
			if (baseLink.currentTimeState === 'past') pastBaseLinks.add(baseLink);
			if (baseLink.currentTimeState === 'present') presentBaseLinks.add(baseLink);
			// if (baseLink.currentTimeState === 'future') futureBaseLinks.add(baseLink);
		});
		const baseLinkSets: [Set<HierarchicalGraphBaseLink>, CurrentTimeType][] = [
			// [futureBaseLinks, 'future'],
			[pastBaseLinks, 'past'],
			[presentBaseLinks, 'present'],
		];
		baseLinkSets.forEach(([baseLinkSet, timeState]) => {
			baseLinkSet.forEach((baseLink) => {
				baseLink.graphLinks.forEach((graphLink) => {
					graphLink.currentTimeState = timeState;
				});
			});
		});

		if (fireEvent) this.onTimeChange();
	}
	clearTime(fireEvent = true) {
		this.currentTime = 0;
		this.pastSet.clear();
		this.presentSet.clear();
		// this.futureSet.clear();
		this.allNodes.forEach((node) => (node.currentTimeState = undefined));
		this.allLinks.forEach((link) => (link.currentTimeState = undefined));
		this.baseLinks.forEach((baseLink) => (baseLink.currentTimeState = undefined));
		if (fireEvent) this.onTimeChange();
	}

	// INTERACTION - PREVIEW & SELECTION //

	selectionSet = new Set<NodeOrLink>();
	previewSet = new Set<NodeOrLink>();
	private onSelectionChange: GraphDataEvent;
	private onPreviewChange: GraphDataEvent;

	private clearSet(interaction: 'preview' | 'selection') {
		const interactionSet = interaction === 'preview' ? this.previewSet : this.selectionSet;
		const interactionProp = interaction === 'preview' ? 'previewed' : 'selected';
		const interactionPropFocus = interaction === 'preview' ? 'previewedFocus' : 'selectedFocus';
		const interactionPropParent = interaction === 'preview' ? 'previewedParent' : 'selectedParent';

		interactionSet.forEach((item) => {
			item[interactionProp] = undefined;
			item[interactionPropFocus] = undefined;
			item[interactionPropParent] = undefined;
		});
		interactionSet.clear();
	}
	private addToSet(node: HierarchicalGraphNode, interaction: 'preview' | 'selection') {
		const interactionSet = interaction === 'preview' ? this.previewSet : this.selectionSet;
		const interactionProp = interaction === 'preview' ? 'previewed' : 'selected';
		const interactionPropFocus = interaction === 'preview' ? 'previewedFocus' : 'selectedFocus';
		const interactionPropParent = interaction === 'preview' ? 'previewedParent' : 'selectedParent';

		// add parent nodes
		function addAncestors(node: HierarchicalGraphNode) {
			let parentNode = node.parent;
			while (parentNode) {
				parentNode[interactionPropParent] = true; // selectedParent
				interactionSet.add(parentNode);
				parentNode = parentNode.parent;
			}
		}
		function addNode(node: HierarchicalGraphNode) {
			if (node == null || node.parent == null) return; // rootLink or rootNode
			node[interactionProp] = true;
			interactionSet.add(node);
			addAncestors(node);
		}
		function addLink(link: HierarchicalGraphLink) {
			link[interactionProp] = true;
			interactionSet.add(link);
		}

		// set focus node
		node[interactionPropFocus] = true;
		addNode(node);

		// add links and linked nodes
		const isSubNode = node.baseLinks.length > 0;
		if (isSubNode) {
			node.baseLinks.forEach((baseLink) => {
				baseLink.graphLinks.forEach((graphLink) => {
					addLink(graphLink);
				});
				addNode(baseLink.source);
				addNode(baseLink.target);
			});
		} else {
			// isSuperNode
			const parentLinks = node.graphLinks.filter((d) => (d.type = 'parentLink'));
			parentLinks.forEach((parentLink) => {
				const link = parentLink.parent;
				// if (link == null) console.log(parentLink);
				if (link && link.parent != null) {
					addLink(link);
					addNode(link.target);
					addNode(link.source);
				}
			});
		}
	}

	selectNode(node: HierarchicalGraphNode | string, fireEvent = true) {
		const _node = typeof node === 'string' ? this.allNodes.get(node) : node;
		if (!_node) return;
		this.clearSelection(false);
		this.addNodeToSelection(_node, false);
		if (fireEvent) this.onSelectionChange(_node, Array.from(this.selectionSet));
	}
	addNodeToSelection(node: HierarchicalGraphNode, fireEvent = true) {
		this.addToSet(node, 'selection');
		if (fireEvent) this.onSelectionChange(node, Array.from(this.selectionSet));
	}
	// removeNodeFromSelection(node: HierarchyReturnNode, fireEvent = true) {
	//   console.warn('HierarchicalGraphData.removeNodeFromSelection() is not implemented');
	// }
	clearSelection(fireEvent = true) {
		this.clearSet('selection');
		if (fireEvent) this.onSelectionChange();
	}

	previewNode(node: HierarchicalGraphNode | string, fireEvent = true) {
		const _node = typeof node === 'string' ? this.allNodes.get(node) : node;
		if (!_node) return;
		this.clearPreview(false);
		this.addNodeToPreview(_node, false);
		if (fireEvent) this.onPreviewChange(_node, Array.from(this.selectionSet));
	}
	addNodeToPreview(node: HierarchicalGraphNode, fireEvent = true) {
		this.addToSet(node, 'preview');
		if (fireEvent) this.onPreviewChange(node, Array.from(this.selectionSet));
	}
	// removeNodeFromPreview(node: HierarchyReturnNode, fireEvent = true) {
	//   console.warn('HierarchicalGraphData.removeNodeFromPreview() is not implemented');
	// }
	clearPreview(fireEvent = true) {
		this.clearSet('preview');
		if (fireEvent) this.onPreviewChange();
	}
}

const setToIds = (set: Set<NodeOrLink>) => Array.from(set).map((nodeOrLink) => nodeOrLink.id || '');

const setFromIds = (ids: string[], idMap: Map<string, NodeOrLink>) =>
	new Set(ids.map((id) => idMap.get(id)).filter((isDefined) => isDefined) as NodeOrLink[]);

const linkConnectionTimeState = (
	source: HierarchicalGraphNode,
	target: HierarchicalGraphNode
): CurrentTimeType | undefined => {
	const st = source.currentTimeState;
	const tt = target.currentTimeState;
	if (st === tt) return st;
	if (st === 'future' || tt === 'future') return 'future';
	if (st === 'past' || tt === 'past') return 'past';
	if (st === 'present' || tt === 'present') return 'present';
	return undefined;
};

import { HierarchyNode, Selection, Simulation, SimulationLinkDatum, SimulationNodeDatum, ZoomTransform } from 'd3';
import { NodeShape } from '../GraphRenderers/polygon-utils';
import {
	BaseLink,
	HierarchicalGraphBaseLink,
	HierarchicalGraphLinkDatum,
	HierarchicalGraphNodeDatum,
} from './GraphNodesAndLinks';

export interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
	parents?: GraphNodeParent[];
}

export interface GraphLink {
	source: string;
	target: string;
	id: string;
}

export interface GraphNode {
	id: string;
	parent: string;
	name: string;
	isServer: boolean;
	start?: string;
	end?: string;
	className?: string;
	shape?: NodeShape;
}

export interface GraphNodeParent {
	id: string;
	name: string;
	className?: string;
}

export interface PreviewState {
	previewed?: boolean;
	previewedFocus?: boolean;
	previewedParent?: boolean;
}
export interface SelectionState {
	selected?: boolean;
	selectedFocus?: boolean;
	selectedParent?: boolean;
}
export interface InteractionState extends PreviewState, SelectionState {}

export type CurrentTimeType = 'past' | 'present' | 'future';
export interface CurrentTimeState {
	currentTimeState?: CurrentTimeType;
}

export interface SerializableHierarchicalGraphData {
	nodes: HierarchicalGraphNodeDatum[];
	links: HierarchicalGraphLinkDatum[];
	baseLinks: BaseLink[];
}

export interface HierarchicalGraphLink
	extends HierarchyNode<HierarchicalGraphLinkDatum>,
		SimulationLinkDatum<HierarchicalGraphNode>,
		InteractionState,
		CurrentTimeState,
		WithShortLine {
	source: HierarchicalGraphNode;
	target: HierarchicalGraphNode;
	type: HierarchicalGraphLinkDatum['type'];
	baseLinks: HierarchicalGraphBaseLink[];
}

export interface HierarchicalGraphNode
	extends HierarchyNode<HierarchicalGraphNodeDatum>,
		SimulationNodeDatum,
		InteractionState,
		CurrentTimeState {
	r?: number;
	type: HierarchicalGraphNodeDatum['type'];
	baseLinks: HierarchicalGraphBaseLink[];
	graphLinks: HierarchicalGraphLink[];
	parentLink?: HierarchicalGraphLink;
}

export interface WithShortLine {
	/** for GroupNodeLinks using shortenLine */
	shortLink: {
		source: {
			x: number;
			y: number;
		};
		target: {
			x: number;
			y: number;
		};
	};
}

// export type Hosts = Record<string, { hostName: string; beaconIds: string[] }>;
export type RootSVG = Selection<SVGSVGElement, any, any, any>;
export type HierarchyNodeSelection = Selection<any, HierarchicalGraphNode, any, HierarchicalGraphNode | undefined>;
export type HierarchyLinkSelection = Selection<any, HierarchicalGraphLink, any, HierarchicalGraphNode | undefined>;
export type GenericSelection = Selection<any, any, any, any | undefined>;
export type GraphZoomTransform = ZoomTransform & {
	/** radius(r) scale(k) */
	rk: number;
};

export type HierarchicalSimulation = Simulation<HierarchicalGraphNode, HierarchicalGraphLinkDatum>;
export type HierarchicalSimulationForce = {
	name: string;
	force: Force<HierarchicalGraphNode, HierarchicalGraphLinkDatum>;
	optional?: boolean;
};

export type NodeOrLink = HierarchicalGraphNode | HierarchicalGraphLink;

export type GraphDataEvent<Item = NodeOrLink> = (node?: HierarchicalGraphNode, selectedItems?: Item[]) => void;

import { SimulationNodeDatum } from 'd3';
import { PolygonShapeEx } from '../GraphRenderers/polygon-utils';
import { HierarchicalGraphLink, HierarchicalGraphNode, GraphLink, CurrentTimeState, CurrentTimeType } from './types';

export interface HierarchicalGraphNodeDatumProps {
	id: string;
	parent: string;
	name?: string;
	level: HierarchicalGraphNodeDatum['level'];
	type: HierarchicalGraphNodeDatum['type'];
	/** link from a parentLinkNode to related parentLink */
	parentLink?: string;
	isServer?: boolean;
	start?: string;
	end?: string;

	className?: string;
	shape?: PolygonShapeEx;
}

export class HierarchicalGraphNodeDatum implements SimulationNodeDatum {
	id: string;
	parent: string;
	name?: string;
	level: 'super' | 'group' | 'sub';
	type: 'keyNode' | 'parentLinkNode';
	linkSignature: string[] = [];
	baseLinks: string[] = [];
	parentLink?: string;

	isServer: boolean = false;
	start?: Date;
	end?: Date;

	removeClassName?: string;
	className?: string;
	shape?: PolygonShapeEx;

	// SimulationNodeDatum
	x?: number;
	y?: number;
	fx?: number;
	fy?: number;
	vx?: number;
	vy?: number;
	index?: number;

	r?: number;

	constructor(props: HierarchicalGraphNodeDatumProps) {
		this.id = props.id;
		this.parent = props.parent;
		this.name = props.name;
		this.level = props.level;
		this.type = props.type;
		this.parentLink = props.parentLink;
		this.className = props.className;
		this.shape = props.shape;
		if (props.isServer) this.isServer = props.isServer;
		if (props.start) this.start = new Date(props.start);
		if (props.end) this.end = new Date(props.end);
	}
}

export interface HierarchicalGraphLinkDatumProps extends GraphLink {
	parent: string;
	type: HierarchicalGraphLinkDatum['type'];
	parentNode: string;
}

export class HierarchicalGraphLinkDatum {
	source: string;
	target: string;
	id: string;
	parent: string;
	type: 'siblingLink' | 'parentLink';
	parentNode: string;
	baseLinks: string[] = [];
	constructor(props: HierarchicalGraphLinkDatumProps) {
		this.source = props.source;
		this.target = props.target;
		this.id = props.id;
		this.parent = props.parent;
		this.type = props.type;
		this.parentNode = props.parentNode;
	}
}

export class BaseLink {
	// RootLink?
	source: string;
	target: string;
	id: string;
	graphLinks: string[] = [];
	// parent: string = HierarchicalGraphData.rootLinkName;
	constructor(props: GraphLink) {
		this.source = props.source;
		this.target = props.target;
		this.id = props.id;
	}
}

export class HierarchicalGraphBaseLink implements CurrentTimeState {
	source: HierarchicalGraphNode;
	target: HierarchicalGraphNode;
	id: string;
	graphLinks: HierarchicalGraphLink[] = [];
	currentTimeState?: CurrentTimeType;
	data: BaseLink;
	constructor(props: HierarchicalGraphBaseLink) {
		this.source = props.source;
		this.target = props.target;
		this.id = props.id;
		this.graphLinks = props.graphLinks;
		this.data = props.data;
	}
}

import * as saveSvgAsPng from 'save-svg-as-png';
import { HierarchicalGraphData } from './GraphData/HierarchicalGraphData';
import { clampXyToRadius, classNames } from './GraphRenderers/layout-utils';
import {
	GraphData,
	RootSVG,
	GraphZoomTransform,
	HierarchyNodeSelection,
	HierarchicalGraphNode,
	SerializableHierarchicalGraphData,
} from './GraphData/types';
import {
	zoom as d3Zoom,
	drag as d3Drag,
	zoomTransform as d3ZoomTransform,
	zoomIdentity as d3ZoomIdentity,
	select as d3Select,
	D3DragEvent,
	DragBehavior,
	ZoomBehavior,
} from 'd3';
import { SuperGraphRenderer } from './GraphRenderers/SuperGraphRenderer';
import { HierarchicalGraphRenderer } from './GraphRenderers/HierarchicalGraphRenderer';
import { textOcclusion, textOcclusionSort } from './GraphRenderers/textOcclusion';
import { initializeTesting, noOp } from './utils';
import { PolygonShapeEx } from './GraphRenderers/polygon-utils';

/** The root graph handler for all subgraphs and interactions */
export class GraphHandler {
	graphData: HierarchicalGraphData;
	protected svg: RootSVG;
	protected rootSelection: HierarchyNodeSelection;
	protected dimensions: { width: number; height: number } = { width: 0, height: 0 };
	protected graphRoot!: SuperGraphRenderer;
	private onSelectionChange: HierarchicalGraphData['onSelectionChange'] = noOp;
	private onPreviewChange: HierarchicalGraphData['onPreviewChange'] = noOp;
	private onTimeChange: HierarchicalGraphData['onTimeChange'] = noOp;
	private onDataChange: HierarchicalGraphData['onDataChange'] = noOp;

	constructor({
		onSelectionChange = noOp,
		onPreviewChange = noOp,
		onTimeChange = noOp,
		onDataChange = noOp,
		graphData,
		element,
		previouslyParsedGraphData,
	}: {
		onSelectionChange?: HierarchicalGraphData['onSelectionChange'];
		onPreviewChange?: HierarchicalGraphData['onPreviewChange'];
		onTimeChange?: HierarchicalGraphData['onTimeChange'];
		onDataChange?: HierarchicalGraphData['onDataChange'];
		graphData: GraphData;
		element: SVGSVGElement;
		previouslyParsedGraphData?: SerializableHierarchicalGraphData;
	}) {
		this.onSelectionChange = onSelectionChange;
		this.onPreviewChange = onPreviewChange;
		this.onTimeChange = onTimeChange;
		this.onDataChange = onDataChange;
		this.graphData = new HierarchicalGraphData({
			graphData,
			onSelectionChange: this._onSelectionChange,
			onPreviewChange: this._onPreviewChange,
			onTimeChange: this._onTimeChange,
			onDataChange: this._onDataChange,
			previouslyParsedGraphData,
		});

		this.svg = d3Select(element)
			//
			.html('')
			.classed([classNames.graphRoot, 'dotGrid'].join(' '), true);
		this.resize();

		// append a background that handles deselecting nodes
		this.svg
			.append('rect')
			.on('mouseover', this.mouseOutNode.bind(this))
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('x', '-50%')
			.attr('y', '-50%')
			.attr('fill', 'transparent');

		this.rootSelection = this.svg.append('g');

		this.initializeZoom();

		this.updateGraphRoot();

		initializeTesting(this);

		this.zoomToFit({ duration: 0 });
	}

	private updateGraphRoot() {
		if (this.graphRoot != null) {
			this.rootSelection.selectChildren().remove();
		}
		this.graphRoot = new SuperGraphRenderer({
			rootNode: this.graphData.rootNode,
			rootSelection: this.rootSelection,
			graphHandler: this,
		});
	}

	private _onSelectionChange: HierarchicalGraphData['onSelectionChange'] = (...args) => {
		this.graphRoot.callChildrenRecursively('drawInteraction');
		this.drawTextOcclusion();
		this.onSelectionChange(...args);
	};
	private _onPreviewChange: HierarchicalGraphData['onPreviewChange'] = (...args) => {
		this.graphRoot.callChildrenRecursively('drawInteraction');
		this.drawTextOcclusion();
		this.onPreviewChange(...args);
	};
	private _onTimeChange: HierarchicalGraphData['onTimeChange'] = () => {
		this.graphRoot.callChildrenRecursively('drawTime');
		this.drawTextOcclusion();
		this.onTimeChange();
	};
	private _onDataChange: HierarchicalGraphData['onDataChange'] = () => {
		this.updateGraphRoot();
		this.onDataChange();
	};

	private drawTextOcclusion() {
		textOcclusion<HierarchicalGraphNode>({
			selection: this.rootSelection,
			className: classNames.occludedLabel,
			prioritySort: textOcclusionSort,
		});
	}

	private zoom!: ZoomBehavior<SVGSVGElement, unknown>;
	private initializeZoom() {
		// const drawDotGrid = dotGrid(this.svg.node() || undefined);

		const zoomed = () => {
			this.graphRoot.freeze(); // for draw performance...
			this.graphRoot.callChildrenRecursively('drawLayout');
			// drawDotGrid() may decrease draw performance
			// drawDotGrid(this.zoomTransform);
		};

		const zoomStart = () => {
			this.svg.classed(classNames.isZooming, true);
		};
		const zoomEnd = () => {
			this.svg.classed(classNames.isZooming, false);
			this.drawTextOcclusion();
		};

		this.zoom = d3Zoom<SVGSVGElement, unknown>()
			.extent([
				[0, 0],
				[this.dimensions.width, this.dimensions.height],
			])
			.scaleExtent([1 / 2, 10])
			.on('start', zoomStart)
			.on('zoom', zoomed)
			.on('end', zoomEnd);

		this.svg.call(this.zoom);
		// drawDotGrid(this.zoomTransform);
	}

	get zoomTransform(): GraphZoomTransform {
		const _zoomTransform = d3ZoomTransform(this.svg.node()!) as GraphZoomTransform;
		_zoomTransform.rk = GraphHandler.scaleRadius(_zoomTransform.k);
		return _zoomTransform;
	}

	zoomToFit({
		duration = 750,
		boundingBox,
	}: {
		duration?: number;
		boundingBox?: {
			x: number;
			y: number;
			width: number;
			height: number;
		};
	} = {}) {
		const { k: k1, x: x1, y: y1 } = this.zoomTransform;
		const { height: h1, width: w1 } = this.dimensions;

		// get the current dimensions of the bounding element, or take the boundingBox param
		const bBox = boundingBox || (this.rootSelection.node() as SVGGElement).getBBox();
		const { height: h2, width: w2 } = bBox;

		// get the current center of the bounding element
		const x2 = bBox.x + w2 / 2;
		const y2 = bBox.y + h2 / 2;

		// get the ratio of the bounding element to the viewport, whichever dimension is larger
		const k2 = Math.max(w2 / w1, h2 / h1); // take this as the scale

		// adjust the current scale by the old scale, add a buffer, clamp to a max zoom-in
		const k = Math.min(k1 / k2 - 0.2, 4);

		// get the difference in transform, and remove the old scale from both
		const x = (x1 - x2) / k1;
		const y = (y1 - y2) / k1;

		// console.log({ k2, x2, y2, k1, x1, y1, k, x, y }); // DEBUG //

		// call the d3 transition to the new x, y, k
		this.svg.transition().duration(duration).call(
			this.zoom.transform,
			d3ZoomIdentity.scale(k).translate(x, y)
			//, fromCurrentZoomState?
		);
	}
	zoomToSelection() {
		throw new Error('Not Implemented');
		// https://observablehq.com/@d3/zoom-to-bounding-box ?
		// get all selected elements
		// sum the boundingBoxes of all those elements into a single boundingBox
		// call this.zoomToFix({boundingBox})
	}
	zoomIn() {
		// https://observablehq.com/@d3/programmatic-zoom
		this.svg.transition().call(this.zoom.scaleBy, 1.3, [0, 0]);
	}
	zoomOut() {
		// https://observablehq.com/@d3/programmatic-zoom
		this.svg.transition().call(this.zoom.scaleBy, 0.7, [0, 0]);
	}

	exportSVG(backgroundColor?: string) {
		const viewBox = this.svg.node()?.getAttribute('viewBox')?.split(/\s+|,/);
		saveSvgAsPng.saveSvgAsPng(
			this.svg.node(), // SVG DOM Element object to be exported. Alternatively, a string of the serialized SVG can be passed
			'graph.png', // file name of exported image
			{
				top: `${viewBox?.[1]}`,
				left: `${viewBox?.[0]}`,
				width: `${viewBox?.[2]}`,
				height: `${viewBox?.[3]}`,
				encoderOptions: 1,
				backgroundColor,
			}
		);
	}

	dragState: {
		startX?: number;
		startY?: number;
		isDragging?: boolean;
	} = {};

	initializeDrag(graphHierarchical: HierarchicalGraphRenderer): DragBehavior<any, any, any> {
		const dragStart = (event: D3DragEvent<any, any, any>) => {
			if (event.active) return; // is this necessary?
			event.subject.fx = this.dragState.startX = event.subject.x;
			event.subject.fy = this.dragState.startY = event.subject.y;
			// graphHierarchical.reheat(0.3);
		};

		const dragging = (event: D3DragEvent<any, any, any>) => {
			// TODO: this does not scale to this.zoomTransform.rk on groupNodes
			if (!this.dragState.isDragging) {
				// graphHierarchical.reheat(0.5);
				this.dragState.isDragging = true;
			}
			const { k: zk } = this.zoomTransform;
			const { x: mouseX, y: mouseY /*, dx,dy */ } = event;
			const { startX = 0, startY = 0 } = this.dragState;
			// let { fx, fy, r } = event.subject;
			// let absX = dx / zk + fx;
			// let absY = dy / zk + fy;
			const absDx = mouseX - startX;
			const absDy = mouseY - startY;
			const absX = absDx / zk + startX;
			const absY = absDy / zk + startY;
			const { x, y } = clampXyToRadius([absX, absY], event.subject.parent.r - event.subject.r);
			event.subject.fx = x;
			event.subject.fy = y;
			graphHierarchical.reheat(Math.max(Math.abs(mouseX), Math.abs(mouseY)) * 0.0001);
		};

		const dragEnd = (event: D3DragEvent<any, any, any>) => {
			if (event.active) return; // is this necessary?
			graphHierarchical.cool();
			event.subject.fx = null;
			event.subject.fy = null;
			this.dragState = {};
		};

		return d3Drag().on('start', dragStart).on('drag', dragging).on('end', dragEnd);
	}

	clickNode(_event: PointerEvent, node: HierarchicalGraphNode) {
		if (node.selectedFocus) this.graphData.clearSelection();
		else this.graphData.selectNode(node);
	}
	mouseOverNode(_event: PointerEvent, node: HierarchicalGraphNode) {
		if (!this.dragState.isDragging) this.graphData.previewNode(node);
	}
	mouseOutNode() {
		if (!this.dragState.isDragging) this.graphData.clearPreview();
	}

	resize() {
		const element = this.svg.node()!;
		this.dimensions = { width: element.clientWidth, height: element.clientHeight };
		const { width, height } = this.dimensions;
		this.svg
			// this.svg.attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
			// .attr('width', width)
			// .attr('height', height)
			.attr('viewBox', [-width / 2, -height / 2, width, height].join(' '));
	}

	// TODO:
	// clickLink(event: PointerEvent, node: HierarchyReturnNode) {}
	// mouseOverLink(event: PointerEvent, node: HierarchyReturnNode) {}
	// mouseOutLink(event: PointerEvent, node: HierarchyReturnNode) {}

	updateNodeName(nodeId: string, newName: string) {
		const node = this.graphData.allNodes.get(nodeId);
		if (!node) return;
		node.data.name = newName;
		this.graphRoot.callChildrenRecursively('drawUpdateLabel');
	}

	updateNodeVisual({
		nodeId,
		className,
		shape,
	}: {
		nodeId: string;
		/** pass empty string to remove className */
		className?: string;
		shape?: PolygonShapeEx;
	}) {
		const node = this.graphData.allNodes.get(nodeId);
		if (!node) return;
		if (className != null) {
			node.data.removeClassName = node.data.className;
			node.data.className = className;
		}
		if (shape) node.data.shape = shape;

		this.graphRoot.callChildrenRecursively('drawUpdateNodeVisual');

		/* 
		// This function *could* be made more performant by selecting only the exact node for update
		const nodeSelection = this.graphRoot.rootSelection.select('#' + nodeId)
		// and sending it through a static method of a specific GraphRenderer class 
		SomeGraphRenderer.updateNodeVisual(nodeSelection)
		// this technique would also work in this.updateNodeName
		*/
	}

	useGraphForces() {
		this.graphRoot.callChildrenRecursively('useGraphForces');
	}
	useSimpleForces() {
		this.graphRoot.callChildrenRecursively('useSimpleForces');
	}

	static scaleRadius = (zk: number) => Math.min(zk, (zk - 1) * 0.3 + 1);
}

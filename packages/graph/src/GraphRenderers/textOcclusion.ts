import { select, Selection } from 'd3';
import { HierarchicalGraphNode, InteractionState } from '../GraphData/types';

/**
 * source: https://observablehq.com/@fil/occlusion
 * This is a "brute force" method of collision detection, comparing everything to everything
 *
 * There are better methods using [d3.quadtree](https://github.com/d3/d3-quadtree)
 * - https://observablehq.com/@bmschmidt/finding-text-occlusion-with-quadtrees
 * - https://observablehq.com/@bmschmidt/calculating-label-occlusion-across-zoom-levels-with-3d-r-tr
 *
 * TODO: use a quadtree based solution for improved performance
 */
export function textOcclusion<SubDatum>({
	selection,
	prioritySort,
	className = 'occluded',
}: TextOcclusionProps<SubDatum>) {
	const allTexts: TextOcclusionDatum[] = [];

	selection
		.selectAll('text')
		.classed(className, false)
		.each((d, i, e) => {
			const node = e[i] as SVGTextElement;
			const domRect = node.getBoundingClientRect();
			allTexts.push({
				node,
				d: d as SubDatum,
				domRect,
			});
		});

	const filledTexts: TextOcclusionDatum[] = [];

	// linear sort is also not ideal
	if (prioritySort) allTexts.sort(prioritySort);
	allTexts.forEach((text) => {
		const isOccluded = filledTexts.some((filledText) => intersect(text.domRect, filledText.domRect));
		select(text.node).classed(className, isOccluded);
		if (!isOccluded) filledTexts.push(text);
	});

	return filledTexts;
}

function intersect(a: DOMRect, b: DOMRect) {
	return !(
		a.x + a.width < b.x || //
		b.x + b.width < a.x ||
		a.y + a.height < b.y ||
		b.y + b.height < a.y
	);
}

export type TextOcclusionDatum<SubDatum = any> = {
	node: SVGTextElement;
	d: SubDatum;
	domRect: DOMRect;
};

export type TextOcclusionProps<SubDatum = any> = {
	selection: Selection<SVGElement, SubDatum, any, SubDatum | undefined>;
	prioritySort?: Parameters<Array<TextOcclusionDatum<SubDatum>>['sort']>[0];
	className?: string;
};

export const textOcclusionSort: TextOcclusionProps<HierarchicalGraphNode>['prioritySort'] = (a, b) => {
	const statePriority: (keyof InteractionState)[] = [
		'previewedFocus',
		'previewed',
		'previewedParent',
		'selectedFocus',
		'selected',
		'selectedParent',
	];
	for (const priority of statePriority) {
		if (a.d[priority] != b.d[priority]) {
			return a.d[priority] ? -1 : 1;
		}
	}
	// if (size of thing?)
	return 0;
};

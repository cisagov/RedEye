import { HierarchyNode, stratify as d3Stratify } from 'd3';
import { dedupeSortArray, setMapKeyIfUnset } from '../utils';
import { BaseLink, HierarchicalGraphLinkDatum, HierarchicalGraphNodeDatum } from './GraphNodesAndLinks';
import { GraphData, GraphNodeParent, SerializableHierarchicalGraphData } from './types';

export function hierarchicalGraphDataParser(graphDataInitial: GraphData, validateData = true) {
	// duplicate graphData to avoid editing original
	const graphData: GraphData = Object.assign(graphDataInitial);

	// validate graphData
	if (validateData) {
		graphData.nodes = graphData.nodes.filter((node) => {
			if (node.id == null || node.parent == null) {
				console.warn('A graphData node did not contain all required properties and is being removed', {
					errorNode: node,
				});
				return false;
			} else return true;
		});
		graphData.links = graphData.links.filter((link) => {
			if (link.source == null || link.source == null) {
				console.warn('A graphData link did not contain all required properties and is being removed', {
					errorLink: link,
				});
				return false;
			} else return true;
		});
	}

	// create map of parentNames
	if (!graphData.parents) graphData.parents = [];
	const parentNames = new Map<string, GraphNodeParent>(graphData.parents.map((parent) => [parent.id, parent]));

	// create map of SuperNodes
	const superNodes = new Map<string, HierarchicalGraphNodeDatum>();
	graphData.nodes.forEach((node) => {
		setMapKeyIfUnset(
			superNodes,
			node.parent,
			new HierarchicalGraphNodeDatum({
				...node,
				name: parentNames.get(node.parent)?.name,
				id: node.parent,
				parent: ids.rootNodeName,
				level: 'super',
				type: 'keyNode',
			})
		);
	});

	// create map of SubNodes
	const subNodes = new Map<string, HierarchicalGraphNodeDatum>(
		graphData.nodes.map((node) => [
			node.id,
			new HierarchicalGraphNodeDatum({
				...node,
				level: 'sub',
				type: 'keyNode',
			}),
		])
	);

	// create baseLinks - the links between subnodes with different parents
	const baseLinks = new Map<string, BaseLink>();
	graphData.links.forEach((link) => {
		const { source, target } = link;
		const baseLinkId = [source, target].sort().join(ids.idDelimiter);
		setMapKeyIfUnset(
			baseLinks,
			baseLinkId,
			new BaseLink({
				source,
				target,
				id: baseLinkId,
			})
		);
	});

	// assign linkSignatures to SubNodes
	baseLinks.forEach((baseLink) => {
		const source = subNodes.get(baseLink.source)!;
		const target = subNodes.get(baseLink.target)!;
		if (source.parent === target.parent) {
			// sibling Link
			source.linkSignature.push(target.id);
			target.linkSignature.push(source.id);
		} else {
			// parent Link
			source.linkSignature.push(target.parent);
			target.linkSignature.push(source.parent);
		}
		source.baseLinks.push(baseLink.id);
		target.baseLinks.push(baseLink.id);
	});

	// create map of GroupNodes based on nodes with a common linkSignature
	const groupNodes = new Map<string, HierarchicalGraphNodeDatum>();
	subNodes.forEach((subNode) => {
		// some groupNodes will have only one subNode
		// TODO: maybe ^^^ doesn't need a groupNode?
		subNode.linkSignature = [subNode.parent, ...dedupeSortArray(subNode.linkSignature), ids.groupNodeSuffix];
		const groupNodeId = subNode.linkSignature.join(ids.idDelimiter);
		setMapKeyIfUnset(
			groupNodes,
			groupNodeId,
			new HierarchicalGraphNodeDatum({
				id: groupNodeId,
				parent: subNode.parent,
				level: 'group',
				type: 'keyNode',
			})
		);
		subNode.parent = groupNodeId;
	});

	const nodeJoin = [
		{ id: ids.rootNodeName } as HierarchicalGraphNodeDatum,
		...superNodes.values(),
		...groupNodes.values(),
		...subNodes.values(),
	];

	// d3.stratify the 3 levels of nodes
	const partialRootNode = d3Stratify<HierarchicalGraphNodeDatum>()
		.id((d) => d.id)
		.parentId((d) => d.parent)(nodeJoin);

	const allNodes = new Map(partialRootNode.descendants().map((node) => [node.id!, node]));

	const parentLinkNodes = new Map<string, HierarchicalGraphNodeDatum>();
	const abstractLinks = new Map<string, HierarchicalGraphLinkDatum>();

	baseLinks.forEach((baseLink) => {
		const source = allNodes.get(baseLink.source)!;
		const target = allNodes.get(baseLink.target)!;
		// TODO:? this could be some kind of recursive function for infinite levels of depth.
		if (source?.parent?.id === target?.parent?.id) {
			// subLink is internal to groupNode
			console.warn(source?.parent?.id);
			// there should be none of these, or the groupNode would not exist
		} else if (
			source.parent?.parent &&
			target.parent?.parent &&
			source.parent?.parent?.id === target.parent?.parent?.id
		) {
			// groupLink is internal to parentNode - a groupNode siblingLink
			const linkId = addSiblingLink(source.parent, target.parent, abstractLinks, baseLink);
			addParentLink(source, abstractLinks, parentLinkNodes, baseLink, linkId);
			addParentLink(target, abstractLinks, parentLinkNodes, baseLink, linkId);
		} else if (
			source.parent?.parent?.parent &&
			target.parent?.parent?.parent &&
			source.parent?.parent?.parent?.id === target.parent?.parent?.parent?.id
		) {
			// the groupLink spans a parentNode - a superNode siblingLink with groupNode siblingLinks
			const linkId = addSiblingLink(source.parent.parent, target.parent.parent, abstractLinks, baseLink);
			const sourceParentLinkId = addParentLink(source.parent, abstractLinks, parentLinkNodes, baseLink, linkId);
			const targetParentLinkId = addParentLink(target.parent, abstractLinks, parentLinkNodes, baseLink, linkId);
			addParentLink(source, abstractLinks, parentLinkNodes, baseLink, sourceParentLinkId);
			addParentLink(target, abstractLinks, parentLinkNodes, baseLink, targetParentLinkId);
		} else {
			console.warn(source.parent?.parent?.parent?.id, target.parent?.parent?.parent?.id);
			// there should be none of these, this is the rootNode
		}
	});

	// const getLinkOrNode = (id: string) => {
	//   return [superNodes, groupNodes, subNodes, parentLinkNodes, baseLinks, abstractLinks]
	//     .find((map) => map.get(id))
	//     ?.get(id);
	// };

	baseLinks.forEach((baseLink) => {
		baseLink.graphLinks = dedupeSortArray(baseLink.graphLinks);
		// baseLink.graphLinks.forEach((graphLink) => {
		//   abstractLinks.get(graphLink)!.baseLinks.push(baseLink.id);
		// });
	});
	// abstractLinks.forEach((abstractLink) => {
	//   abstractLink.baseLinks = dedupeSortArray(abstractLink.baseLinks);
	// });

	const linkData = [
		{ id: ids.rootLinkName } as HierarchicalGraphLinkDatum, //
		...abstractLinks.values(),
	];
	const nodeData = [
		{ id: ids.rootNodeName } as HierarchicalGraphNodeDatum,
		...superNodes.values(),
		...groupNodes.values(),
		...subNodes.values(),
		...parentLinkNodes.values(),
	];

	const serializableData: SerializableHierarchicalGraphData = {
		nodes: nodeData,
		links: linkData,
		baseLinks: [...baseLinks.values()],
	};

	return serializableData;
}

function addSiblingLink(
	sourceNode: HierarchyNode<HierarchicalGraphNodeDatum>,
	targetNode: HierarchyNode<HierarchicalGraphNodeDatum>,
	linkMap: Map<string, HierarchicalGraphLinkDatum>,
	baseLink: BaseLink
) {
	const source = sourceNode.id!;
	const target = targetNode.id!;
	const parentNode = sourceNode.parent?.id!; // also targetNode.parent.id
	const siblingLinkId = createLinkId(source, target);
	setMapKeyIfUnset(
		linkMap,
		siblingLinkId,
		new HierarchicalGraphLinkDatum({
			source,
			target,
			id: siblingLinkId,
			parent: ids.rootLinkName,
			type: 'siblingLink',
			parentNode,
		})
	)?.baseLinks.push(baseLink.id);

	baseLink.graphLinks.push(siblingLinkId);
	return siblingLinkId;
}

function addParentLink(
	node: HierarchyNode<HierarchicalGraphNodeDatum>,
	abstractLinks: Map<string, HierarchicalGraphLinkDatum>,
	parentLinkNodes: Map<string, HierarchicalGraphNodeDatum>,
	baseLink: BaseLink,
	linkId: string
) {
	const parentLinkNodeId = [node.parent!.id, linkId, ids.parentLinkNodeSuffix].join(ids.idDelimiter);

	setMapKeyIfUnset(
		parentLinkNodes,
		parentLinkNodeId,
		new HierarchicalGraphNodeDatum({
			id: parentLinkNodeId,
			type: 'parentLinkNode',
			parent: node.parent!.id!,
			level: node.parent!.data.level,
			parentLink: linkId,
		})
	)?.baseLinks.push(baseLink.id);

	const parentLinkId = [node.id!, parentLinkNodeId].join(ids.idDelimiter);
	setMapKeyIfUnset(
		abstractLinks,
		parentLinkId,
		new HierarchicalGraphLinkDatum({
			source: node.id!,
			target: parentLinkNodeId,
			id: parentLinkId,
			parent: linkId,
			type: 'parentLink',
			parentNode: node.parent?.id!,
		})
	)?.baseLinks.push(baseLink.id);

	baseLink.graphLinks.push(parentLinkId);

	return parentLinkId;
}

function createLinkId(source: string, target: string): string {
	return [source, target].sort().join(ids.idDelimiter);
}

export const hierarchicalGraphDataParserIds = {
	idDelimiter: '/',
	parentLinkNodeSuffix: 'linkNode',
	groupNodeSuffix: 'groupNode',
	rootNodeName: 'rootNode',
	rootLinkName: 'rootLink',
};
const ids = hierarchicalGraphDataParserIds;

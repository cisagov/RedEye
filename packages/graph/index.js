import { json } from 'd3';
import { RedEyeGraph, getServers } from './src/index.ts';

export const testGraph = (svgElementId) => {
	// json('./testData/data1.json').then((rawGraphData) => {
	const randomGraphData = getServers(75, 5);
	window.graph = new RedEyeGraph({
		// onSelectionChange: (node) => console.log(node?.id),
		// onPreviewChange: (node) => console.log(node),
		graphData: randomGraphData,
		// graphData: {
		// 	...graphData.graph,
		// 	parents: Object.keys(graphData.hosts).map((hostId) => ({
		// 		name: graphData.hosts[hostId].hostName,
		// 		id: hostId,
		// 	})),
		// },
		element: document.getElementById(svgElementId),
	});
	window.addEventListener('resize', () => window.graph.resize());
	console.log(graph);
	// });
};

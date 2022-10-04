import { json } from 'd3';
import { RedEyeGraph, getServers } from './src/index.ts';

export const testGraph = (svgElementId) => {
	const randomGraphData = getServers(75, 5);
	json('./testData/data1.json').then((rawGraphData) => {
		window.graph = new RedEyeGraph({
			// onSelectionChange: (node) => console.log(node?.id),
			// onPreviewChange: (node) => console.log(node),
			// graphData: randomGraphData,
			graphData: {
				...rawGraphData.graph,
				parents: Object.keys(rawGraphData.hosts).map(
					(hostId) => ({
						name: rawGraphData.hosts[hostId].hostName,
						id: hostId,
					}),
				),
			},
			element: document.getElementById('app'),
		});
		window.addEventListener('resize', () => window.graph.resize());
	});
};

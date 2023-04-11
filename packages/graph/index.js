import { json } from 'd3';
import { RedEyeGraph, getServers } from './src/index.ts';

const getGraphData = async () => {
	try {
		return await json('./testData/large.json');
	} catch {
		return getServers(75, 5);
	}
};

export const testGraph = async (svgElementId) => {
	const graphData = await getGraphData();
	window.graph = new RedEyeGraph({
		graphData,
		element: document.getElementById(svgElementId),
	});
	window.addEventListener('resize', () => window.graph.resize());
	console.log(window.graph);
};

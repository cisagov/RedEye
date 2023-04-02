import { json } from 'd3';
import { RedEyeGraph, getServers } from './src/index.ts';

const getGraphData = async () => {
	try {
		return await json('./testData/large.json');
	} catch {
		return getServers(75, 5);
	}
};

const getPreviouslyParsedGraphData = async () => {
	try {
		return await json('./testData/parsedGraphData.json');
	} catch {
		return undefined;
	}
};

export const testGraph = async (svgElementId) => {
	const graphData = await getGraphData();
	const previouslyParsedGraphData = await getPreviouslyParsedGraphData();

	window.graph = new RedEyeGraph({
		graphData,
		element: document.getElementById(svgElementId),
		previouslyParsedGraphData,
	});
	window.addEventListener('resize', () => window.graph.resize());
	console.log(window.graph);
};

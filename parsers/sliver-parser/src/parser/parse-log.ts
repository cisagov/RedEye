import { readFile } from 'node:fs/promises';
import type { ParserCommand, ParserLink } from '@redeye/parser-core';
import type { Beacons } from '../sliver-entities/Beacons';

interface LogLine {
	time: string;
	level: string;
	msg: string;
	type: string;
}

export async function parseLog(filePath: string, dbBeacons: Beacons[] = [], links: ParserLink[] = []) {
	const file = await readFile(filePath, 'utf-8');
	const lines = file.split('\n');
	const outputs: Record<string, Record<string, ParserCommand>> = {};
	const mappedBeacons = dbBeacons.reduce((acc, beacon) => {
		acc[beacon.name!] = beacon;
		return acc;
	}, {} as Record<string, Beacons>);
	const beaconServerLink: Record<string, ParserLink | true> = {};
	for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
		const line = lines[lineNumber];
		try {
			if (line) {
				const logLine: LogLine = JSON.parse(line);
				if (logLine.type === 'command' && lines[lineNumber + 1]) {
					const nextLine = JSON.parse(lines[lineNumber + 1]);
					if (nextLine.msg.startsWith('Tasked beacon')) {
						const [beaconName, taskIdInParen] = nextLine.msg.replace('Tasked beacon ', '').split(' ');
						const taskId = taskIdInParen.replace('(', '').replace(')', '');

						if (!outputs[beaconName]) {
							outputs[beaconName] = {};
							beaconServerLink[beaconName] = {
								from: mappedBeacons[beaconName].activeC2!,
								to: beaconName,
							};
						}

						if (!outputs[beaconName][taskId]) {
							outputs[beaconName][taskId] = { beacon: beaconName } as ParserCommand;
						}
						const hasNewBeacon = Object.keys(mappedBeacons).find((beacon) => logLine.msg.includes(beacon));
						let link: ParserLink | undefined = undefined;
						if (hasNewBeacon) {
							beaconServerLink[hasNewBeacon] = true;
							link = {
								from: beaconName,
								to: hasNewBeacon,
							};
							links.push(link);
						}
						outputs[beaconName][taskId].input = {
							blob: logLine.msg,
							dateTime: new Date(logLine.time),
							logType: 'BEACON',
							lineType: 'INPUT',
						};

						lineNumber++;
					}
				} else if (logLine.type === 'event' && logLine.msg.includes('completed task')) {
					const [beaconName, taskId] = logLine.msg.replace(' completed task ', ' ').split(' ');
					const outputContent: string[] = [];
					while (lines[lineNumber]) {
						lineNumber++;
						const outputLine: LogLine = JSON.parse(lines[lineNumber]);
						if (outputLine.msg.startsWith('%!(EXTRA')) break;
						outputContent.push(outputLine.msg);
					}
					outputs[beaconName][taskId].output = {
						blob: outputContent.join('\n'),
						dateTime: new Date(logLine.time),
						logType: 'BEACON',
						lineType: 'OUTPUT',
					};
				}
			}
		} catch (e) {
			console.log(e, line);
		}
	}
	for (const beaconName in beaconServerLink) {
		const link = beaconServerLink[beaconName];
		if (link !== true) links.push(link);
	}
	return {
		commands: outputs,
		links,
	};
}

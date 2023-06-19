import { BruteRatelProfile, GraphBadger } from './profile.types';
import fs from 'fs-extra';
import path from 'path';
import { parseFiles } from './logParser';
import { ParserBeacon, ParserCommand, ParserHost, ParserLink, ParserOperator, ParserServer } from '@redeye/parser-core';
import { LogType } from '@redeye/models';

const mitreId = /\(([^)]+)\)/;
const compareDates = (newDate: Date, date?: Date, max?: boolean) => {
	if (max) {
		return !date || newDate > date ? newDate : date;
	} else {
		return !date || newDate < date ? newDate : date;
	}
};
export const parseAutosaveProfile = async (filePath: string) => {
	const autosaveProfile: BruteRatelProfile = JSON.parse(
		fs.readFileSync(path.join(filePath, 'autosave.profile'), 'utf8')
	);
	const commandOutputs = await parseFiles(path.join(filePath, 'logs'));
	const { listeners, badgers, badger_graph, user_activity, users } = autosaveProfile;

	const servers: Record<string, ParserServer> = {};
	const hosts: Record<string, ParserHost> = {};
	const beacons: Record<string, ParserBeacon> = {};
	const operators: Record<string, ParserOperator> = {};
	const commands: Record<string, ParserCommand> = {};
	const links: Record<string, ParserLink> = {};

	for (const [server] of Object.entries(listeners)) {
		servers[server] = { name: server, parsingPath: filePath };
	}

	for (const [beaconName, beaconInfo] of Object.entries(badgers)) {
		hosts[beaconInfo.b_h_name] = { name: beaconInfo.b_h_name, server: beaconInfo.b_c2_id };
		beacons[beaconName] = {
			name: beaconName,
			server: beaconInfo.b_c2_id,
			host: beaconInfo.b_h_name,
			process: beaconInfo.b_p_name,
			processId: parseInt(beaconInfo.b_pid),
			ip: beaconInfo.b_ip,
		};
	}

	for (const [operatorName] of Object.entries(users.active)) {
		operators[operatorName] = { name: operatorName };
	}

	for (const [user, userCommands] of Object.entries(user_activity)) {
		for (const [commandName, commandList] of Object.entries(userCommands)) {
			for (const command of commandList) {
				const currentBeacon = beacons[command.badger];
				const [commandDate, commandTime] = command.time.split(' ');

				const currentCommand = commandOutputs[commandDate]?.[command.badger]?.[commandTime];
				if (currentCommand) {
					const commandDateTime = new Date(command.time);
					if (currentBeacon) {
						const startTime = compareDates(commandDateTime, currentBeacon.startTime);
						const endTime = compareDates(commandDateTime, currentBeacon.endTime, true);
						beacons[currentBeacon.name] = { ...currentBeacon, startTime, endTime };
					}
					commands[`${commandName}-${command.host}-${command.badger}-${command.time}`] = {
						attackIds:
							(command.mitre
								?.flatMap((mitre) => [
									mitreId.exec(mitre.Tactic)?.at(1),
									...(mitre.Technique?.map((tech) => mitreId.exec(tech)?.at(1)?.split('-').at(0)?.trim()) || []),
								])
								.filter(Boolean) as string[]) || [],
						operator: user,
						beacon: command.badger,
						host: command.host,
						input: {
							filepath: currentCommand.filePath,
							dateTime: commandDateTime,
							blob: currentCommand.input.command?.join(' ') || '',
							lineNumber: currentCommand.input.lineNumber,
							logType: LogType.BEACON,
						},
						output: {
							filepath: currentCommand.filePath,
							dateTime: commandDateTime,
							blob: currentCommand.output || '',
							lineNumber: currentCommand.input.lineNumber,
							logType: LogType.BEACON,
						},
					};
				}
			}
		}
	}

	const handleLinkChildren = (child: GraphBadger) => {
		if ('children' in child && child.children) {
			for (const childChild of child.children) {
				links[`${child.name}-${childChild.name}`] = { from: child.name, to: childChild.name };
				handleLinkChildren(childChild);
			}
		}
	};

	for (const [serverName, children] of Object.entries(badger_graph)) {
		for (const child of children) {
			links[`${serverName}-${child.name}`] = { from: serverName, to: child.name };
			handleLinkChildren(child);
		}
	}

	return {
		servers,
		hosts,
		beacons,
		operators,
		commands,
		links,
	};
};

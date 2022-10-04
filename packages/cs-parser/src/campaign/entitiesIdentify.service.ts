import { watch } from 'chokidar';
import { createInterface } from 'readline';
import fs from 'fs';
import {
	findOperatorName,
	getBeaconFromPath,
	isBeaconLog,
	findBeaconLineType,
	findHostNameFromMetadataLine,
} from '../shared/regex';

import { Beacon, BeaconLineType, Host, Server } from '@redeye/models';
import type { LoggerInstance } from '../shared/logging';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

type BeaconData = {
	hosts: string[];
	operators: string[];
};

type ServerData = {
	beacons: Record<string, BeaconData>;
	files: number;
	path: string;
	server: Server;
};

// Parsed objects is from a host perspective
export type ParsedObjects = Record<UUID, ServerData>;

const quickParseFile = (filePath: string, beaconData: BeaconData) => {
	return new Promise<void>((resolve) => {
		const readInterface = createInterface({
			input: fs.createReadStream(filePath),
		});
		readInterface.on('line', (line) => {
			const beaconLineType = findBeaconLineType(line);
			if (beaconLineType === BeaconLineType.INPUT) {
				const redTeamMember = findOperatorName(line);
				if (redTeamMember) beaconData.operators.push(redTeamMember);
			}
			if (beaconLineType === BeaconLineType.METADATA) {
				const hostName = findHostNameFromMetadataLine(line);
				if (hostName) beaconData.hosts.push(hostName);
			}
		});

		readInterface.on('close', () => {
			resolve();
		});
	});
};

const quickParseFolder = (data: ServerData, logger: LoggerInstance): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		const promises: Promise<void>[] = [];
		try {
			const watcher = watch(data.path, {
				ignored: /(^|[/\\])\../, // ignore dotfiles
				persistent: false,
			});

			watcher.on('add', (path: string) => {
				data.files++;
				if (isBeaconLog(path)) {
					const beaconName = getBeaconFromPath(path);
					if (beaconName) {
						if (!data.beacons[beaconName]) {
							data.beacons[beaconName] = { hosts: [], operators: [] };
						}
						const beaconData = data.beacons[beaconName];
						promises.push(quickParseFile(path, beaconData));
					}
				}
			});
			watcher.on('ready', () => {
				Promise.all(promises).then(() => {
					resolve();
				});
			});
		} catch (e) {
			logger('rejected', { level: 'error', tags: ['quickParseFolder', 'identifyEntities.service'], error: e });
			reject();
		}
	});
};

type Arguments = {
	orm: MikroORM<BetterSqliteDriver>;
	logger: LoggerInstance;
};

export const entitiesIdentify = ({ orm, logger }: Arguments): Promise<ParsedObjects> => {
	return new Promise<ParsedObjects>((resolve, reject) => {
		try {
			const em = orm.em.fork();
			em.find(Server, {}, { populate: false }).then((servers) => {
				const fauxEntities = servers.flatMap((server: Server) => {
					const host = new Host({
						id: server.name,
						cobaltStrikeServer: true,
						hostName: server.name,
					});

					const beacon = new Beacon({
						id: server.name + '-faux-beacon',
						host,
						beaconName: server.name,
						server,
					});

					return [em.nativeInsert(host), em.nativeInsert(beacon)];
				});

				const parsedObject = servers.reduce<ParsedObjects>((acc, current) => {
					acc[current.id] = { beacons: {}, files: 0, path: current.parsingPath, server: current };
					return acc;
				}, {});
				const parsingPromises = Object.values(parsedObject).map((serverData) => quickParseFolder(serverData, logger));

				Promise.allSettled([...parsingPromises, ...fauxEntities]).then(() => {
					Object.values(parsedObject).forEach((serverData) => {
						Object.values(serverData.beacons).forEach((beacon) => {
							beacon.hosts = Array.from(new Set(beacon.hosts));
							beacon.operators = Array.from(new Set(beacon.operators));
						});
					});

					// setTimeout(() => {
					resolve(parsedObject);
					// }, 2000);
				});
			});
		} catch (e) {
			logger('ERROR', { tags: ['identifyService'], error: e });
			reject();
		}
	});
};

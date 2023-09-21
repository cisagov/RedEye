import 'reflect-metadata';

import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { defineConfig } from '@mikro-orm/better-sqlite';
import { BeaconTasks } from '../sliver-entities/BeaconTasks';
import { Beacons } from '../sliver-entities/Beacons';
import type {
	ParserBeacon,
	ParserHost,
	ParserServer,
	ParserOutput,
	ParserOperator,
	ParserCommand,
	ParserLink,
} from '@redeye/parser-core';
import { Hosts } from '../sliver-entities/Hosts';
import { Operators } from '../sliver-entities/Operators';
import { parseLog } from './parse-log';
import { readdir } from 'fs-extra';
import { join, resolve } from 'node:path';

export async function connectToSliverDb(dbName: string) {
	return MikroORM.init(
		defineConfig({
			discovery: {
				// we need to disable validation for no entities
				warnWhenNoEntities: false,
			},
			metadataProvider: ReflectMetadataProvider,
			entities: [Beacons, Hosts, Operators, BeaconTasks],
			allowGlobalContext: true,
			dbName,
		})
	);
}

export async function parseSliverFiles(rootDir: string): Promise<ParserOutput> {
	const dbPath = resolve(rootDir, 'sliver.db');
	const orm = await connectToSliverDb(dbPath);
	const beaconNames = await orm.em.find(Beacons, {});
	let { links, commands }: Awaited<ReturnType<typeof parseLog>> = { links: [], commands: {} };
	for (const file of await findLogFiles(rootDir)) {
		const parsed = await parseLog(file, beaconNames, []);
		links = [...links, ...parsed.links];
		commands = { ...commands, ...parsed.commands };
	}
	const { beacons, beaconsByHost } = await parseBeacons(orm);
	const hosts = await parseHosts(orm, beaconsByHost);
	const servers = await parseServers(orm);
	const operators = await parseOperators(orm);
	await orm.close(true);

	return {
		commands: Object.entries(commands).reduce((acc, [key, value]) => {
			Object.entries(value).forEach(([key2, value2]) => {
				acc[`${key}-${key2}`] = value2;
			});
			return acc;
		}, {} as Record<string, ParserCommand>),
		beacons: arrayToObject(beacons),
		hosts: arrayToObject(hosts),
		servers: arrayToObject(servers),
		operators: arrayToObject(operators),
		links: links.reduce((acc, link) => {
			acc[`${link.from}-${link.to}`] = link;
			return acc;
		}, {} as Record<string, ParserLink>),
	};
}

async function parseOperators(orm: MikroORM<BetterSqliteDriver>): Promise<ParserOperator[]> {
	const operators = await orm.em.find(Operators, {});
	return operators.map((operator): ParserOperator => {
		const { createdAt, name } = operator;
		return {
			name: name!,
			startTime: createdAt!,
		};
	});
}

async function parseBeacons(
	orm: MikroORM<BetterSqliteDriver>
): Promise<{ beacons: ParserBeacon[]; beaconsByHost: Record<string, { ip: string; server?: string }[]> }> {
	const beacons = await orm.em.find(Beacons, {});
	const beaconsByHost: Record<string, { ip: string; server?: string }[]> = {};
	const parserBeacons = beacons.map((beacon): ParserBeacon => {
		const { name, remoteAddress, createdAt, lastCheckin, transport, activeC2, filename, pId, hostname } = beacon;
		const [ip, port] = remoteAddress!.split(':');
		if (hostname && !beaconsByHost[hostname]) {
			beaconsByHost[hostname!] = [];
		}
		if (hostname) {
			beaconsByHost[hostname].push({ ip, server: activeC2 });
		}
		return {
			name: name!,
			ip,
			port: parseInt(port, 10),
			process: filename!,
			startTime: createdAt,
			endTime: lastCheckin,
			processId: pId!,
			type: transport!.replaceAll('(', '').replaceAll(')', '') as any,
			server: activeC2!,
			host: hostname!,
		};
	});
	return { beacons: parserBeacons, beaconsByHost };
}

async function parseHosts(
	orm: MikroORM<BetterSqliteDriver>,
	beaconsByHost: Record<string, { ip: string; server?: string }[]>
): Promise<ParserHost[]> {
	const hosts = await orm.em.find(Hosts, {});
	return hosts.map((host): ParserHost => {
		const { hostname, osVersion } = host;
		return {
			name: hostname!,
			osVersion,
			ip: beaconsByHost[hostname!][0].ip,
			server: beaconsByHost[hostname!][0]!.server!,
		};
	});
}

async function parseServers(orm: MikroORM<BetterSqliteDriver>): Promise<ParserServer[]> {
	const beacons = await orm.em.find(Beacons, {});
	const servers: Record<string, ParserServer> = {};
	for (const server of beacons) {
		const { activeC2, transport } = server;
		const [c2, type] = [activeC2, transport!.replaceAll('(', '').replaceAll(')', '') as any];
		if (!servers[`${c2}-${type}`]) {
			servers[`${c2}-${type}`] = {
				name: c2!,
				type,
			};
		}
	}
	return Object.values(servers);
}

async function findLogFiles(dir: string, logFiles: string[] = []) {
	for (const file of await readdir(dir, { withFileTypes: true })) {
		if (file.isDirectory()) {
			await findLogFiles(join(dir, file.name), logFiles);
		} else if (file.name.endsWith('.log') && file.name.startsWith('json_')) {
			logFiles.push(join(dir, file.name));
		}
	}
	return logFiles;
}

function arrayToObject<T extends { name: string }>(array: T[]): Record<string, T> {
	const obj: Record<string, T> = {};
	for (const item of array) {
		obj[item.name] = item;
	}
	return obj;
}

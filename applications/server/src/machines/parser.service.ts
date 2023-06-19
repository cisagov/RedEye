import {
	Annotation,
	Beacon,
	BeaconMeta,
	BeaconType,
	Command,
	CommandGroup,
	GenerationType,
	getProjectMikroOrmConfig,
	Host,
	HostMeta,
	Link,
	LogEntry,
	mitreTechniques,
	MitreTechniques,
	MultiParsingPath,
	Operator,
	Server,
	ServerMeta,
} from '@redeye/models';
import * as readline from 'node:readline';
import path from 'path';
import { getRuntimeDir } from '../util';
import {
	createLoggerInstance,
	ParserInfo,
	ParserMessageTypes,
	ParserOutput,
	getParserPrefixAndMessage,
} from '@redeye/parser-core';
import { exec, execFile, ChildProcess } from 'child_process';
import { EndpointContext, EntityManager } from '../types';
import { MikroORM } from '@mikro-orm/core';

export const invokeParser = <T>(parserName: string, args: string[], loggingFolderPath?: string) =>
	new Promise<T>((resolve, reject) => {
		try {
			const logger = loggingFolderPath ? createLoggerInstance(loggingFolderPath) : undefined;
			let parserProcess: ChildProcess | undefined;
			if (process.pkg) {
				const baseCommand = path.resolve(getRuntimeDir(), 'parsers', parserName);
				parserProcess = execFile(baseCommand, args);
			} else {
				parserProcess = exec(`${parserName} ${args.join(' ')}`);
			}

			parserProcess.stderr?.on('data', (d) => {
				console.error('ERROR: stderr', { parserName, d });
				reject(d);
			});

			const rl = readline.createInterface({ input: parserProcess.stdout } as any);
			rl.on('line', (data) => {
				if (typeof data === 'string') {
					const [prefix, message] = getParserPrefixAndMessage(data);
					if (prefix === ParserMessageTypes.Data) {
						resolve(JSON.parse(message));
					} else if (prefix === ParserMessageTypes.Progress) {
						console.debug({ parserName, prefix, message }); // TODO: Update campaign progress
					} else if (prefix === ParserMessageTypes.Log) {
						if (logger) {
							logger(JSON.parse(message));
						} else {
							console.log({ parserName, message });
						}
					} else if (prefix === ParserMessageTypes.Debug) {
						console.debug({ parserName, message });
					} else {
						console.debug({ parserName, data });
					}
				} else {
					console.debug('ERROR: invalid stdout', { parserName, data });
				}
			});

			parserProcess.on('close', () => {
				rl.close();
			});
		} catch (error) {
			console.debug('ERROR: throw in exec', error);
			reject(error);
		}
	});

export async function parserService({
	projectDatabasePath,
	parserName,
	parsingPaths,
}: {
	projectDatabasePath: string;
	parserName: string;
	parsingPaths: string | MultiParsingPath[];
}) {
	const orm = await MikroORM.init(getProjectMikroOrmConfig(projectDatabasePath));
	const em = orm.em.fork();
	if (Array.isArray(parsingPaths)) {
		for (const parsingPath of parsingPaths) {
			await parsePath(em, parsingPath.path, parserName);
		}
	} else {
		await parsePath(em, parsingPaths, parserName);
	}
}

async function parsePath(em: EntityManager, path: string, parserName: string) {
	const created: {
		servers: Record<string, Server>;
		hosts: Record<string, Host>;
		beacons: Record<string, Beacon>;
		operators: Record<string, Operator>;
	} = {
		servers: {},
		hosts: {},
		beacons: {},
		operators: {},
	};
	const data = await invokeParser<ParserOutput>(parserName, ['parse-campaign', `-f`, path]);
	if (data.servers) {
		for (const parsedServer of Object.values(data.servers)) {
			created.servers[parsedServer.name] =
				(await em.findOne(Server, { name: parsedServer.name })) ||
				new Server({
					name: parsedServer.name,
					parsingPath: path,
				});
			created.hosts[parsedServer.name] = new Host({ hostName: parsedServer.name, cobaltStrikeServer: true });
			created.beacons[parsedServer.name] = new Beacon({
				beaconName: parsedServer.name,
				host: created.hosts[parsedServer.name],
				server: created.servers[parsedServer.name],
			});
			const serverMeta = created.servers[parsedServer.name].meta ?? new ServerMeta(created.servers[parsedServer.name]);
			serverMeta.type = parsedServer.type ?? serverMeta.type;
			created.servers[parsedServer.name].meta = serverMeta;
			em.persist([
				created.servers[parsedServer.name],
				created.hosts[parsedServer.name],
				created.beacons[parsedServer.name],
				serverMeta,
			]);
		}
	}
	if (data.hosts) {
		for (const host of Object.values(data.hosts)) {
			created.hosts[host.name] = new Host({ hostName: host.name, cobaltStrikeServer: false });
			const hostMeta = new HostMeta({
				host: created.hosts[host.name],
				ip: host.ip,
				os: host.os,
				osVersion: host.osVersion,
				type: host.type,
			});
			created.hosts[host.name].meta.add(hostMeta);
			await em.persist([created.hosts[host.name], hostMeta]);
		}
	}
	if (data.beacons) {
		for (const beacon of Object.values(data.beacons)) {
			created.beacons[beacon.name] = new Beacon({
				id: beacon.host + '-' + beacon.name,
				beaconName: beacon.name,
				server: created.servers[beacon.server],
				host: created.hosts[beacon.host],
			});
			const beaconMeta = new BeaconMeta({
				beacon: created.beacons[beacon.name],
				port: beacon.port,
				process: beacon.process,
				pid: beacon.processId,
				startTime: beacon.startTime,
				endTime: beacon.endTime,
				type: beacon.type || BeaconType.HTTP,
			});
			created.beacons[beacon.name].meta.add(beaconMeta);
			await em.persist([created.beacons[beacon.name], beaconMeta]);
		}
	}

	if (data.operators) {
		for (const operator of Object.values(data.operators)) {
			created.operators[operator.name] = new Operator({ id: operator.name });
			em.persist(created.operators[operator.name]);
		}
	}

	if (data.links) {
		for (const link of Object.values(data.links)) {
			const fromBeaconMeta = created.beacons[link.from]?.meta?.getItems().at(0);
			const toBeaconMeta = created.beacons[link.to]?.meta?.getItems().at(0);
			const newLink = new Link({
				origin: created.beacons[link.from],
				destination: created.beacons[link.to],
				manual: false,
				startTime: fromBeaconMeta?.startTime,
				endTime: toBeaconMeta?.endTime,
			});
			await em.persist(newLink);
		}
	}

	if (data.commands) {
		for (const command of Object.values(data.commands)) {
			let operator = command.operator ? created.operators[command.operator] : undefined;
			if (!operator && command.operator) {
				operator = created.operators[command.operator] = new Operator({ id: command.operator });
				em.persist(created.operators[command.operator]);
			}
			if (operator && command.input.dateTime) {
				operator.startTime = compareDates(command.input.dateTime, operator.startTime);
				operator.endTime = compareDates(command.input.dateTime, operator.endTime, true);
			}
			const beacon = created.beacons[command.beacon];
			operator?.beacons.add(beacon);
			const newCommand = new Command({
				operator,
				beacon,
				attackIds: command.attackIds,
				inputText: command.input.blob,
				input: new LogEntry({ ...command.input, beacon, blob: command.input.blob || '' }),
				output: [],
			});
			if (command.output) {
				const newOutput = new LogEntry({
					...command.output,
					beacon,
					blob: command.output.blob || '',
					command: newCommand,
				});
				em.persist(newOutput);
				newCommand.output.add(newOutput);
			}
			if (newCommand.attackIds) {
				await createTechniqueComment(em, newCommand.attackIds, newCommand);
			}
			await em.persist(newCommand);
		}
	}
	await em.flush();
}

async function createTechniqueComment(em: EntityManager, attackIds: string[], command: Command) {
	const mitreTechnique = new Set<MitreTechniques>();
	attackIds?.forEach((attackId: string) => {
		Object.entries(mitreTechniques).forEach(([technique, attackIds]: [string, string[]]) => {
			if (attackIds.some((atkId: string) => attackId.startsWith(atkId))) {
				mitreTechnique.add(technique as MitreTechniques);
			}
		});
	});

	if (mitreTechnique.size) {
		const commandGroup = new CommandGroup({
			commands: command,
			id: command.id + '-group',
			generation: GenerationType.PROCEDURAL,
		});
		const annotation = await Annotation.createAnnotation(em, command.inputText || '', '', {
			favorite: false,
			generation: GenerationType.PROCEDURAL,
			tags: Array.from(mitreTechnique.values()),
			commandGroup,
		});
		em.persist([commandGroup, annotation]);
		command.commandGroups.add(commandGroup);
	}
}

const compareDates = (newDate: Date, date?: Date, max?: boolean) => {
	if (max) {
		return !date || newDate > date ? newDate : date;
	} else {
		return !date || newDate < date ? newDate : date;
	}
};

export async function getParserInfo(parserName: string): Promise<ParserInfo> {
	return await invokeParser<ParserInfo>(parserName, ['info']);
}

export async function parserInfo(parsers: string[] | undefined): Promise<EndpointContext['parserInfo']> {
	if (!parsers) return {};
	return Object.fromEntries(await Promise.all(parsers.map(async (parser) => [parser, await getParserInfo(parser)])));
}

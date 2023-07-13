import {
	Beacon,
	getProjectMikroOrmConfig,
	LogEntry,
	Server,
	Host,
	Image,
	CommandGroup,
	LogType,
	BeaconMeta,
	HostMeta,
} from '@redeye/models';
import type { EntityName } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import { parentPort, workerData } from 'worker_threads';
import type { EntityManager } from '../../types';
import type { AnonymizationMachineContext } from './anonymization.machine';
import { replaceHashes, replaceDomainsAndIps, replacePasswords, replaceBlobValues } from './replace-regex';
import { getRandomReplacement, setIfNewProperty } from './anonymization-utils';

async function findAndReplaceHostnames(
	em: EntityManager,
	hostNames: Record<string, string>,
	ips: Record<string, string>
) {
	const hosts = await em.find(Host, {});
	for (const host of hosts) {
		hostNames[host.hostName] = `anonymized-host-${getRandomReplacement(4)}`;
		await em.nativeUpdate(Host, { id: host.id }, { hostName: hostNames[host.hostName] });
	}

	const hostMetadata = await em.find(HostMeta, {});
	for (const hostMeta of hostMetadata) {
		if (hostMeta.ip) {
			setIfNewProperty(ips, hostMeta.ip, `anonymized-ip-${getRandomReplacement(4)}`);
			await em.nativeUpdate(HostMeta, { id: hostMeta.id }, { ip: ips[hostMeta.ip] });
		}
	}
}

async function findAndReplaceUsernames(
	em: EntityManager,
	userNames: Record<string, string>,
	ips: Record<string, string>
) {
	const beaconMetadata = await em.find(BeaconMeta, {});
	for (const beaconMeta of beaconMetadata) {
		if (beaconMeta.username) {
			setIfNewProperty(userNames, beaconMeta.username, `anonymized-user-${getRandomReplacement(4)}`);

			// Get IPs from meta
			const ipUpdates = {} as { ip: string; origin: string };
			if (beaconMeta.ip) {
				setIfNewProperty(ips, beaconMeta.ip, `anonymized-ip-${getRandomReplacement(4)}`);
				ipUpdates.ip = ips[beaconMeta.ip];
			}
			if (beaconMeta.origin) {
				setIfNewProperty(ips, beaconMeta.origin, `anonymized-ip-${getRandomReplacement(4)}`);
				ipUpdates.origin = ips[beaconMeta.origin];
			}

			await em.nativeUpdate(
				BeaconMeta,
				{ id: beaconMeta.id },
				{ username: userNames[beaconMeta.username], ...ipUpdates }
			);
		}
	}
}

async function replaceValuesInLogEntries(em: EntityManager, options: Omit<AnonymizationMachineContext, 'database'>) {
	const userNames: Record<string, string> = {};
	const hostNames: Record<string, string> = {};
	const domainIpsMatchedStrings: Record<string, string> = {};
	if (options.replaceUsernames) {
		await findAndReplaceUsernames(em, userNames, domainIpsMatchedStrings);
	}
	if (options.replaceHostnames) {
		await findAndReplaceHostnames(em, hostNames, domainIpsMatchedStrings);
	}

	const logEntries = await em.find(LogEntry, {});
	const hashMatchedStrings = {};

	for (const logEntry of logEntries) {
		if (options.removePasswordsHashes) {
			logEntry.blob = replaceHashes(logEntry.blob, hashMatchedStrings);
			logEntry.blob = replacePasswords(logEntry.blob, hashMatchedStrings);
		}

		if (options.replaceDomainsAndIps) {
			logEntry.blob = replaceDomainsAndIps(logEntry.blob, domainIpsMatchedStrings);
		}

		if (options.replaceHostnames) {
			logEntry.blob = replaceBlobValues(logEntry.blob, hostNames);
		}

		if (options.replaceUsernames) {
			logEntry.blob = replaceBlobValues(logEntry.blob, userNames);
		}

		if (options.findReplace?.length) {
			for (const { find, replace } of options.findReplace) {
				logEntry.blob = logEntry.blob.replace(find, replace);
			}
		}
	}

	await em.flush();
}

async function removeHidden(em: EntityManager) {
	const findHiddenAndRemove = async (entity: EntityName<any>) => {
		const forkedEm = em.fork();
		const items = await forkedEm.fork().find(entity, { hidden: true });
		if (items.length) {
			await forkedEm.fork().remove(items).flush();
		}
	};
	await findHiddenAndRemove(Server);
	await findHiddenAndRemove(Host);
	await findHiddenAndRemove(Beacon);
}

async function removeKeystrokes(em: EntityManager) {
	const logs = await em.find(LogEntry, { logType: LogType.KEYSTROKES });
	await em.remove(logs.map((log) => log.command!).filter(Boolean)).flush();
	await em.remove(logs).flush();
}

async function removeScreenshots(em: EntityManager) {
	const images = await em.find(Image, {});
	await em.remove(images).flush();
}

parentPort?.on('message', async () => {
	const { database, ...options } = workerData as AnonymizationMachineContext;
	const orm = await MikroORM.init(getProjectMikroOrmConfig(database));
	const em = orm.em.fork();

	const timeLabel = `Anonymization for ${database}`;
	console.time(timeLabel);
	console.log('Starting', timeLabel);

	if (options.removeHidden) await removeHidden(em.fork());
	if (options.removeKeystrokes) await removeKeystrokes(em.fork());
	if (options.removeScreenshots) await removeScreenshots(em.fork());
	await replaceValuesInLogEntries(em.fork(), options);

	// Remove all command groups
	const commandGroups = await em.find(CommandGroup, {}, { populate: ['commands'] });
	for (const commandGroup of commandGroups) {
		if (commandGroup.commands.length === 0) {
			await em.remove(commandGroup).flush();
		}
	}
	console.timeEnd(timeLabel);

	await em.flush();
	// Collapse database files into one and close
	await orm.em.getDriver().execute('PRAGMA wal_checkpoint');
	await orm.close();
	parentPort?.postMessage({});
});

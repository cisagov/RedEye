import { HostMeta, LogEntry, BeaconLineType, Host, Beacon, BeaconMeta, Link } from '@redeye/models';
import { ParsingOrchestratorMachineContext } from './parsingOrchestrator.machine';
import { getBeaconFromPath } from '../shared/beaconRegex';
import { isIpAddress } from '../shared/regex';

type HostMapping = Record<
	string,
	{
		hosts: Host[];
		hostIds: string[];
	}
>;
const createIpToHostMapping = (metadata: HostMeta[]) =>
	metadata.reduce<HostMapping>((acc, current) => {
		if (current.ip) {
			if (acc[current.ip]) {
				acc[current.ip].hosts.push(current.host);
				acc[current.ip].hostIds.push(current.host.id);
			} else
				acc[current.ip] = {
					hosts: [current.host],
					hostIds: [current.host.id],
				};
		}
		return acc;
	}, {});

const filterImpossibleBeacons = (linkEvidence: BeaconMeta, host: Host): Beacon[] => {
	const destinationBeacon = linkEvidence.beacon;
	const beacons = host.beacons.getItems();
	return beacons.filter((originBeacon) => {
		const originMeta = originBeacon.meta[0];
		if (!originMeta) return false;
		// Beacon won't link back to itself
		if (originBeacon.id === destinationBeacon?.id) return false;
		// origin won't have started after destination starts
		if (originMeta.startTime && linkEvidence.startTime && originMeta.startTime > linkEvidence.startTime) return false;
		// origin won't have ended before destination starts
		if (originMeta.endTime && linkEvidence.startTime && originMeta.endTime < linkEvidence.startTime) return false;
		return true;
	});
};

const findBestGuessOrigin = (
	linkEvidence: BeaconMeta,
	host: Host,
	originEvidences: LogEntry[],
	jumpInputs: LogEntry[]
) => {
	const possibleBeacons = filterImpossibleBeacons(linkEvidence, host);
	if (possibleBeacons.length === 0) return undefined;
	if (possibleBeacons.length === 1) return possibleBeacons[0];

	// Everything after this point is untested

	const options = possibleBeacons.map((filteredBeacon) => {
		const matchedOptions = originEvidences.filter((origin) => origin.beacon?.id === filteredBeacon.id);
		const matchedJumpOptions = jumpInputs.filter((origin) => origin.beacon?.id === filteredBeacon.id);
		return { matchedOptions, matchedJumpOptions };
	});

	const filteredOptions = options.filter(
		({ matchedJumpOptions, matchedOptions }) => !(matchedJumpOptions.length === 0 && matchedOptions.length === 0)
	);

	if (filteredOptions.length === 1) {
		if (filteredOptions[0].matchedJumpOptions.length) {
			const foundCommand = filteredOptions[0].matchedJumpOptions[0];
			return foundCommand.beacon;
		} else {
			const foundLog = filteredOptions[0].matchedOptions[0];
			return foundLog.beacon;
		}
	}

	return undefined;
};

const findOrigin = (
	linkEvidence: BeaconMeta,
	originEvidences: LogEntry[],
	jumpInputs: LogEntry[],
	beacons: Beacon[],
	serverBeacons: Beacon[],
	mapping: HostMapping
): Beacon | undefined => {
	const { origin } = linkEvidence;

	if (origin) {
		// Find the beacon
		if (origin.includes('beacon')) {
			const beaconName = getBeaconFromPath(origin);
			if (beaconName) {
				return beacons.find(
					(beacon) => beacon.beaconName === beaconName && beacon.serverId === linkEvidence.beacon.serverId
				);
			}
		} else if (isIpAddress(origin) && mapping[origin]) {
			const hostMappingValue = mapping[origin];
			if (hostMappingValue.hosts.length === 1) {
				// This is probably not a perfect assumption but seems safe
				if (hostMappingValue.hosts[0].beacons.length === 0) return hostMappingValue.hosts[0].beacons[0];
			} else {
				const bestGuessOrigin = findBestGuessOrigin(linkEvidence, hostMappingValue.hosts[0], originEvidences, jumpInputs);
				if (bestGuessOrigin) return bestGuessOrigin;
			}
		}
	}
	// This will be true 99% of the time and prevents beacons from being orphaned in the graph other times
	// Eventually we might want to have different categorization to indicate which is the case
	return serverBeacons.find((beacon) => beacon.serverId === linkEvidence.beacon.serverId);
};

export const linksParser = (ctx: ParsingOrchestratorMachineContext) => {
	return new Promise<void>((resolve, _reject) => {
		const em = ctx.orm.em.fork();
		const hostMetadataPromise = em.find(HostMeta, {}, { populate: true });
		const serverBeaconPromises = em.find(
			Beacon,
			{
				host: {
					cobaltStrikeServer: { $eq: true },
				},
			},
			{ populate: false }
		);
		const nonCsBeaconPromises = em.find(
			Beacon,
			{
				host: {
					cobaltStrikeServer: { $eq: false },
				},
			},
			{ populate: false }
		);
		const beaconMetadataPromise = em.find(BeaconMeta, {}, { populate: false });
		const basicOriginPromise = em.find(
			LogEntry,
			{ blob: { $like: '%established link to child beacon%' } },
			{ populate: ['beacon', 'beacon.host', 'command'] }
		);
		const jumpInputPromises = em.find(LogEntry, {
			lineType: { $eq: BeaconLineType.INPUT },
			blob: { $like: '% jump %' },
		});

		Promise.all([
			hostMetadataPromise,
			beaconMetadataPromise,
			basicOriginPromise,
			jumpInputPromises,
			serverBeaconPromises,
			nonCsBeaconPromises,
		]).then(([hostMetadata, beaconMetaArray, basicOrigins, jumpInputs, serverBeacons, beacons]) => {
			const mapping = createIpToHostMapping(hostMetadata);

			const linkPromises = beaconMetaArray.map((linkEvidence) => {
				const origin = findOrigin(linkEvidence, basicOrigins, jumpInputs, beacons, serverBeacons, mapping);

				const link = new Link({
					startTime: linkEvidence.startTime,
					endTime: linkEvidence.endTime, // this is likely frequently wrong since a beacon can be reconnected but we'll address that in future
					origin,
					destination: linkEvidence.beacon,
				});
				return em.nativeInsert(link);
			});

			Promise.all(linkPromises).then(() => {
				resolve();
			});
		});
	});
};

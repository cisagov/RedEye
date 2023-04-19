import { Beacon, Host, Link, Server } from '@redeye/models';
import type { EntityManager } from '../../types';
import { Field, ObjectType } from 'type-graphql';

export const ensureTreeHidden = async (
	em: EntityManager,
	id: string,
	hidden: boolean,
	beaconsToHide: string[]
): Promise<void> => {
	const links = await em.find(Link, { origin: { id } });
	for (const link of links) {
		const destinationBeacon = link.destination;
		if (destinationBeacon) {
			const destinationLinks = await em.find(Link, { destination: { id: destinationBeacon.id } });
			if (destinationLinks.every((l) => l.origin?.hidden === hidden || beaconsToHide.includes(l.origin?.id || ''))) {
				await em.nativeUpdate(Beacon, { id: destinationBeacon.id }, { hidden });
				await ensureTreeHidden(em, destinationBeacon.id, hidden, beaconsToHide);
			}
		}
	}
	const originBeacon = await em.findOneOrFail(Beacon, { id });
	if (originBeacon?.host) {
		const hostCount = await em.fork().count(Beacon, { host: originBeacon?.host, hidden: false });
		await em.nativeUpdate(Host, { id: originBeacon?.host?.id }, { hidden: !hostCount });
	}
};

export const findTree = async (
	em: EntityManager,
	id: string,
	beaconsToHide: string[],
	beaconsThatWillBeHidden: string[],
	hiddenHosts: Record<string, { beaconIds: string[]; hiddenBeaconIds: string[] }>,
	beaconsCount: number
): Promise<string | void> => {
	const links = await em.find(Link, { origin: { id } });
	for (const link of links) {
		const destinationBeacon = link.destination;
		if (destinationBeacon) {
			const destinationLinks = await em.find(Link, { destination: { id: destinationBeacon?.id } });
			if (destinationLinks.every((l) => l.origin?.hidden === false || beaconsToHide.includes(l.origin?.id || ''))) {
				const finalBeaconId = await findTree(
					em,
					destinationBeacon.id,
					beaconsToHide,
					beaconsThatWillBeHidden,
					hiddenHosts,
					beaconsCount
				);
				if (finalBeaconId) return finalBeaconId;
			}
		}
	}
	beaconsThatWillBeHidden.push(id);
	const originBeacon = links.at(0)?.origin;
	if (originBeacon?.host?.id) {
		if (!(originBeacon.host.id in hiddenHosts)) {
			hiddenHosts[originBeacon.host.id] = {
				beaconIds: originBeacon.host.beacons.getIdentifiers(),
				hiddenBeaconIds: [],
			};
		}
		hiddenHosts[originBeacon.host.id].hiddenBeaconIds.push(originBeacon.id);
	}

	if (beaconsThatWillBeHidden.length === beaconsCount) {
		return id;
	}
};

@ObjectType()
export class NonHidableEntities {
	constructor(args: Partial<NonHidableEntities> = {}) {
		Object.assign(this, args);
	}

	@Field(() => [String], { nullable: true })
	servers: string[] = [];

	@Field(() => [String], { nullable: true })
	hosts: string[] = [];

	@Field(() => [String], { nullable: true })
	beacons: string[] = [];
}

export const getNonHidableEntities = async ({
	em,
	hostsToHide = [],
	beaconsToHide = [],
}: {
	em: EntityManager;
	beaconsToHide?: string[];
	hostsToHide?: string[];
}) => {
	const beaconsCount = beaconsToHide?.length
		? await em.count(Beacon, { hidden: false, host: { cobaltStrikeServer: false } })
		: 0;
	const cantHideBeacons: string[] = [];
	const hiddenHosts: Record<string, { beaconIds: string[]; hiddenBeaconIds: string[] }> = {};
	const beaconsThatWillBeHidden: string[] = [];
	for await (const beacon of beaconsToHide) {
		await findTree(em, beacon, beaconsToHide, beaconsThatWillBeHidden, hiddenHosts, beaconsCount);

		if (beaconsThatWillBeHidden.length >= beaconsCount) {
			cantHideBeacons.push(beacon);
		}
		const hiddenHostsEntries = Object.entries(hiddenHosts);
		if (
			hiddenHostsEntries.length &&
			hiddenHostsEntries.every(([, host]) => host.beaconIds.length === host.hiddenBeaconIds.length)
		) {
			cantHideBeacons.push(beacon);
		}
	}

	const hosts = hostsToHide?.length
		? await em.find(Host, { id: hostsToHide, cobaltStrikeServer: false }, { populate: true })
		: [];
	const notHiddenHosts = await em.find(Host, { hidden: false, beacons: { hidden: false }, cobaltStrikeServer: false });
	const canHideHosts: string[] = [];
	const cantHideHosts = hosts.filter((host) => {
		if (checkCanHide(notHiddenHosts, canHideHosts)) {
			canHideHosts.push(host.id);
			return false;
		}
		return true;
	});

	const servers = hostsToHide?.length ? await em.find(Server, { id: hostsToHide }, { populate: true }) : [];
	const notHiddenServers = await em.find(Host, { hidden: false, beacons: { hidden: false }, cobaltStrikeServer: true });

	const canHideServers: string[] = [];

	const cantHideServers = servers.filter((server) => {
		if (checkCanHide(notHiddenServers, canHideServers)) {
			canHideServers.push(server.id);
			return false;
		}
		return true;
	});

	return {
		cantHideServers: cantHideServers.map((host) => host.id),
		cantHideBeacons: cantHideBeacons,
		cantHideHosts: cantHideHosts.map((host) => host.id),
	};
};

export const checkCanHide = (entities: (Host | Beacon | Server | string)[], hiddenHostIds: string[]) =>
	(entities.length > 1 && hiddenHostIds.length - 1 !== entities.length) || entities.length !== 1;

export const defaultHidden = (hidden?: boolean) => (!hidden ? { hidden } : {});
export const beaconHidden = (hidden?: boolean) => (!hidden ? { beacon: { hidden } } : {});

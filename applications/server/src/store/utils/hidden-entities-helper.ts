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
			const destinationLinks = await em.find(Link, { destination: { id: destinationBeacon?.id } });
			if (destinationLinks.every((l) => l.origin?.hidden === hidden || beaconsToHide.includes(l.origin?.id || ''))) {
				await em.nativeUpdate(Beacon, { id: destinationBeacon.id }, { hidden });
				await ensureTreeHidden(em, destinationBeacon.id, hidden, beaconsToHide);
			}
		}
	}
};

@ObjectType()
export class CantHideEntities {
	constructor(args: Partial<CantHideEntities> = {}) {
		Object.assign(this, args);
	}

	@Field(() => [String], { nullable: true })
	servers: string[] = [];

	@Field(() => [String], { nullable: true })
	hosts: string[] = [];

	@Field(() => [String], { nullable: true })
	beacons: string[] = [];
}

export const checkCanHideEntities = async ({
	em,
	hostsToHide = [],
	beaconsToHide = [],
}: {
	em: EntityManager;
	beaconsToHide?: string[];
	hostsToHide?: string[];
}) => {
	const beacons = beaconsToHide?.length
		? await em.find(Beacon, { id: beaconsToHide }, { populate: ['host', 'host.beacons'] })
		: [];
	const hosts = hostsToHide?.length
		? await em.find(Host, { id: hostsToHide, cobaltStrikeServer: false }, { populate: true })
		: [];
	const servers = hostsToHide?.length ? await em.find(Server, { id: hostsToHide }, { populate: true }) : [];
	const notHiddenHosts = await em.find(Host, { hidden: false, cobaltStrikeServer: false });
	const notHiddenServers = await em.find(Host, { hidden: false, cobaltStrikeServer: true });
	const canHideBeacons: string[] = [];
	const canHideHosts: string[] = [];
	const canHideServers: string[] = [];

	const cantHideBeacons = beacons.filter((beacon) => {
		const beaconHost = beacon.host!;
		const hostBeaconsNotHidden = beaconHost.beacons.getItems().filter((beacon) => !beacon.hidden);
		if (checkCanHide(hostBeaconsNotHidden, canHideBeacons)) {
			canHideBeacons.push(beacon.id);
			return false;
		}
		return true;
	});

	const cantHideHosts = hosts.filter((host) => {
		if (checkCanHide(notHiddenHosts, canHideHosts)) {
			canHideHosts.push(host.id);
			return false;
		}
		return true;
	});

	const cantHideServers = servers.filter((server) => {
		if (checkCanHide(notHiddenServers, canHideServers)) {
			canHideServers.push(server.id);
			return false;
		}
		return true;
	});

	return {
		cantHideServers: cantHideServers.map((host) => host.id),
		cantHideBeacons: cantHideBeacons.map((beacon) => beacon.id),
		cantHideHosts: cantHideHosts.map((host) => host.id),
	};
};

export const checkCanHide = (entities: (Host | Beacon | Server | string)[], hiddenHostIds: string[]) =>
	(entities.length > 1 && hiddenHostIds.length - 1 !== entities.length) || entities.length !== 1;

export const defaultHidden = (hidden?: boolean) => (!hidden ? { hidden } : {});
export const beaconHidden = (hidden?: boolean) => (!hidden ? { beacon: { hidden } } : {});

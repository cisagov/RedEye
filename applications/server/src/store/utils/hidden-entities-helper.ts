import { Beacon, Link } from '@redeye/models';
import type { EntityManager } from '../../types';

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

export const defaultHidden = (hidden?: boolean) => (!hidden ? { hidden } : {});
export const beaconHidden = (hidden?: boolean) => (!hidden ? { beacon: { hidden } } : {});

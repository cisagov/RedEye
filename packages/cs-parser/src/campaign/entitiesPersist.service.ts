import { Beacon, Host, Operator } from '@redeye/models';
import type { AnyEntity, EntityData, MikroORM } from '@mikro-orm/core';
import type { SqlEntityManager, BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { ParsedObjects } from './entitiesIdentify.service';
import type { RequiredLogParsingRelationships } from './parsingOrchestrator.machine';

type HostRecord = { [hostId: UUID]: Host };
type OperatorRecord = { [operatorName: string]: Operator };

const findAllUniqueHosts = async (
	em: SqlEntityManager<BetterSqliteDriver>,
	parsedObject: ParsedObjects
): Promise<HostRecord> => {
	// hostName, Host
	const hosts: HostRecord = {};
	const allPromises: Promise<string>[] = [];

	Object.values(parsedObject).forEach((serverData) => {
		Object.values(serverData.beacons).forEach((beaconData) => {
			beaconData.hosts.forEach((hostName) => {
				if (!hosts[hostName]) {
					const newHost = new Host({ id: hostName, hostName });
					hosts[hostName] = newHost;
					allPromises.push(em.nativeInsert(newHost));
				}
			});
		});
	});
	if (allPromises.length) await Promise.allSettled(allPromises);

	return hosts;
};

const findAllUniqueOperators = async (
	em: SqlEntityManager<BetterSqliteDriver>,
	parsedObject: ParsedObjects
): Promise<OperatorRecord> => {
	// operatorName, Operator
	const operators: OperatorRecord = {};
	const allPromises: Promise<string>[] = [];

	Object.values(parsedObject).forEach((serverData) => {
		Object.values(serverData.beacons).forEach((beaconData) => {
			beaconData.operators.forEach((operatorName) => {
				if (!operators[operatorName]) {
					const newOperator = new Operator({ id: operatorName });
					operators[operatorName] = newOperator;
					allPromises.push(em.nativeInsert(newOperator));
				}
			});
		});
	});
	await Promise.allSettled(allPromises);
	return operators;
};

const insertBeaconOperators =
	(em: SqlEntityManager<BetterSqliteDriver>, beaconId: string, operatorId: string) => () => {
		return em
			.getDriver()
			.execute(`INSERT INTO beacon_operators (beacon_id, operator_id) VALUES (?, ?)`, [beaconId, operatorId]);
	};

const findAllUniqueBeacons = async (
	em: SqlEntityManager<BetterSqliteDriver>,
	parsedObject: ParsedObjects,
	hosts: HostRecord
): Promise<RequiredLogParsingRelationships[]> => {
	const allPromises: Promise<string>[] = [];
	const logParsingData: RequiredLogParsingRelationships[] = [];
	const operatorPromises: (() => Promise<EntityData<AnyEntity>>)[] = [];

	Object.values(parsedObject).forEach((serverData) => {
		const serverLogParsingData: RequiredLogParsingRelationships = { serverPath: serverData.path, beacons: [] };
		Object.entries(serverData.beacons).forEach(([beaconName, beaconData]) => {
			const hostName = beaconData.hosts[0];
			const host = hosts[hostName];
			const newBeacon = new Beacon({ id: hostName + '-' + beaconName, beaconName, host, server: serverData.server });
			serverLogParsingData.beacons.push(newBeacon);
			const beaconPromise = em.nativeInsert(newBeacon);
			beaconData.operators.forEach((operator) => operatorPromises.push(insertBeaconOperators(em, newBeacon.id, operator)));

			allPromises.push(beaconPromise);
		});
		logParsingData.push(serverLogParsingData);
	});
	await Promise.allSettled(allPromises);
	await Promise.allSettled(operatorPromises.map((promise) => promise()));
	return logParsingData;
};

type Arguments = {
	orm: MikroORM<BetterSqliteDriver>;
	parsedObjects: ParsedObjects;
};
export const entitiesPersist = ({ parsedObjects, orm }: Arguments): Promise<RequiredLogParsingRelationships[]> => {
	return new Promise<RequiredLogParsingRelationships[]>(async (resolve, reject) => {
		const parsedObject = parsedObjects;
		if (!parsedObject) {
			reject([]);
		} else {
			const em = orm.em.fork();
			const hosts = await findAllUniqueHosts(em, parsedObject);
			await findAllUniqueOperators(em, parsedObject);
			const relationships = await findAllUniqueBeacons(em, parsedObject, hosts);
			resolve(relationships);
			resolve([]);
		}
	});
};

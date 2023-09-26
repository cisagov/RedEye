// import { load } from "protobufjs";
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { BeaconTasks } from '../../sliver-entities/BeaconTasks';

const convertMessage = async (mess: any, type: string) => {
	const files: any = {}; // await load(`sliver.proto`);

	try {
		const Client = files.lookupType(`sliverpb.${type}`);
		const message = Client.decode(mess);
		return Client.toObject(message, {
			defaults: true, // includes default values
			arrays: true, // populates empty arrays (repeated fields) even if defaults=false
			objects: true, // populates empty objects (map fields) even if defaults=false
			oneofs: true, // includes virtual oneof fields set to the present field's name
			// see ConversionOptions
		});
	} catch (e) {
		return {};
	}
};

type InputOutput = { input: Record<string, any>; output: Record<string, any> };

export async function parseTasks(orm: MikroORM<BetterSqliteDriver>): Promise<Record<string, InputOutput>> {
	const beaconTasks = await orm.em.find(BeaconTasks, {});
	const parserTasks: Record<string, InputOutput> = {};
	for (const beaconTask of beaconTasks) {
		if (beaconTask.description) {
			const input = await convertMessage(
				(
					await convertMessage(beaconTask.request, 'Envelope')
				).Data,
				beaconTask.description
			);
			const output = await convertMessage(beaconTask.response, beaconTask.description.replace('Req', ''));
			parserTasks[beaconTask.id!] = { input, output };
		}
	}

	return parserTasks;
}

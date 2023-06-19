import { Beacon, Image } from '@redeye/models';
import { readFileSync } from 'fs';
import { getBeaconFromScreenShotName } from './regex';
import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import type { LoggerInstance } from '../shared/logging';

type PersistImagesArgument = {
	orm: MikroORM<BetterSqliteDriver>;
	imagePaths: string[];
	beacons: Beacon[];
	timestamps: bigint[];
	logger: LoggerInstance;
};

export const persistImages = (ctx: PersistImagesArgument): Promise<void> => {
	return new Promise<void>((resolve) => {
		const promises = ctx.imagePaths.map((imagePath) => {
			return new Promise<void>((resolve) => {
				const em = ctx.orm.em.fork();
				const beaconName = getBeaconFromScreenShotName(imagePath);

				const beacon = ctx.beacons.find((beacon) => beacon.beaconName === beaconName);

				const image = new Image({
					fileType: 'jpg',
					beacon,
					blob: readFileSync(imagePath),
				});

				em.nativeInsert(image).then(() => {
					resolve();
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		});
	});
};

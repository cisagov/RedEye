import path from 'path';
import { DatabaseMode } from './config';
import fs from 'fs-extra';

export const getRuntimeDir = () => {
	if (process.pkg) {
		return path.resolve(process.execPath, '..');
	} else {
		return path.join(__dirname, '..');
	}
};

export const withTempDir = async <T>(fn: (dir: string) => T) => {
	const dir = await fs.mkdtemp(getRuntimeDir() + path.sep);
	try {
		return await fn(dir);
	} finally {
		setTimeout(() => {
			try {
				fs.rm(dir, { recursive: true, force: true });
			} catch (e) {
				console.log('Error deleting temp directory', e);
			}
		}, 5000);
	}
};

export function getRootPath(): string {
	return path.join(getRuntimeDir());
}

export const getDbPath = (databaseMode: DatabaseMode): string => {
	const saveDb = databaseMode !== DatabaseMode.PRODUCTION;
	return saveDb ? path.join(getRootPath(), 'dev-databases') : getRootPath();
};

export const getDatabaseFolderPath = (campaignId: string, databaseMode: DatabaseMode): string =>
	path.resolve(getDbPath(databaseMode), 'campaign', campaignId);

export const getFullCampaignDbPath = (campaignId: string, databaseMode: DatabaseMode): string =>
	path.resolve(getDatabaseFolderPath(campaignId, databaseMode), 'db.redeye');

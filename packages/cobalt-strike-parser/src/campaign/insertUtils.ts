import type { SqlEntityManager, BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { LogEntry } from '@redeye/models';

const MAX_BULK_INSERT_SIZE = 500;
export const bulkInsertLogEntries = async (em: SqlEntityManager<BetterSqliteDriver>, entries: LogEntry[]) => {
	if (entries.length > MAX_BULK_INSERT_SIZE) {
		for (let index = 0; index < entries.length / MAX_BULK_INSERT_SIZE; index++) {
			const qb = em.createQueryBuilder(LogEntry, 'g', 'write');
			const start = index * MAX_BULK_INSERT_SIZE;
			const end =
				(index + 1) * MAX_BULK_INSERT_SIZE > entries.length ? entries.length : (index + 1) * MAX_BULK_INSERT_SIZE;
			const subset = entries.slice(start, end);
			qb.insert(subset);
			await qb.execute('run');
		}
	} else {
		const qb = em.createQueryBuilder(LogEntry, 'g', 'write');
		qb.insert(entries);
		await qb.execute('run');
	}
};

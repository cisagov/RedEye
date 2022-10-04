import type { MikroORM } from '@mikro-orm/core';
import type { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

type SharedContext = {
	orm?: MikroORM<BetterSqliteDriver>;
};
export const closeOrm = <TContext extends SharedContext>(ctx: TContext) => {
	return new Promise<void>((resolve, reject) => {
		setTimeout(async () => {
			// someday just closing may be fine https://github.com/mikro-orm/mikro-orm/discussions/2590

			try {
				await ctx.orm?.close();
				resolve();
			} catch {
				reject();
			}
		}, 200);
	});
};

import type { Collection } from '@mikro-orm/core';

export const initThen = async <Model extends Collection<any>, T>(model: Model, callback?: () => T | Promise<T>) => {
	if (!model?.isInitialized()) await model?.init({ populate: false });
	return callback?.();
};

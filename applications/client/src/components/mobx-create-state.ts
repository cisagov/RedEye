import type { AnnotationsMap } from 'mobx';
import { runInAction } from 'mobx';
import { useLocalObservable as mbxLocalObservable } from 'mobx-react-lite';

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type ReadonlyKeys<T> = {
	[P in keyof T]-?: IfEquals<
		{
			[Q in P]: T[P];
		},
		{
			-readonly [Q in P]: T[P];
		},
		never,
		P
	>;
}[keyof T];

export type UseCreateState<T, ReadOnly extends ReadonlyKeys<T> = ReadonlyKeys<T>> = Pick<T, ReadOnly> &
	Immutable<Omit<T, ReadOnly>> & {
		update: <K extends keyof T>(...input: [K, T[K]] | [(update: T) => void]) => void;
	};

export type Immutable<Obj> = {
	+readonly [K in keyof Obj]: Obj[K];
};

export const createState = <T extends object>(init: T, annotations?: AnnotationsMap<T, never>): UseCreateState<T> => {
	const state = mbxLocalObservable(() => {
		// eslint-disable-next-line guard-for-in
		for (const key in init) {
			const descriptor = Reflect.getOwnPropertyDescriptor(init, key);
			if (!descriptor?.get && typeof init[key] === 'function') {
				// @ts-ignore
				init[key].bind(init);
			}
		}
		return Object.assign(init, {
			update(name, value) {
				runInAction(() => {
					if (typeof value === 'function') value(this);
					else this[name as any] = value;
				});
			},
		});
	}, annotations);

	return state as unknown as UseCreateState<T>;
};

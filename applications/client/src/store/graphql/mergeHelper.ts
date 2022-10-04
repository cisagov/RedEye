/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { toJS } from 'mobx';
import { applySnapshot, detach, findParent, getSnapshot, model, Model, modelAction } from 'mobx-keystone';
import { RootStore } from './RootStore';
import { rootRefs } from './RootStore.base';

@model('MergeHelper')
export class MergeHelper extends Model({}) {
	@modelAction mergeAll(data: any, del: boolean) {
		const store = findParent<any>(this, (n) => n instanceof RootStore);
		const items = this.merge(toJS(data), false, 0, store);
		if (del) {
			const key = Object.keys(items)[0];
			const parsedItems = items[key];
			const item = parsedItems[0];
			let storeKey = key;
			if (item) {
				const { __typename } = item;
				storeKey = store.getCollectionName(__typename);
			}
			Array.from(store[storeKey].values()).forEach((d: any) => {
				const ind = parsedItems.findIndex((it: any) => it.id === d.id);
				if (ind < 0) {
					try {
						detach(d);
					} catch (e) {
						console.debug(e);
					}
				}
			});
		}
		return items;
	}

	@modelAction merge(data: any, del: boolean, level: number, store: any): any {
		if (!data || typeof data !== 'object') return data;
		if (Array.isArray(data)) {
			const items: any[] = [];
			for (const d of data) {
				try {
					items.push(this.merge(d, del, level + 1, store));
				} catch (e) {
					console.error(e);
				}
			}
			return items;
		}
		let { __typename, id } = data;

		// convert values deeply first to mobx-keystone objects as much as possible
		let snapshot: any;
		const typeDef = store.getTypeDef(__typename);
		if (id && __typename) {
			snapshot = store[store.getCollectionName(__typename)]?.get(String(id));
			if (!snapshot) {
				snapshot = new typeDef(data);
				store[store.getCollectionName(__typename)]?.set(String(id), snapshot);
			} else {
				try {
					applySnapshot(snapshot, merge(getSnapshot(snapshot), data));
				} catch (e) {
					//
				}
			}
		} else if (__typename) {
			snapshot = new typeDef(data);
			store[store.getCollectionName(__typename)]?.set('', snapshot);
		}
		if (!snapshot) snapshot = {};
		for (const key in data) {
			if (data[key]?.id && data[key]?.__typename) {
				try {
					const item = this.merge(data[key], del, level + 1, store);
					if (level > 0) {
						try {
							snapshot[key] = rootRefs[store.getCollectionName(data[key]?.__typename)](
								store[store.getCollectionName(data[key]?.__typename)]?.get(String(data[key]?.id)) ?? item
							);
						} catch (e) {
							snapshot[key] = item;
						}
					} else {
						snapshot[key] = item;
					}
				} catch (e) {
					console.debug(e);
				}
			} else {
				const item = this.merge(data[key], del, level + 1, store);
				if (Array.isArray(item)) {
					snapshot[key] = item.map((d) =>
						d?.id && d?.__typename && level > 0 ? rootRefs[store.getCollectionName(d?.__typename)](d) : d
					);
				} else {
					snapshot[key] = item;
				}
			}
		}
		return snapshot;
	}
}

function merge(a, b) {
	return Object.entries(b).reduce((o, [k, v]) => {
		o[k] =
			v && typeof v === 'object'
				? merge((o[k] = o[k] || (Array.isArray(v) ? [] : {})), v)
				: v instanceof Date
				? v.valueOf()
				: v
				? v
				: o[k];
		return o;
	}, a);
}

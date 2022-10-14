import { getRootStore, model, Model } from 'mobx-keystone';
import type { AppStore } from '../app-store';

@model('RedEyeModel')
export class RedEyeModel extends Model({}) {
	protected onInit() {
		super.onInit?.();
	}

	get appStore(): AppStore | undefined {
		return getRootStore<AppStore>(this);
	}
}

import type { AnyModel } from 'mobx-keystone';
import { getRootStore, standaloneAction } from 'mobx-keystone';
import type { Moment } from 'moment-timezone';
import type { AppStore } from '../app-store';

export const getMinMaxTime = standaloneAction(
	'getMinMaxTime',
	<T extends AnyModel & { minTime?: Moment; maxTime?: Moment }>(object: T, time: string | undefined) => {
		if (time) {
			const store = getRootStore<AppStore>(object);
			const currentTime = store!.settings.momentTz(time);
			if (object) {
				if (!object?.minTime?.isValid() || store!.settings.momentTz(object?.minTime)?.isAfter(currentTime))
					object.minTime = currentTime;
				else if (!object?.maxTime?.isValid() || store!.settings.momentTz(object?.maxTime)?.isBefore(currentTime))
					object.maxTime = currentTime;
			}
		}
	}
);

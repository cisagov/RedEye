import { computed } from 'mobx';
import { Model, model, modelAction, prop } from 'mobx-keystone';
import { computedFn } from 'mobx-utils';
import type { Moment, MomentInput } from 'moment-timezone';
import moment from 'moment-timezone';

export const defaultTimeZone = moment.tz.guess();

@model('Settings')
export class Settings extends Model({
	showHidden: prop<boolean>(window.localStorage.getItem('showHidden') === 'true'),
	timezone: prop<string>(window.localStorage.getItem('timezone') || defaultTimeZone),
}) {
	@modelAction setShowHidden(showHidden: boolean) {
		this.showHidden = showHidden;
		window.localStorage.setItem('showHidden', showHidden.toString());
	}
	@modelAction setTimezone(tz: string) {
		this.timezone = tz;
		window.localStorage.setItem('timezone', tz);
	}
	@modelAction setDefaultTimezone() {
		this.setTimezone(defaultTimeZone);
	}
	@computed get isDefaultTimezone() {
		return this.timezone === defaultTimeZone;
	}
	momentTz = computedFn((d: MomentInput | Moment) => moment(d).tz(this.timezone));
}

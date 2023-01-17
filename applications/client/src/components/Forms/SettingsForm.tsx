import { Classes, Switch } from '@blueprintjs/core';
import { TimezoneSelect } from '@blueprintjs/datetime2';
import { css } from '@emotion/react';
import { SortDirection, useStore } from '@redeye/client/store';
import { sortOptions } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps } from 'react';
import { CampaignViews, Tabs } from '../../types';
import { createState } from '../mobx-create-state';

type SettingsFormProps = ComponentProps<'form'> & {};

export const SettingsForm = observer<SettingsFormProps>(({ ...props }) => {
	const store = useStore();
	const state = createState({
		// theme: getAppTheme(),
		tester: { value: 3 },
		enableAutoSelect: store.settings.isDefaultTimezone,
		setEnableAutoSelect(e: ChangeEvent<HTMLInputElement>) {
			this.enableAutoSelect = e.target.checked;
			return e.target.checked && store.settings.setDefaultTimezone();
		},
	});

	return (
		<form {...props}>
			<span>Timezone</span>
			<Switch
				inline
				alignIndicator="right"
				checked={state.enableAutoSelect}
				onChange={state.setEnableAutoSelect}
				label="AutoSelect"
				css={switchStyle}
			/>
			<TimezoneSelect
				css={timezonePickerStyle}
				buttonProps={{ fill: true, alignText: 'left' }}
				disabled={state.enableAutoSelect}
				value={store.settings.timezone}
				// showLocalTimezone
				onChange={(timezone) => {
					store.settings.setTimezone(timezone);
				}}
			/>
			<Switch
				cy-test="show-hide-beacons"
				checked={store.settings.showHidden}
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					store.settings.setShowHidden(e.target.checked);
					store.reset(false);
					store.campaign.refetch();
					store.campaign.search.clearSearch();
					store.router.updateRoute({
						path: store.router.currentRoute,
						params: {
							id: store.campaign.id!,
							view: store.router.params.view,
							...(store.router.params.view === CampaignViews.EXPLORE
								? { currentItem: 'all', currentItemId: undefined, tab: Tabs.HOSTS }
								: {}),
						},
						queryParams:
							store.router.params.view === CampaignViews.EXPLORE
								? { sort: `${sortOptions[Tabs.HOSTS][0].key} ${SortDirection.ASC}` }
								: {},
						clear: true,
					});
				}}
				label="Show Hidden Beacons, Host, and Servers"
			/>
			<Switch
				checked={store.settings.theme === 'light'}
				onChange={(event) => {
					// console.log(event.currentTarget.checked);
					store.settings.setTheme(event.currentTarget.checked ? 'light' : 'dark');
				}}
				label="Light Theme (beta)"
			/>
		</form>
	);
});

const timezonePickerStyle = css`
	.${Classes.POPOVER_TARGET} {
		display: block;
		margin-bottom: 10px;
	}
	.${Classes.ICON} {
		float: right;
	}
`;

const switchStyle = css`
	float: right;
	margin-right: 0 !important;
`;

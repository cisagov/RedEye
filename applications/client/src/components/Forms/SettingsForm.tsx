import { Classes, FormGroup, Switch } from '@blueprintjs/core';
import { TimezoneSelect } from '@blueprintjs/datetime2';
import { css } from '@emotion/react';
import { SortDirection, useStore } from '@redeye/client/store';
import { sortOptions } from '@redeye/client/views';
import { Txt, unRedactedFontClassName } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps } from 'react';
import { CampaignViews, Tabs } from '../../types';
import { createState } from '../mobx-create-state';

type SettingsFormProps = ComponentProps<'form'> & {};

export const SettingsForm = observer<SettingsFormProps>(({ ...props }) => {
	const store = useStore();
	const state = createState({
		tester: { value: 3 },
		enableAutoSelect: store.settings.isDefaultTimezone,
		setEnableAutoSelect(e: ChangeEvent<HTMLInputElement>) {
			this.enableAutoSelect = e.target.checked;
			return e.target.checked && store.settings.setDefaultTimezone();
		},
	});

	return (
		<form css={formStyles} {...props}>
			{/* <Txt small>Timezone</Txt> */}

			<FormGroup
				label="Timezone"
				helperText={
					<Switch
						// inline
						// alignIndicator="right"
						checked={state.enableAutoSelect}
						onChange={state.setEnableAutoSelect}
						label="AutoSelect"
						css={{ marginBottom: 0 }}
					/>
				}
			>
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
			</FormGroup>
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
								? { sort: `${sortOptions()[Tabs.HOSTS][0].key} ${SortDirection.ASC}` }
								: {},
						clear: true,
					});
				}}
				label="Show Hidden Beacons, Hosts, and Servers"
			/>
			<Switch
				cy-test="toggle-theme"
				checked={store.settings.theme === 'light'}
				onChange={(event) => store.settings.setTheme(event.currentTarget.checked ? 'light' : 'dark')}
				label="Light Theme (beta)"
			/>
			<Switch
				cy-test="toggle-redacted-mode"
				checked={store.settings.redactedMode}
				onChange={(event) => store.settings.setRedactedMode(event.currentTarget.checked)}
				className={unRedactedFontClassName}
				// @ts-ignore // `label` prop actually supports JSX elements, but TypeScript will throw an error because HTMLAttributes only allows strings.
				label={
					<span>
						<Txt>Redacted Screenshot Mode</Txt>
						<br />
						<Txt small muted>
							WARNING: Beacon, Host, and Server names may still be visible in url
						</Txt>
					</span>
				}
			/>
		</form>
	);
});

const formStyles = css`
	display: flex;
	flex-direction: column;
	gap: 24px;

	& > * {
		margin: 0;
	}
`;

const timezonePickerStyle = css`
	.${Classes.POPOVER_TARGET} {
		display: block;
	}
`;

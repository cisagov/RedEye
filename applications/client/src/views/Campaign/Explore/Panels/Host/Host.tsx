import { Checkbox } from '@blueprintjs/core';
import { ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import {
	CarbonIcon,
	createState,
	dateShortFormat,
	dateShortPlaceholder,
	semanticIcons,
} from '@redeye/client/components';
import type { HostModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { InfoType, TimeStatus } from '@redeye/client/types';
import { IconLabel, InfoRow, RowTime, RowTitle, ToggleHiddenDialog, useToggleHidden } from '@redeye/client/views';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useCallback, useMemo } from 'react';
import { QuickMetaPopoverButtonMenu, ShowHideMenuItem } from '../QuickMeta';

type HostRowProps = ComponentProps<'div'> & {
	host: HostModel;
};

export const HostRow = observer<HostRowProps>(({ host, ...props }) => {
	const store = useStore();
	const state = createState({
		cantHideEntities: false,
		isDialogDisabled: window.localStorage.getItem('disableDialog') === 'true',
		AddServer(serverId: string, hidden: boolean) {
			const selectedServers = store.campaign?.hostGroupSelect.selectedServers.slice();
			const hiddenCount = store.campaign?.hostGroupSelect.hiddenCount;
			selectedServers.push(serverId);
			store.campaign?.setHostGroupSelect({
				...store.campaign?.hostGroupSelect,
				selectedServers,
				hiddenCount: hiddenCount + (hidden ? 1 : 0),
			});
		},
		RemoveServer(serverId: string, hidden: boolean) {
			const selectedServers = store.campaign?.hostGroupSelect.selectedServers.slice();
			const hiddenCount = store.campaign?.hostGroupSelect.hiddenCount;
			selectedServers.splice(selectedServers.indexOf(serverId), 1);
			store.campaign?.setHostGroupSelect({
				...store.campaign?.hostGroupSelect,
				selectedServers,
				hiddenCount: hiddenCount - (hidden ? 1 : 0),
			});
		},
		AddHost(hostId: string, hidden: boolean) {
			const selectedHosts = store.campaign?.hostGroupSelect.selectedHosts.slice();
			const hiddenCount = store.campaign?.hostGroupSelect.hiddenCount;
			selectedHosts.push(hostId);
			store.campaign?.setHostGroupSelect({
				...store.campaign?.hostGroupSelect,
				selectedHosts,
				hiddenCount: hiddenCount + (hidden ? 1 : 0),
			});
		},
		RemoveHost(hostId: string, hidden: boolean) {
			const selectedHosts = store.campaign?.hostGroupSelect.selectedHosts.slice();
			const hiddenCount = store.campaign?.hostGroupSelect.hiddenCount;
			selectedHosts.splice(selectedHosts.indexOf(hostId), 1);
			store.campaign?.setHostGroupSelect({
				...store.campaign?.hostGroupSelect,
				selectedHosts,
				hiddenCount: hiddenCount - (hidden ? 1 : 0),
			});
		},
	});

	if (!host) return null;

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(async () =>
		host.cobaltStrikeServer
			? await store.graphqlStore.mutateToggleServerHidden({
					campaignId: store.campaign?.id!,
					serverId: host?.serverId!,
			  })
			: await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

	const indeterminate = useMemo(
		() =>
			store.campaign.bulkSelectCantHideEntityIds.includes(
				!!host?.serverId && host?.cobaltStrikeServer ? host?.serverId : host?.id
			),
		[store.campaign.bulkSelectCantHideEntityIds]
	);

	const checked = useMemo(
		() =>
			(!!host?.id &&
				!!host?.serverId &&
				host?.cobaltStrikeServer &&
				store.campaign?.hostGroupSelect.selectedServers?.includes(host?.serverId)) ||
			(!!host?.id && !host?.cobaltStrikeServer && store.campaign?.hostGroupSelect.selectedHosts?.includes(host?.id)),
		[store.campaign?.hostGroupSelect.selectedServers, store.campaign?.hostGroupSelect.selectedHosts]
	);

	const handleCheck = useCallback(
		async (e) => {
			const cantHideEntityIds = store.campaign.bulkSelectCantHideEntityIds.filter(
				(id) => id !== (host?.cobaltStrikeServer ? host?.serverId : host?.id)
			);
			store.campaign.setBulkSelectCantHideEntityIds(cantHideEntityIds);
			// @ts-ignore
			return e.target.checked && host?.id
				? host?.cobaltStrikeServer
					? state.AddServer(host?.serverId || '', !!host?.hidden)
					: state.AddHost(host?.id || '', !!host?.hidden)
				: host?.cobaltStrikeServer
				? state.RemoveServer(host?.serverId || '', !!host?.hidden)
				: state.RemoveHost(host?.id || '', !!host?.hidden);
		},
		[host]
	);

	const handleQuickMetaClick = useCallback(async () => {
		const data = await store.graphqlStore.queryNonHidableEntities({
			campaignId: store.campaign.id!,
			hostIds: [(host.cobaltStrikeServer ? host?.serverId : host?.id) || ''],
		});
		const cantHideEntities =
			((host?.cobaltStrikeServer ? data?.nonHidableEntities.servers?.length : data?.nonHidableEntities.hosts?.length) ||
				0) > 0;

		const isDialogDisabled =
			(window.localStorage.getItem('disableDialog') === 'true' &&
				(!cantHideEntities || (cantHideEntities && host?.hidden))) ||
			false;
		state.update('cantHideEntities', cantHideEntities);
		state.update('isDialogDisabled', isDialogDisabled);

		return isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true);
	}, [host]);

	return (
		<InfoRow
			onClick={() => (!toggleHidden.showHide && !store.campaign?.hostGroupSelect.groupSelect ? host.select() : null)}
			onMouseEnter={() => store.campaign?.interactionState.onHover(host.hierarchy)}
			{...props}
		>
			{store.campaign?.hostGroupSelect.groupSelect && (
				<Checkbox
					checked={checked}
					onClick={handleCheck}
					indeterminate={indeterminate}
					css={css`
						margin-bottom: 0;
					`}
				/>
			)}
			<RowTime state={host.minTime && host.minTime ? host.state : TimeStatus.FUTURE}>
				{host.minTime ? store.settings.momentTz(host.minTime).format(dateShortFormat) : dateShortPlaceholder}&mdash;
				{host.maxTime ? store.settings.momentTz(host.maxTime)?.format(dateShortFormat) : dateShortPlaceholder}
			</RowTime>
			<RowTitle>
				{host.cobaltStrikeServer ? (
					<>
						<CarbonIcon icon={semanticIcons.teamServer} css={{ verticalAlign: 'sub' }} /> <Txt muted>Server:</Txt>
					</>
				) : (
					<CarbonIcon icon={semanticIcons.host} css={{ verticalAlign: 'sub' }} />
				)}{' '}
				<Txt cy-test="hostName" bold={!!host.cobaltStrikeServer}>
					{host.displayName}
				</Txt>
			</RowTitle>
			<FlexSplitter />
			{host?.hidden && <IconLabel title="Hidden" icon={ViewOff16} />}
			{!host.cobaltStrikeServer && (
				<>
					<IconLabel
						cy-test="row-command-count"
						title="Commands"
						value={host.commandsCount}
						icon={semanticIcons.commands}
					/>
					<IconLabel cy-test="row-beacon-count" value={host.beaconCount} title="Beacons" icon={semanticIcons.beacon} />
				</>
			)}
			{host != null && !store.appMeta.blueTeam && (
				<QuickMetaPopoverButtonMenu content={<ShowHideMenuItem model={host} onClick={handleQuickMetaClick} />} />
			)}
			{!state.isDialogDisabled && (
				<ToggleHiddenDialog
					typeName={host.cobaltStrikeServer ? 'server' : 'host'}
					isOpen={toggleHidden.showHide}
					infoType={host.cobaltStrikeServer ? InfoType.SERVER : InfoType.HOST}
					isHiddenToggled={!!host?.hidden}
					onClose={(e) => {
						e.stopPropagation();
						toggleHidden.update('showHide', false);
					}}
					onHide={() => mutateToggleHidden.mutate()}
					cantHideEntities={state.cantHideEntities}
				/>
			)}
		</InfoRow>
	);
});

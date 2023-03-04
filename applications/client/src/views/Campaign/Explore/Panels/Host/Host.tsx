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
import {
	IconLabel,
	InfoRow,
	RowTime,
	RowTitle,
	ToggleHiddenDialog,
	useCheckLastUnhidden,
	useToggleHidden,
} from '@redeye/client/views';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { QuickMetaPopoverButtonMenu, ShowHideMenuItem } from '../QuickMeta';

type HostRowProps = ComponentProps<'div'> & {
	host: HostModel;
};

export const HostRow = observer<HostRowProps>(({ host, ...props }) => {
	const store = useStore();
	const state = createState({
		AddHost(hostId) {
			const selectedHosts = store.campaign?.hostGroupSelect.selectedHosts.slice();
			selectedHosts.push(hostId);
			store.campaign?.setHostGroupSelect({
				groupSelect: true,
				selectedHosts,
			});
		},
		RemoveHost(hostId: string) {
			const selectedHosts = store.campaign?.hostGroupSelect.selectedHosts.slice();
			selectedHosts.splice(selectedHosts.indexOf(hostId), 1);
			store.campaign?.setHostGroupSelect({
				groupSelect: true,
				selectedHosts,
			});
		},
	});

	if (!host) return null;

	const { last, isDialogDisabled } = useCheckLastUnhidden(
		host.cobaltStrikeServer ? 'server' : 'host',
		host?.hidden || false
	);

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(async () =>
		host.cobaltStrikeServer
			? await store.graphqlStore.mutateToggleServerHidden({
					campaignId: store.campaign?.id!,
					serverId: host?.serverId!,
			  })
			: await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

	return (
		<InfoRow
			onClick={() => (!toggleHidden.showHide && !store.campaign?.hostGroupSelect.groupSelect ? host.select() : null)}
			onMouseEnter={() => store.campaign?.interactionState.onHover(host.hierarchy)}
			{...props}
		>
			{store.campaign?.hostGroupSelect.groupSelect && (
				<Checkbox
					cy-test="checkbox-select-command"
					checked={host?.id ? store.campaign?.hostGroupSelect.selectedHosts?.includes(host?.id) : false}
					onClick={(e) =>
						// @ts-ignore
						e.target.checked && host?.id ? state.AddHost(host?.id) : state.RemoveHost(host?.id!)
					}
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
			{host != null && (
				<QuickMetaPopoverButtonMenu
					content={
						<ShowHideMenuItem
							model={host}
							disabled={!!store.appMeta.blueTeam}
							onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
						/>
					}
				/>
			)}
			{!isDialogDisabled && (
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
					last={last}
				/>
			)}
		</InfoRow>
	);
});

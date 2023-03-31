import { Checkbox, Classes } from '@blueprintjs/core';
import { ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, createState, dateShortFormat, semanticIcons } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { TimeStatus } from '@redeye/client/types/timeline';
import {
	IconLabel,
	InfoRow,
	RowMuted,
	RowTime,
	RowTitle,
	ToggleHiddenDialog,
	useToggleHidden,
} from '@redeye/client/views';
import { FlexSplitter } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo, useCallback } from 'react';
import { MitreTechniqueIcons } from '../../components/MitreTechniqueIcons';
import { QuickMetaPopoverButtonMenu, ShowHideMenuItem } from '../QuickMeta';

type BeaconProps = ComponentProps<'div'> & {
	beacon: BeaconModel;
};

export const BeaconRow = observer<BeaconProps>(({ beacon, ...props }) => {
	const store = useStore();
	const state = createState({
		beaconId: '',
		cantHideEntities: false,
		isDialogDisabled: window.localStorage.getItem('disableDialog') === 'true',
		AddBeacon(beaconId) {
			const selectedBeacons = store.campaign?.beaconGroupSelect.selectedBeacons.slice();
			selectedBeacons.push(beaconId);
			store.campaign?.setBeaconGroupSelect({
				...store.campaign?.beaconGroupSelect,
				selectedBeacons,
			});
		},
		RemoveBeacon(beaconId: string) {
			const selectedBeacons = store.campaign?.beaconGroupSelect.selectedBeacons.slice();
			selectedBeacons.splice(selectedBeacons.indexOf(beaconId), 1);
			store.campaign?.setBeaconGroupSelect({
				...store.campaign?.beaconGroupSelect,
				selectedBeacons,
			});
		},
	});

	const skeletonClass = useMemo(
		() => (!(beacon.displayName || beacon.server?.displayName) ? Classes.SKELETON : ''),
		[beacon.displayName, beacon.server?.displayName]
	);

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconId: beacon?.id!,
			})
	);

	const handleClick = useCallback(async () => {
		state.update('beaconId', beacon?.id);

		const aaa = await store.graphqlStore.queryNonHideableEntities({
			campaignId: store.campaign.id!,
			beaconIds: [state.beaconId],
		});
		const cantHideEntities = (aaa?.nonHideableEntities.beacons?.length || 0) > 0;

		const isDialogDisabled =
			(window.localStorage.getItem('disableDialog') === 'true' &&
				(!cantHideEntities || (cantHideEntities && beacon?.hidden))) ||
			false;
		state.update('cantHideEntities', cantHideEntities);
		state.update('isDialogDisabled', isDialogDisabled);

		return isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true);
	}, []);

	return (
		<InfoRow
			cy-test="info-row"
			onClick={() =>
				!toggleHidden.showHide && !store.campaign?.beaconGroupSelect.groupSelect ? beacon.select() : null
			}
			onMouseEnter={() =>
				beacon.state !== TimeStatus.FUTURE && store.campaign?.interactionState.onHover(beacon?.hierarchy)
			}
			{...props}
		>
			{store.campaign?.beaconGroupSelect.groupSelect && (
				<Checkbox
					checked={beacon?.id ? store.campaign?.beaconGroupSelect.selectedBeacons?.includes(beacon?.id) : false}
					onClick={(e) =>
						// @ts-ignore
						e.target.checked && beacon?.id ? state.AddBeacon(beacon?.id) : state.RemoveBeacon(beacon?.id!)
					}
					css={css`
						margin-bottom: 0;
					`}
				/>
			)}
			<RowTime cy-test="beacon-time" state={beacon.state} className={skeletonClass}>
				{store.settings.momentTz(beacon.minTime)?.format(dateShortFormat)}&mdash;
				{store.settings.momentTz(beacon.maxTime)?.format(dateShortFormat)}
			</RowTime>
			<CarbonIcon icon={semanticIcons.beacon} />
			<RowTitle cy-test="beacon-display-name" className={skeletonClass}>
				{beacon?.displayName || `${beacon.server?.displayName}`}
			</RowTitle>
			<RowMuted cy-test="beacon-user" className={skeletonClass}>
				{beacon.meta?.[0]?.maybeCurrent?.username}
			</RowMuted>
			<FlexSplitter />
			{beacon?.hidden && <IconLabel title="Hidden" icon={ViewOff16} />}
			<MitreTechniqueIcons mitreAttackIds={beacon.mitreTechniques} />
			<IconLabel
				cy-test="row-command-count"
				title="Commands"
				value={beacon.commandsCount}
				icon={semanticIcons.commands}
				className={skeletonClass}
			/>
			{beacon != null && (
				<QuickMetaPopoverButtonMenu
					content={
						// <MenuItem2 text="Add Comment" />
						<ShowHideMenuItem model={beacon} disabled={!!store.appMeta.blueTeam} onClick={handleClick} />
					}
				/>
			)}
			{!state.isDialogDisabled && (
				<ToggleHiddenDialog
					typeName="beacon"
					isOpen={toggleHidden.showHide}
					infoType={InfoType.BEACON}
					isHiddenToggled={!!beacon?.hidden}
					onClose={(e) => {
						e.stopPropagation();
						toggleHidden.update('showHide', false);
					}}
					onHide={() => mutateToggleHidden.mutate()}
					last={state.cantHideEntities}
				/>
			)}
		</InfoRow>
	);
});

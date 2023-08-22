import { Checkbox, Classes } from '@blueprintjs/core';
import { ViewOff16 } from '@carbon/icons-react';
import { createState, dateShortFormat, semanticIcons } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { TimeStatus } from '@redeye/client/types/timeline';
import {
	IconLabel,
	InfoRow,
	NodeIcon,
	RowTime,
	RowTitle,
	ToggleHiddenDialog,
	useToggleHidden,
} from '@redeye/client/views';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useCallback, useMemo } from 'react';
import { css } from '@emotion/react';
import { MitreTechniqueIcons } from '../../components/MitreTechniqueIcons';
import { QuickMetaPopoverButtonMenu, ShowHideMenuItem } from '../QuickMeta';

type BeaconRowProps = ComponentProps<'div'> & {
	beacon: BeaconModel;
};

export const BeaconRow = observer<BeaconRowProps>(({ beacon, ...props }) => {
	const store = useStore();
	const state = createState({
		cantHideEntities: false,
		isDialogDisabled: window.localStorage.getItem('disableDialog') === 'true',
		AddBeacon(beaconId: string, hidden) {
			const selectedBeacons = store.campaign?.beaconGroupSelect.selectedBeacons.slice();
			const hiddenCount = store.campaign?.beaconGroupSelect.hiddenCount;
			selectedBeacons.push(beaconId);
			store.campaign?.setBeaconGroupSelect({
				...store.campaign?.beaconGroupSelect,
				selectedBeacons,
				hiddenCount: hiddenCount + (hidden ? 1 : 0),
			});
		},
		RemoveBeacon(beaconId: string, hidden) {
			const selectedBeacons = store.campaign?.beaconGroupSelect.selectedBeacons.slice();
			const hiddenCount = store.campaign?.beaconGroupSelect.hiddenCount;
			selectedBeacons.splice(selectedBeacons.indexOf(beaconId), 1);
			store.campaign?.setBeaconGroupSelect({
				...store.campaign?.beaconGroupSelect,
				selectedBeacons,
				hiddenCount: hiddenCount - (hidden ? 1 : 0),
			});
		},
	});

	const skeletonClass = useMemo(
		() => (!(beacon.computedName || beacon.server?.computedName) ? Classes.SKELETON : ''),
		[beacon.displayName, beacon.server?.displayName]
	);

	const indeterminate = useMemo(
		() => store.campaign.bulkSelectCantHideEntityIds.includes(beacon?.id),
		[store.campaign.bulkSelectCantHideEntityIds]
	);

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconId: beacon?.id!,
			})
	);

	const handleCheck = useCallback(
		async (e) => {
			const cantHideEntityIds = store.campaign.bulkSelectCantHideEntityIds.filter((id) => id !== beacon?.id);
			store.campaign.setBulkSelectCantHideEntityIds(cantHideEntityIds);
			// @ts-ignore
			return e.target.checked && beacon?.id
				? state.AddBeacon(beacon?.id, !!beacon?.hidden)
				: state.RemoveBeacon(beacon?.id, !!beacon?.hidden);
		},
		[beacon]
	);

	const handleQuickMetaClick = useCallback(async () => {
		const data = await store.graphqlStore.queryNonHidableEntities({
			campaignId: store.campaign.id!,
			beaconIds: [beacon?.id],
		});
		const cantHideEntities = (data?.nonHidableEntities.beacons?.length || 0) > 0;

		const isDialogDisabled =
			(window.localStorage.getItem('disableDialog') === 'true' &&
				(!cantHideEntities || (cantHideEntities && beacon?.hidden))) ||
			false;
		state.update('cantHideEntities', cantHideEntities);
		state.update('isDialogDisabled', isDialogDisabled);

		return isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true);
	}, [beacon]);

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
					indeterminate={indeterminate}
					onClick={handleCheck}
					css={css`
						margin-bottom: 0;
					`}
				/>
			)}
			<RowTime cy-test="beacon-time" state={beacon.state} className={skeletonClass}>
				{store.settings.momentTz(beacon.minTime)?.format(dateShortFormat)}&mdash;
				{store.settings.momentTz(beacon.maxTime)?.format(dateShortFormat)}
			</RowTime>
			<RowTitle className={skeletonClass}>
				<NodeIcon
					type="beacon"
					shape={beacon.meta?.[0]?.current?.shape || undefined}
					color={beacon.meta?.[0]?.current?.color || undefined}
				/>
				<Txt cy-test="beacon-display-name" normal>
					{beacon?.computedName || `${beacon.server?.computedName}`}
				</Txt>
			</RowTitle>
			<FlexSplitter />
			{beacon?.hidden && <IconLabel cy-test="hidden" title="Hidden" icon={ViewOff16} />}
			<MitreTechniqueIcons mitreAttackIds={beacon.mitreTechniques} />
			<IconLabel
				cy-test="row-command-count"
				title="Commands"
				value={beacon.commandsCount}
				icon={semanticIcons.commands}
				className={skeletonClass}
			/>
			{beacon != null && !store.appMeta.blueTeam && (
				<QuickMetaPopoverButtonMenu
					content={
						// <MenuItem2 text="Add Comment" />
						<ShowHideMenuItem model={beacon} onClick={handleQuickMetaClick} />
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
					cantHideEntities={state.cantHideEntities}
				/>
			)}
		</InfoRow>
	);
});

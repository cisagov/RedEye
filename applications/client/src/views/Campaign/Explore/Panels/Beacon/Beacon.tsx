import { Classes } from '@blueprintjs/core';
import { ViewOff16 } from '@carbon/icons-react';
import { dateShortFormat, NodeIcon, semanticIcons } from '@redeye/client/components';
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
	useCheckLastUnhidden,
	useToggleHidden,
} from '@redeye/client/views';
import { FlexSplitter } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { MitreTechniqueIcons } from '../../components/MitreTechniqueIcons';
import { QuickMetaPopoverButtonMenu, ShowHideMenuItem } from '../QuickMeta';

type BeaconProps = ComponentProps<'div'> & {
	beacon: BeaconModel;
};

export const BeaconRow = observer<BeaconProps>(({ beacon, ...props }) => {
	const store = useStore();
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

	const { last, isDialogDisabled } = useCheckLastUnhidden('beacon', beacon?.hidden || false);

	return (
		<InfoRow
			cy-test="info-row"
			onClick={() => (!toggleHidden.showHide ? beacon.select() : null)}
			onMouseEnter={() =>
				beacon.state !== TimeStatus.FUTURE && store.campaign?.interactionState.onHover(beacon?.hierarchy)
			}
			{...props}
		>
			<RowTime cy-test="beacon-time" state={beacon.state} className={skeletonClass}>
				{store.settings.momentTz(beacon.minTime)?.format(dateShortFormat)}&mdash;
				{store.settings.momentTz(beacon.maxTime)?.format(dateShortFormat)}
			</RowTime>
			<NodeIcon shape="circle" />
			{/* 
			<NodeIcon shape='triangleUp' />
			<NodeIcon shape='triangleDown' />
			<NodeIcon shape='diamond' />
			<NodeIcon shape='square' />
			<NodeIcon shape='pentagonUp' />
			<NodeIcon shape='pentagonDown' />
			<NodeIcon shape='HexagonUp' />
			<NodeIcon shape='HexagonDown' /> 
			<CarbonIcon icon={semanticIcons.beacon} />
			*/}
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
						<ShowHideMenuItem
							model={beacon}
							disabled={!!store.appMeta.blueTeam}
							onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
						/>
					}
				/>
			)}
			{!isDialogDisabled && (
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
					last={last}
				/>
			)}
		</InfoRow>
	);
});

import { Classes } from '@blueprintjs/core';
import { dateShortFormat, semanticIcons } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types/timeline';
import { IconLabel, InfoRow, RowMuted, RowTime, RowTitle, useToggleHidden } from '@redeye/client/views';
import { FlexSplitter } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { MitreTechniqueIcons } from '../../components/MitreTechniqueIcons';
import { QuickMeta } from '../QuickMeta';

type BeaconProps = ComponentProps<'div'> & {
	beacon: BeaconModel;
};

export const BeaconRow = observer<BeaconProps>(({ beacon, ...props }) => {
	const store = useStore();
	const skeletonClass = useMemo(
		() => (!(beacon.displayName || beacon.server?.displayName) ? Classes.SKELETON : ''),
		[beacon.displayName, beacon.server?.displayName]
	);

	const [, mutateToggleHidden] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconId: beacon?.id!,
			})
	);
	return (
		<InfoRow
			cy-test="info-row"
			onClick={() => beacon.select()}
			onMouseEnter={() =>
				beacon.state !== TimeStatus.FUTURE && store.campaign?.interactionState.onHover(beacon?.hierarchy)
			}
			{...props}
		>
			<RowTime cy-test="beacon-time" state={beacon.state} className={skeletonClass}>
				{store.settings.momentTz(beacon.minTime)?.format(dateShortFormat)}&mdash;
				{store.settings.momentTz(beacon.maxTime)?.format(dateShortFormat)}
			</RowTime>
			<RowTitle className={skeletonClass}>{beacon?.displayName || `${beacon.server?.displayName}`}</RowTitle>
			<RowMuted className={skeletonClass}>{beacon.meta?.[0]?.maybeCurrent?.username}</RowMuted>
			<FlexSplitter />
			<MitreTechniqueIcons mitreAttackIds={beacon.mitreTechniques} />
			<IconLabel
				cy-test="row-command-count"
				title="Commands"
				value={beacon.commandsCount}
				icon={semanticIcons.commands}
				className={skeletonClass}
			/>
			<QuickMeta modal={beacon} mutateToggleHidden={mutateToggleHidden} />
		</InfoRow>
	);
});

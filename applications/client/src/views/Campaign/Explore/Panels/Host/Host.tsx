import { CarbonIcon, dateShortFormat, dateShortPlaceholder, semanticIcons } from '@redeye/client/components';
import type { HostModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types';
import { IconLabel, InfoRow, RowTime, RowTitle } from '@redeye/client/views';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HostRowProps = ComponentProps<'div'> & {
	host: HostModel;
};

export const HostRow = observer<HostRowProps>(({ host, ...props }) => {
	const store = useStore();

	if (!host) return null;
	return (
		<InfoRow
			onClick={() => host.select()}
			onMouseEnter={() => store.campaign?.interactionState.onHover(host.hierarchy)}
			{...props}
		>
			<RowTime state={host.minTime && host.minTime ? host.state : TimeStatus.FUTURE}>
				{host.minTime ? store.settings.momentTz(host.minTime).format(dateShortFormat) : dateShortPlaceholder}&mdash;
				{host.maxTime ? store.settings.momentTz(host.maxTime)?.format(dateShortFormat) : dateShortPlaceholder}
			</RowTime>
			<RowTitle>
				{host.cobaltStrikeServer && (
					<>
						<CarbonIcon icon={semanticIcons.teamServer} css={{ verticalAlign: 'sub' }} />
						<Txt muted> Server: </Txt>
					</>
				)}
				<Txt cy-test="hostName" bold={!!host.cobaltStrikeServer}>
					{host.displayName}
				</Txt>
			</RowTitle>
			<FlexSplitter />
			{!host.cobaltStrikeServer && (
				<>
					<IconLabel cy-test="row-command-count" title="Commands" value={host.commandsCount} icon={semanticIcons.commands} />
					<IconLabel value={host.beaconCount} title="Beacons" icon={semanticIcons.beacon} />
				</>
			)}
		</InfoRow>
	);
});

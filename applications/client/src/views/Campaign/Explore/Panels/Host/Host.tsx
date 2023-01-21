import { Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { OverflowMenuVertical16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, dateShortFormat, dateShortPlaceholder, semanticIcons } from '@redeye/client/components';
import type { HostModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types';
import { IconLabel, InfoRow, RowTime, RowTitle, useToggleHidden } from '@redeye/client/views';
import { CoreTokens, FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HostRowProps = ComponentProps<'div'> & {
	host: HostModel;
};

export const HostRow = observer<HostRowProps>(({ host, ...props }) => {
	const store = useStore();

	if (!host) return null;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () => await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

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
					<IconLabel cy-test="row-beacon-count" value={host.beaconCount} title="Beacons" icon={semanticIcons.beacon} />
					<Popover2
						position={Position.RIGHT}
						openOnTargetFocus={false}
						interactionKind="hover"
						hoverOpenDelay={300}
						modifiers={{
							offset: {
								enabled: true,
								options: {
									offset: [0, 30],
								},
							},
						}}
						content={
							<Menu>
								<MenuItem
									text={`${host?.hidden ? 'Show' : 'Hide'} Host`}
									icon={<CarbonIcon icon={host?.hidden ? View16 : ViewOff16} css={iconStyle(!!host?.hidden)} />}
									onClick={(e) => {
										e.stopPropagation();
										mutateToggleHidden.mutate();
									}}
								/>
							</Menu>
						}
					>
						<CarbonIcon icon={OverflowMenuVertical16} css={[iconStyle(), hoverStyle]} />
					</Popover2>
				</>
			)}
		</InfoRow>
	);
});

const iconStyle = (show?: boolean) => css`
	margin: 0;
	color: ${show ? CoreTokens.TextBody : CoreTokens.TextDisabled} !important;
`;

const hoverStyle = css`
	:hover {
		color: ${CoreTokens.TextBody} !important;
	}
`;

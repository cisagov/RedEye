import { css } from '@emotion/react';
import { dateFormat, dateTimeFormat, Flex } from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { CampaignViews, Tabs } from '@redeye/client/types';
import type { UUID } from '@redeye/client/types';
import { Txt, FlexSplitter, Tokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import type { IBar } from './TimelineChart';

type BarLabelsProps = ComponentProps<'div'> & {
	bar: IBar;
	dateFormatter: string | undefined;
};

export const BarLabelDate = observer<BarLabelsProps>(({ bar, dateFormatter }) => {
	const store = useStore();
	const dateStart = store.settings.momentTz(bar?.start).format(dateFormatter);
	const dateEnd = store.settings.momentTz(bar?.end).format(dateFormatter);
	const sameDate = dateStart.split(' ')[0] === dateEnd.split(' ')[0];

	return sameDate && dateFormatter === dateFormat ? (
		<Txt block bold small>
			{dateStart}
		</Txt>
	) : sameDate && dateFormatter === dateTimeFormat ? (
		<Txt cy-test="timeline-tooltip-date-time" block bold small>{`${dateStart} - ${dateEnd.split(' ')[1]}`}</Txt>
	) : (
		<Txt block bold small>{`${dateStart} - ${dateEnd}`}</Txt>
	);
});

export const BarLabelOnHover = observer<BarLabelsProps>(({ bar, dateFormatter }) => (
	<div cy-test="timeline-tooltip-static" css={barPopoverStyles}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<Flex css={{ 'padding-top': '0.2rem' }}>
			<Txt cy-test="timeline-beacons" muted small css={marginStyles(1)}>
				Beacons
			</Txt>
			<FlexSplitter />
			<Txt cy-test="timeline-beacon-count" small>
				{bar?.beaconNumbers}
			</Txt>
		</Flex>
		<Flex>
			<Txt cy-test="timeline-total-commands" muted small css={marginStyles(1)}>
				Total commands
			</Txt>
			<FlexSplitter />
			<Txt cy-test="timeline-total-command-count" small>
				{bar?.beaconCount}
			</Txt>
		</Flex>
		<Flex>
			<Txt cy-test="timeline-active-beacons" muted small css={marginStyles(1)}>
				Active Beacon commands
			</Txt>
			<FlexSplitter />
			<Txt cy-test="timeline-active-beacon-count" small>
				{bar?.activeBeaconCount}
			</Txt>
		</Flex>
	</div>
));

export const BarLabelBeaconList = observer<BarLabelsProps>(({ bar, dateFormatter }) => {
	const store = useStore();
	const routeToBeacon = (beaconId: string) => {
		store.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				view: CampaignViews.EXPLORE,
				currentItem: 'beacon',
				currentItemId: beaconId as UUID,
				tab: Tabs.COMMANDS,
				activeItem: undefined,
				activeItemId: undefined,
			},
		});
	};
	return (
		<div cy-test="timeline-tooltip-clickable" css={barPopoverStyles}>
			<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
			<FlexSplitter />
			<Flex css={{ padding: '0.2rem 0' }}>
				<Txt cy-test="timeline-beacon-header" small bold>
					Beacons
				</Txt>
				<FlexSplitter />
				<Txt cy-test="timeline-command-header" small bold>
					Commands
				</Txt>
			</Flex>
			{bar.beaconCommands.map((beaconCommand) => (
				<Flex
					key={beaconCommand.beaconId}
					css={barPopoverRowStyles}
					onClick={() => routeToBeacon(beaconCommand.beaconId as string)}
				>
					<Txt cy-test="timeline-beacon-name" small css={marginStyles(0.5)}>
						{store.graphqlStore.beacons.get(beaconCommand.beaconId as string)?.displayName}
					</Txt>
					<Txt cy-test="timeline-beacon-operator" muted small css={marginStyles(4)}>
						{store.graphqlStore.beacons.get(beaconCommand.beaconId as string)?.meta[0].maybeCurrent?.username}
					</Txt>
					<FlexSplitter />
					<Txt cy-test="timeline-beacon-command-count" small>
						{beaconCommand.commandCount}
					</Txt>
				</Flex>
			))}
		</div>
	);
});

const barPopoverStyles = css`
	padding: 0.4rem;
`;

const marginStyles = (num: number) => css`
	margin-right: ${num}rem;
`;

const barPopoverRowStyles = css`
	&:hover {
		cursor: pointer;
		background: ${Tokens.Components.MinimalButtonBackgroundColorHover};
	}
`;

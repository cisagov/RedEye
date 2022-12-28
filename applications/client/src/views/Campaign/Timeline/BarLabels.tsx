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
		<Txt block bold small>{`${dateStart} - ${dateEnd.split(' ')[1]}`}</Txt>
	) : (
		<Txt block bold small>{`${dateStart} - ${dateEnd}`}</Txt>
	);
});

export const BarLabelOnHover = observer<BarLabelsProps>(({ bar, dateFormatter }) => (
	<div css={barPopoverStyles}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<Flex>
			<Txt muted small>
				Beacons
			</Txt>
			<FlexSplitter />
			<Txt small>{bar?.beaconNumbers}</Txt>
		</Flex>
		<Flex>
			<Txt muted small>
				Total commands
			</Txt>
			<FlexSplitter />
			<Txt small>{bar?.beaconCount}</Txt>
		</Flex>
		<Flex>
			<Txt muted small>
				Active Beacon commands
			</Txt>
			<FlexSplitter />
			<Txt small>{bar?.activeBeaconCount}</Txt>
		</Flex>
	</div>
));

export const BarLabelOnClick = observer<BarLabelsProps>(({ bar, dateFormatter }) => {
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
		<div css={barPopoverStyles}>
			<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
			<FlexSplitter />
			<Flex css={{ 'padding-top': '0.2rem' }}>
				<Txt small bold>
					Beacons
				</Txt>
				<FlexSplitter />
				<Txt small bold>
					Commands
				</Txt>
			</Flex>
			{bar.beaconCommands.map((beaconCommand) => (
				<Flex key={beaconCommand[0]} css={barPopoverRowStyles} onClick={() => routeToBeacon(beaconCommand[0] as string)}>
					<Txt muted small>
						{beaconCommand[0]}
					</Txt>
					<FlexSplitter />
					<Txt small>{beaconCommand[1]}</Txt>
				</Flex>
			))}
		</div>
	);
});

const barPopoverStyles = css`
	padding: 0.4rem;
	min-width: 200px;
`;

const barPopoverRowStyles = css`
	&:hover {
		cursor: pointer;
		background: ${Tokens.Components.MinimalButtonBackgroundColorHover};
	}
`;

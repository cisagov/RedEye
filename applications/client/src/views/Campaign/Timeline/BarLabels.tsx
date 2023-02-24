import { css } from '@emotion/react';
import { CarbonIcon, dateFormat, dateTimeFormat, Flex, semanticIcons } from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { CampaignViews, Tabs } from '@redeye/client/types';
import type { UUID } from '@redeye/client/types';
import { Txt, FlexSplitter, AdvancedTokens, CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { MenuDivider } from '@blueprintjs/core';
import { ChevronUp16 } from '@carbon/icons-react';
import type { IBar } from './TimelineChart';
import { IconLabel } from '../Explore';

type BarLabelsProps = ComponentProps<'div'> & {
	bar: IBar;
	dateFormatter: string | undefined;
	handleClick?: () => void;
};

export const BarLabelDate = observer<BarLabelsProps>(({ bar, dateFormatter }) => {
	const store = useStore();
	const dateStart = store.settings.momentTz(bar?.start).format(dateFormatter);
	const dateEnd = store.settings.momentTz(bar?.end).format(dateFormatter);
	const sameDate = dateStart.split(' ')[0] === dateEnd.split(' ')[0];

	return sameDate && dateFormatter === dateFormat ? (
		<Txt block bold small css={marginStyles(1)}>
			{dateStart}
		</Txt>
	) : sameDate && dateFormatter === dateTimeFormat ? (
		<Txt cy-test="timeline-tooltip-date-time" block bold small css={marginStyles(1)}>{`${dateStart} - ${
			dateEnd.split(' ')[1]
		}`}</Txt>
	) : (
		<Txt block bold small css={marginStyles(1)}>{`${dateStart} - ${dateEnd}`}</Txt>
	);
});

export const BarLabelHeader = observer<BarLabelsProps>(({ bar, dateFormatter }) => (
	<Flex css={headerStyles}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<IconLabel value={bar?.beaconNumbers} title="Beacons" icon={semanticIcons.beacon} />
		<IconLabel title="Commands" value={bar?.beaconCount} icon={semanticIcons.commands} css={{ marginRight: '-0.1rem' }} />
	</Flex>
));

export const BarLabelOnHover = observer<BarLabelsProps>(({ bar, dateFormatter, handleClick }) => (
	<div cy-test="timeline-tooltip-static" css={barPopoverStyles}>
		<BarLabelHeader bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<MenuDivider />
		<Flex
			css={listStyles}
			onClick={() => {
				console.log('list');
				handleClick?.();
			}}
		>
			<CarbonIcon title="Beacons" icon={semanticIcons.beacon} css={marginStyles(0.5)} />
			<Txt small>List Beacons</Txt>
		</Flex>
	</div>
));

export const BarLabelBeaconList = observer<BarLabelsProps>(({ bar, dateFormatter, handleClick }) => {
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
		<div cy-test="timeline-tooltip-clickable" css={barPopoverStyles} onMouseLeave={handleClick}>
			<FlexSplitter />
			<Flex css={headerStyles}>
				<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
				<FlexSplitter />
				<IconLabel value={bar?.beaconNumbers} title="Beacons" icon={semanticIcons.beacon} />
				<IconLabel
					title="Commands"
					value={bar?.beaconCount}
					icon={semanticIcons.commands}
					css={{ marginRight: '-0.1rem' }}
				/>
			</Flex>
			<FlexSplitter />
			<MenuDivider />
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
					<IconLabel title="Commands" icon={semanticIcons.commands} css={{ marginRight: '-0.1rem' }} />
				</Flex>
			))}
			<MenuDivider />
			<Flex
				css={listStyles}
				onClick={() => {
					console.log('list');
					handleClick?.();
				}}
			>
				<CarbonIcon cy-test="row-beacon-count" title="Beacons" icon={ChevronUp16} css={marginStyles(0.5)} />
				<Txt small>Show Less</Txt>
			</Flex>
		</div>
	);
});

const barPopoverStyles = css`
	padding: 0.4rem;
`;

const headerStyles = css`
	align-items: baseline;
	padding-bottom: 0.3rem;
`;

const marginStyles = (num: number) => css`
	margin-right: ${num}rem;
`;

const barPopoverRowStyles = css`
	&:hover {
		cursor: pointer;
		background: ${AdvancedTokens.MinimalButtonBackgroundColorHover};
	}
`;

const listStyles = css`
	${barPopoverRowStyles};
	color: ${CoreTokens.Intent.Primary5};
`;

import { css } from '@emotion/react';
import {
	CarbonIcon,
	dateFormat,
	dateTimeFormat,
	Flex,
	ScrollBox,
	ScrollChild,
	semanticIcons,
} from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { CampaignViews, Tabs } from '@redeye/client/types';
import type { UUID } from '@redeye/client/types';
import { Txt, FlexSplitter, AdvancedTokens, CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { ChevronDown16, ChevronUp16 } from '@carbon/icons-react';
import type { IBar } from './TimelineChart';
import { IconLabel } from '../Explore';

type BarLabelsProps = ComponentProps<'div'> & {
	bar: IBar;
	dateFormatter: string | undefined;
};

const BarLabelDate = observer<BarLabelsProps>(({ bar, dateFormatter }) => {
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

const BarLabelHeader = observer<BarLabelsProps>(({ bar, dateFormatter, ...props }) => (
	<Flex css={headerStyles} {...props}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<IconLabel value={bar?.beaconNumbers} title="Beacons" icon={semanticIcons.beacon} css={{ margin: 0 }} />
		<IconLabel title="Commands" value={bar?.beaconCount} icon={semanticIcons.commands} css={{ margin: 0 }} />
	</Flex>
));

export const TimelineBarHoverPopover = observer<BarLabelsProps>(({ bar, dateFormatter, ...props }) => {
	const store = useStore();

	const routeToBeacon = useCallback((beaconId: string) => {
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
	}, []);

	const [isListOpen, setListOpen] = useState(false);

	return (
		<Flex column cy-test="timeline-tooltip-info" {...props}>
			<BarLabelHeader bar={bar} dateFormatter={dateFormatter} />
			{isListOpen && (
				<ScrollBox>
					<ScrollChild css={listWrapperStyles}>
						{bar.beaconCommands.map((beaconCommand) => (
							<Flex
								key={beaconCommand.beaconId}
								css={barPopoverRowStyles}
								onClick={() => routeToBeacon(beaconCommand.beaconId as string)}
							>
								<Txt cy-test="timeline-beacon-name" small>
									{store.graphqlStore.beacons.get(beaconCommand.beaconId as string)?.displayName}
								</Txt>
								<Txt cy-test="timeline-beacon-operator" muted small ellipsize>
									{store.graphqlStore.beacons.get(beaconCommand.beaconId as string)?.meta[0].maybeCurrent?.username}
								</Txt>
								<FlexSplitter />
								<IconLabel
									cy-test="timeline-beacon-command-count"
									title="Commands"
									icon={semanticIcons.commands}
									value={beaconCommand.commandCount}
									css={{ margin: 0 }}
								/>
							</Flex>
						))}
					</ScrollChild>
				</ScrollBox>
			)}
			<Button
				text={isListOpen ? 'Show Less' : 'List Beacons'}
				rightIcon={<CarbonIcon icon={isListOpen ? ChevronUp16 : ChevronDown16} />}
				onClick={() => setListOpen(!isListOpen)}
				intent="primary"
				alignText="left"
				minimal
				small
				fill
			/>
		</Flex>
	);
});

const rowStyle = css`
	align-items: center;
	padding: 0 0.5rem;
	height: 24px;
	gap: 4px;
	flex-wrap: nowrap;
`;
const headerStyles = css`
	${rowStyle}
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
`;

const barPopoverRowStyles = css`
	${rowStyle}
	cursor: pointer;
	&:hover {
		background: ${AdvancedTokens.MinimalButtonBackgroundColorHover};
	}
`;

const listWrapperStyles = css`
	max-height: 250px;
	overflow: auto;
	padding: 6px 0;
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
`;

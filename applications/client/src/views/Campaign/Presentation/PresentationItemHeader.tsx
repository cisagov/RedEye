import { Tooltip } from '@blueprintjs/core';
import { dateTimeFormat, timeFormat } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import type { TxtProps } from '@redeye/ui-styles';
import { Header, Spacer, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type PresentationItemHeaderProps = ComponentProps<'div'> & {};

export const PresentationItemHeader = observer<PresentationItemHeaderProps>(({}) => {
	const store = useStore();

	const state = createState({
		get min() {
			return store.settings.momentTz(store.campaign.presentation.currentSlide?.minDate);
		},
		get max() {
			return store.settings.momentTz(store.campaign.presentation.currentSlide?.maxDate);
		},
	});

	const beaconNames = store.campaign.presentation.currentSlide?.beacons.map((beacon) => beacon.computedName);

	const hostNames = Array.from(
		new Set(
			store.campaign.presentation.currentSlide?.beacons
				.map((beacon) => beacon.host?.current.computedName)
				.filter((h) => h) as string[]
		)
	);

	return (
		<div css={{ padding: '2px 1rem' }}>
			<Header withMargin css={{ display: 'flex', flexWrap: 'wrap' }}>
				<Txt>
					<PresentationHeaderPart names={hostNames} type="Host" />
				</Txt>
				<Spacer>/</Spacer>
				<Txt normal>
					<PresentationHeaderPart names={beaconNames} type="Beacon" />
				</Txt>
			</Header>
			<Txt block monospace muted cy-test="slide-header">
				{store.campaign.presentation.currentSlide?.minDate ? state.min.format(`ddd ${dateTimeFormat}`) : 'Unknown'}
				{store.campaign.presentation.currentSlide?.commandIds?.length! > 1 && (
					<>
						<span> &mdash; </span>
						{store.campaign.presentation.currentSlide?.maxDate
							? state.max.format(state.max.dayOfYear() > state.min.dayOfYear() ? `ddd ${dateTimeFormat}` : timeFormat)
							: 'Unknown'}
					</>
				)}
			</Txt>
		</div>
	);
});

const PresentationHeaderPart = ({ names, type, ...props }: TxtProps & { names?: string[]; type: string }) => (
	<>
		{names == null ? (
			<Txt disabled {...props}>
				Unknown {type}
			</Txt>
		) : names.length === 1 ? (
			<Txt {...props}>{names[0]}</Txt>
		) : (
			<Tooltip
				placement="bottom-start"
				interactionKind="hover"
				content={
					<ul css={{ margin: 0, padding: 0, listStyle: 'none' }}>
						{names.map((name) => (
							<li>{name}</li>
						))}
					</ul>
				}
			>
				<Txt italic {...props}>
					Multiple {type}s
				</Txt>
			</Tooltip>
		)}
	</>
);

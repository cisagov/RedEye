import { css } from '@emotion/react';
import { dateFormat, dateTimeFormat } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { Txt, FlexSplitter } from '@redeye/ui-styles';
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
	<div css={barLabelStyles}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<Txt muted small>
			Beacons
		</Txt>
		<Txt small css={{ float: 'right' }}>
			{bar?.beaconCount}
		</Txt>
	</div>
));

export const BarLabelOnClick = observer<BarLabelsProps>(({ bar, dateFormatter }) => (
	<div css={barLabelStyles}>
		<BarLabelDate bar={bar} dateFormatter={dateFormatter} />
		<FlexSplitter />
		<Txt muted small>
			Beacons
		</Txt>
		<Txt small css={{ float: 'right' }}>
			{bar?.beaconCount}
		</Txt>
		<FlexSplitter />
		<Txt muted small>
			Active Beacons
		</Txt>
		<Txt small css={{ float: 'right' }}>
			{bar?.activeBeaconCount}
		</Txt>
	</div>
));

const barLabelStyles = css`
	padding: 0.4rem;
	min-width: 140px;
`;

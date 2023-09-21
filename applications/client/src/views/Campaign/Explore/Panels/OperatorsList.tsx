import { createSorter, dateShortFormat, isDefined, semanticIcons, VirtualizedList } from '@redeye/client/components';
import type { SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import type { InfoType } from '@redeye/client/types/explore';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { defaultInfoRowHeight, IconLabel, InfoRow, MessageRow, RowTime, RowTitle } from '../components';

type OperatorsListProps = ComponentProps<'div'> & {
	type: InfoType;
	sort: SortType;
};

export const OperatorsList = observer<OperatorsListProps>(({ ...props }) => {
	const store = useStore();
	const operators =
		store.campaign?.interactionState[`selected${props.type}`]?.current?.operators
			?.filter(isDefined)
			.sort(createSorter(props.sort.sortBy, props.sort.direction === SortDirection.ASC)) || [];
	return (
		<VirtualizedList cy-test="operators-view" fixedItemHeight={defaultInfoRowHeight}>
			{operators.length === 0 ? (
				<MessageRow>No Operators</MessageRow>
			) : (
				operators.map((operator) => (
					<InfoRow cy-test="operator-row" key={operator.name} onClick={async () => await operator.select()}>
						<RowTime cy-test="operator-time" state={operator.state}>
							{store.settings.momentTz(operator.startTime)?.format(dateShortFormat)}&mdash;
							{store.settings.momentTz(operator.endTime)?.format(dateShortFormat)}
						</RowTime>
						<RowTitle>
							<Txt ellipsize>{operator.name}</Txt>
						</RowTitle>
						<FlexSplitter />
						<IconLabel
							cy-test="row-command-count"
							value={operator.logIds?.length}
							title="Commands"
							icon={semanticIcons.commands}
						/>
						<IconLabel
							cy-test="row-beacon-count"
							value={operator.beaconIds?.length}
							title="Beacons"
							icon={semanticIcons.beacon}
						/>
					</InfoRow>
				))
			)}
		</VirtualizedList>
	);
});

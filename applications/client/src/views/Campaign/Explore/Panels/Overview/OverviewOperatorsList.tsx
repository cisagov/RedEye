import { createSorter, dateShortFormat, isDefined, semanticIcons, VirtualizedList } from '@redeye/client/components';
import type { OperatorModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import { defaultInfoRowHeight, IconLabel, InfoRow, MessageRow, RowTime, RowTitle } from '@redeye/client/views';
import { FlexSplitter } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OverviewProps = ComponentProps<'div'> & {
	sort: SortType;
};

export const OverviewOperatorsList = observer<OverviewProps>(({ sort }) => {
	const store = useStore();
	const operators = Array.from(store.graphqlStore.operators.values() || [])
		.filter<OperatorModel>(isDefined)
		.sort(createSorter(sort.sortBy, sort.direction === SortDirection.ASC));
	return (
		<VirtualizedList cy-test="operators-view" fixedItemHeight={defaultInfoRowHeight}>
			{operators.length === 0 ? (
				<MessageRow>No Operators</MessageRow>
			) : (
				operators.map((operator) => (
					<InfoRow cy-test="operator-row" key={operator.name} onClick={() => operator.select()}>
						<RowTime cy-test="operator-time" state={operator.state}>
							{store.settings.momentTz(operator.startTime)?.format(dateShortFormat)}&mdash;
							{store.settings.momentTz(operator.endTime)?.format(dateShortFormat)}
						</RowTime>
						<RowTitle>{operator.name}</RowTitle>
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

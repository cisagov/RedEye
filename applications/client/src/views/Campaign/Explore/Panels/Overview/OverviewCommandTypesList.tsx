import { createSorter, isDefined, semanticIcons, VirtualizedList } from '@redeye/client/components';
import type { CommandTypeCountModel, SortType } from '@redeye/client/store';
import { SortDirection, useStore } from '@redeye/client/store';
import { defaultInfoRowHeight, IconLabel, InfoRow, MessageRow, RowTitle } from '@redeye/client/views';
import { FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OverviewProps = ComponentProps<'div'> & {
	sort: SortType;
};

export const OverviewCommandTypesList = observer<OverviewProps>(({ sort }) => {
	const store = useStore();
	const commandTypes = Array.from(store.graphqlStore.commandTypeCounts.values() || [])
		.filter<CommandTypeCountModel>(isDefined)
		.sort(createSorter(sort.sortBy, sort.direction === SortDirection.ASC));
	return (
		<VirtualizedList cy-test="commands-view" fixedItemHeight={defaultInfoRowHeight}>
			{commandTypes.length === 0 ? (
				<MessageRow>No Commands</MessageRow>
			) : (
				commandTypes.map((commandTypeCount) => (
					<InfoRow cy-test="commands" key={commandTypeCount.id} onClick={() => commandTypeCount.select()}>
						<RowTitle>
							<Txt ellipsize>{commandTypeCount.text}</Txt>
						</RowTitle>
						<FlexSplitter />
						<IconLabel
							cy-test="row-command-count"
							title="Commands"
							value={commandTypeCount.count}
							icon={semanticIcons.commands}
						/>
					</InfoRow>
				))
			)}
		</VirtualizedList>
	);
});

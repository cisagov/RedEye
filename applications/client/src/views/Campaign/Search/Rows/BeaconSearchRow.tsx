import { highlightPattern } from '@redeye/client/components';
import type { BeaconModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { getPaths, SearchRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type BeaconSearchRowProps = SearchRowProps<BeaconModel> & SearchResultItemProps;

export const BeaconSearchRow = observer<BeaconSearchRowProps>(({ result, searchTerm, item: beacon, ...props }) => {
	const store = useStore();

	const text = highlightPattern(
		beacon.displayName !== beacon.beaconName ? `${beacon.displayName} (${beacon.beaconName})` : beacon.displayName,
		searchTerm
	);

	const beaconUser = highlightPattern(beacon.meta?.[0]?.maybeCurrent?.username || undefined, searchTerm);

	return (
		<SearchRow
			cy-test="search-result-item"
			item={beacon}
			text={text}
			subText={beaconUser}
			path={getPaths(store, beacon.hierarchy).slice(0, -1).concat(['Beacon']) as string[]}
			startTime={beacon.minTime}
			endTime={beacon.maxTime}
			commandsCount={beacon.commandsCount || 0}
			onClick={() => {
				beacon.searchSelect();
				store.campaign.search.closeSearch();
			}}
			{...props}
		/>
	);
});

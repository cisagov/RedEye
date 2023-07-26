import { highlightPattern } from '@redeye/client/components';
import type { ServerModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { SearchRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type ServerSearchRowProps = SearchRowProps<ServerModel> & SearchResultItemProps;

export const ServerSearchRow = observer<ServerSearchRowProps>(({ result, searchTerm, item: server, ...props }) => {
	const store = useStore();

	const text = highlightPattern(
		!server.displayName || server.displayName === server.computedName
			? server.computedName
			: `${server.displayName} (${server.computedName})`,
		searchTerm
	);

	return (
		<SearchRow
			cy-test="search-result-item"
			item={server}
			text={text}
			path={['Server']}
			startTime={server.minTime}
			endTime={server.maxTime}
			hostsCount={server.hosts.size}
			beaconsCount={server.beacons.length}
			onClick={() => {
				server.searchSelect();
				store.campaign.search.closeSearch();
			}}
			{...props}
		/>
	);
});

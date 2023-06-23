import { highlightPattern } from '@redeye/client/components';
import { useStore, type PresentationItemModel } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { SearchRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type TagSearchRowSearchRowProps = SearchRowProps<PresentationItemModel> & SearchResultItemProps;

export const UserSearchRow = observer<TagSearchRowSearchRowProps>(({ result, searchTerm, item: user, ...props }) => {
	const store = useStore();

	const text = highlightPattern(`${user.id.slice(5)}`, searchTerm);

	return (
		<SearchRow
			cy-test="search-result-item"
			item={user}
			text={text}
			path={['User']}
			// tagCount={88}
			onClick={() => {
				user.searchSelect();
				store.campaign.search.closeSearch();
			}}
			{...props}
		/>
	);
});

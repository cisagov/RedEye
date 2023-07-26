import { highlightPattern } from '@redeye/client/components';
import { useStore, type TagModel } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { SearchRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type TagSearchRowSearchRowProps = SearchRowProps<TagModel> & SearchResultItemProps;

export const TagSearchRow = observer<TagSearchRowSearchRowProps>(({ result, searchTerm, item: tag, ...props }) => {
	const store = useStore();

	const text = highlightPattern(`#${tag.text}`, searchTerm);

	return (
		<SearchRow
			cy-test="search-result-item"
			item={tag}
			text={text}
			path={['Tag']}
			commentsCount={tag.commentCount}
			commandsCount={tag.commandsCount}
			onClick={() => {
				tag.searchSelect();
				store.campaign.search.closeSearch();
			}}
			{...props}
		/>
	);
});

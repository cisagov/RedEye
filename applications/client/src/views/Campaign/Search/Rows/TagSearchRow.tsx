import { highlightPattern } from '@redeye/client/components';
import type { TagModel } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { SearchRow } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type TagSearchRowSearchRowProps = SearchRowProps<TagModel> & SearchResultItemProps;

export const TagSearchRow = observer<TagSearchRowSearchRowProps>(({ result, searchTerm, item: tag, ...props }) => {
	const text = highlightPattern(`#${tag.text}`, searchTerm);

	return (
		<SearchRow
			cy-test="search-result-item"
			item={tag}
			text={text}
			path={['Tag']}
			// tagCount={88}
			{...props}
		/>
	);
});

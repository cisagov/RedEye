import { highlightPattern } from '@redeye/client/components';
import { store, type AnnotationModel } from '@redeye/client/store';
import type { SearchRowProps } from '@redeye/client/views';
import { SearchRow } from '@redeye/client/views';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { SearchResultItemProps } from '../SearchResultItem';

type AnnotationSearchRowProps = SearchRowProps<AnnotationModel> & SearchResultItemProps;

export const AnnotationSearchRow = observer<AnnotationSearchRowProps>(
	({ result, searchTerm, item: annotation, ...props }) => {
		const commentText = highlightPattern(String(result.name), searchTerm);

		return (
			<SearchRow
				cy-test="search-result-item"
				item={annotation}
				path={[annotation.user || 'parser-generated', 'Comment']}
				commandsCount={annotation.commandIds?.length}
				tagsCount={annotation.tags?.length}
				onClick={() => {
					annotation.searchSelect();
					store.campaign.search.closeSearch();
				}}
				children={
					<>
						<Txt block large>
							{commentText}
						</Txt>
						{(annotation.tags?.length || 0) > 0 && (
							<Txt block small css={{ marginTop: '0.5rem' }}>
								{annotation.tags?.map((tag) => (
									<Txt css={{ marginRight: '0.25rem' }}>#{tag.current.text}</Txt>
								))}
							</Txt>
						)}
					</>
				}
				{...props}
			/>
		);
	}
);

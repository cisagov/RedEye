import { Button, InputGroup, ProgressBar } from '@blueprintjs/core';
import { CaretDown16, CaretUp16, Close16, Search16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, Dropdown, ErrorFallback, ScrollBox, VirtualizedList } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { SearchFilterOptions, SearchSortOptions } from '@redeye/client/types/search';
import { Border, CoreTokens, FlexSplitter, Header, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import type { HTMLProps } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SearchRowPlaceholder } from './Rows/SearchRow';
import { SearchResultItem } from './SearchResultItem';

const sortOptions: Record<SearchSortOptions, { key: string; label: string; enumKey: SearchSortOptions }> = {
	[SearchSortOptions.Relevance]: { key: 'r', label: 'Relevance', enumKey: SearchSortOptions.Relevance },
	[SearchSortOptions.Name]: { key: 'n', label: 'Name', enumKey: SearchSortOptions.Name },
	[SearchSortOptions.Type]: { key: 't', label: 'Type', enumKey: SearchSortOptions.Type },
};

const sortOptionsBP = Object.values(sortOptions);

const filterOptions = Object.keys(SearchFilterOptions).reduce(
	(allFilterOptions, filterOption) => ({
		...allFilterOptions,
		[filterOption]: { key: filterOption, label: SearchFilterOptions[filterOption], enumKey: filterOption },
	}),
	{} as Record<SearchFilterOptions, { key: string; label: string; enumKey: SearchFilterOptions }>
);

const filterOptionsBP = Object.values(filterOptions);

export const SearchPanel = observer<HTMLProps<HTMLDivElement>>(({ ...props }) => {
	const store = useStore();
	const [searchHeight, setSearchHeight] = useState<number>(0);
	const resultContainer = useRef<HTMLDivElement>(null);
	const activeSortItem = sortOptions[store.campaign.search.activeSort];
	const activeFilterItem = filterOptions[store.campaign.search.activeFilter];

	useEffect(() => {
		if (resultContainer.current?.clientHeight) {
			setTimeout(() => {
				setSearchHeight(resultContainer.current?.clientHeight || 0);
			}, 300);
		}
	}, [resultContainer?.current]);

	return (
		<div cy-test="search-modal" css={layoutStyles} {...props}>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div css={headerStyles}>
					<Header large css={{ marginBottom: '1rem' }}>
						Search
					</Header>
					<form onSubmit={(e) => store.campaign.search.runSearch(e)}>
						<div>
							<InputGroup
								cy-test="search"
								value={store.campaign.search.inputValue}
								onChange={store.campaign.search.setSearch}
								leftIcon={<CarbonIcon icon={Search16} />}
								rightElement={
									<Button
										cy-test="clear-search"
										icon={<CarbonIcon icon={Close16} />}
										onClick={() => store.campaign.search.clearSearch()}
										disabled={store.campaign.search.searchString === ''}
									/>
								}
								placeholder="Navigate by Search..."
								autoFocus
								large
							/>
							<div css={searchSettingsBarStyles}>
								<Dropdown
									cy-test="sort-search"
									items={sortOptionsBP}
									activeItem={activeSortItem}
									onSelect={(newItem) => store.campaign.search.setActiveSort(newItem.enumKey)}
									text={activeSortItem?.label}
									labelText="Sort:"
									css={{ marginLeft: -7 }}
								/>
								<Button
									cy-test="sort-order"
									icon={<CarbonIcon icon={store.campaign.search.isAscending ? CaretUp16 : CaretDown16} />}
									onClick={() => store.campaign.search.setIsAscending(!store.campaign.search.isAscending)}
									title="Toggle ascending descending"
									minimal
									small
									css={{ marginLeft: -5 }}
								/>
								<Border vertical emphasis />
								<Dropdown
									cy-test="filter-search"
									items={filterOptionsBP}
									activeItem={activeFilterItem}
									onSelect={(newItem) => {
										store.campaign.search.setActiveFilter(newItem.enumKey);
									}}
									labelText="Filter:"
									text={activeFilterItem?.label}
								/>
								{store.campaign.search.activeFilter !== SearchFilterOptions.None && (
									<Button
										cy-test="remove-filter"
										icon={<CarbonIcon icon={Close16} />}
										onClick={() => {
											store.campaign.search.setActiveFilter(SearchFilterOptions.None);
										}}
										title="Toggle ascending descending"
										minimal
										small
										css={{ marginLeft: -5 }}
									/>
								)}
								<FlexSplitter />
								<div>
									{store.campaign.search.isError ? (
										<Txt css={{ color: CoreTokens.TextIntentDanger }}>Error</Txt>
									) : store.campaign.search.filteredResults ? (
										<Txt cy-test="results">
											{store.campaign.search.filteredResults?.length}{' '}
											{store.campaign.search.filteredResults?.length === 1 ? 'result' : 'results'}
										</Txt>
									) : (
										<Txt italic disabled>
											--- {/* No search query */}
										</Txt>
									)}
								</div>
							</div>
						</div>
					</form>
				</div>
				<ProgressBar intent="primary" css={[!store.campaign.search.isSearching && { visibility: 'hidden' }]} />
				<ScrollBox ref={resultContainer} css={scrollBoxStyles}>
					<VirtualizedList
						cy-test="search-results"
						initialIndex={store.campaign.search.initialIndex}
						itemsRendered={(items) => store.campaign.search.setInitialIndex(items[0]?.index)}
						style={{ height: `${searchHeight || 0}px` }}
					>
						{store.campaign.search.isSearching ? (
							searchRowPlaceholderArray
						) : !store.campaign.search.results ? (
							<Txt disabled italic block css={{ margin: '1.5rem', textAlign: 'center' }}>
								No search query
							</Txt>
						) : store.campaign.search.sortedResultsWithDirection?.length === 0 ? (
							<Txt muted italic block css={{ margin: '1.5rem', textAlign: 'center' }}>
								No
								{store.campaign.search.activeFilter === SearchFilterOptions.None
									? ' search results '
									: ` ${SearchFilterOptions[store.campaign.search.activeFilter]} `}
								found matching {`'${store.campaign.search.searchString}'`}
							</Txt>
						) : (
							store.campaign.search.sortedResultsWithDirection?.map((result, index) => (
								<SearchResultItem
									cy-test="search-result-item"
									// eslint-disable-next-line react/no-array-index-key
									key={`${result.id}-${index}`}
									result={result}
									searchTerm={store.campaign.search.searchString}
								/>
							))
						)}
					</VirtualizedList>
				</ScrollBox>
			</ErrorBoundary>
		</div>
	);
});

const layoutStyles = css`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const headerStyles = css`
	flex: 0 0 auto;
	padding: 1.5rem 1.5rem 0.5rem;
`;

const searchSettingsBarStyles = css`
	display: flex;
	align-items: center;
	margin: 0.5rem 0;
`;

const scrollBoxStyles = css`
	border-top: 1px solid ${CoreTokens.BorderNormal};
	flex: 1 1 auto;
`;

// eslint-disable-next-line react/no-array-index-key
const searchRowPlaceholderArray = new Array(5).fill(null).map((_, i) => <SearchRowPlaceholder key={i} />);

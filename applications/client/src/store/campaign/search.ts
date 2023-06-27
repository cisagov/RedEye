import { createSorter } from '@redeye/client/components/create-sorter';
import type { AnyModel, FieldToNames, ProcessedSearchItem, SearchItem } from '@redeye/client/types/search';
import { SearchFilterOptions, SearchSortOptions } from '@redeye/client/types/search';
import MiniSearch from 'minisearch';
import { computed, observable, when } from 'mobx';
import { ExtendedModel, model, modelAction, modelClass, modelFlow, prop } from 'mobx-keystone';
import { FormEvent } from 'react';
import {
	AnnotationModel,
	BeaconModel,
	CommandModel,
	CommandTypeCountModel,
	HostModel,
	OperatorModel,
	ServerModel,
	TagModel,
	PresentationItemModel,
	presentationItemModelPrimitives,
	presentationCommandGroupModelPrimitives,
} from '../graphql';
import { RedEyeModel } from '../util/model';
import { CampaignLoadingMessage } from './campaign';

@model('SearchStore')
export class SearchStore extends ExtendedModel(() => ({
	baseModel: modelClass<RedEyeModel>(RedEyeModel),
	props: {
		isSearching: prop<boolean>(false).withSetter(),
		isError: prop<boolean>(false).withSetter(),
		inputValue: prop<string>('').withSetter(),
		searchString: prop<string>('').withSetter(),
		activeSort: prop<SearchSortOptions>(SearchSortOptions.Relevance).withSetter(),
		activeFilter: prop<SearchFilterOptions>(SearchFilterOptions.None).withSetter(),
		isAscending: prop<boolean>(false).withSetter(),
		initialIndex: prop<number>(0).withSetter(),
	},
})) {
	@observable results: ProcessedSearchItem<AnyModel>[] | null = null;
	@observable resultsCache: Record<string, AnyModel> | undefined;

	protected onAttachedToRootStore(): (() => void) | void {
		return when(
			() =>
				!!this.appStore?.router.queryParams.search && this.appStore?.campaign.isLoading === CampaignLoadingMessage.DONE,
			() => {
				this.setInputValue(this.appStore!.router.queryParams.search);
				this.runSearch();
			}
		);
	}

	@modelAction clearSearch() {
		this.setInputValue('');
		this.setSearchString('');
		this.results = null;
		this.appStore?.router.updateQueryParams({ queryParams: { search: undefined } });
		this.appStore?.campaign.search.setActiveFilter(SearchFilterOptions.None);
		this.appStore?.campaign.search.setIsAscending(false);
		this.appStore?.campaign.search.setActiveSort(SearchSortOptions.Relevance);
	}

	setSearch = (e) => {
		this.setInputValue(e.target.value);
	};

	openSearch() {
		this.appStore?.router.updateQueryParams({ queryParams: { 'search-modal': 'open' } });
	}

	closeSearch() {
		this.appStore?.router.updateQueryParams({ queryParams: { 'search-modal': 'closed' } });
	}

	@computed get searchItems(): Array<
		OperatorModel | BeaconModel | ServerModel | HostModel | CommandTypeCountModel | TagModel | PresentationItemModel
	> {
		return this.appStore
			? [
					...this.appStore.graphqlStore.operators.values(),
					...this.appStore.graphqlStore.beacons.values(),
					...this.appStore.graphqlStore.servers.values(),
					...this.appStore.graphqlStore.hosts.values(),
					...this.appStore.graphqlStore.commandTypeCounts.values(),
					...this.appStore.graphqlStore.tags.values(),
					...this.appStore.graphqlStore.presentationItems.values(),
			  ]
			: [];
	}

	@modelFlow
	*runSearch(e?: FormEvent<HTMLFormElement>) {
		e?.preventDefault();
		this.setIsSearching(true);
		this.setIsError(false);
		const searchString = this.inputValue.trim();

		if (!searchString) {
			this.clearSearch();
			this.setIsSearching(false);
			return;
		}

		this.appStore?.router.updateQueryParams({ queryParams: { search: searchString } });

		try {
			if (this.appStore) {
				const { searchCommands: commandMatches } = yield this.appStore.graphqlStore.querySearchCommands({
					campaignId: this.appStore.campaign.id!,
					searchQuery: searchString,
					hidden: this.appStore.settings.showHidden,
				});
				const { searchAnnotations: annotationMatches } = yield this.appStore.graphqlStore.querySearchAnnotations({
					campaignId: this.appStore.campaign.id!,
					searchQuery: searchString,
					hidden: this.appStore.settings.showHidden,
				});
				yield this.appStore.graphqlStore.queryPresentationItems(
					{ campaignId: this.appStore.campaign.id!, hidden: this.appStore.settings.showHidden, userOnly: true },
					presentationItemModelPrimitives.commandGroups(presentationCommandGroupModelPrimitives).toString()
				);

				// Run search with MiniSearch
				const search = new MiniSearch({
					fields: ['name', 'field1', 'field2', 'field3'],
					searchOptions: {
						boost: { name: 1000, field1: 3, field2: 2, field3: 1 },
						fuzzy: 0.3,
						prefix: true,
					},
				});
				const { allItems, idsToValue } = this.getSearchableItems([
					...commandMatches,
					...annotationMatches,
					...this.searchItems,
				] as AnyModel[]);
				search.addAll(allItems);
				const results = search.search(searchString);

				this.results = results.map((result) => ({
					...idsToValue[result.id],
					match: result.match,
				}));
			}
		} catch (error) {
			window.console.error(error);
			this.setIsError(true);
		}

		// reset loader and search term
		this.setIsSearching(false);
		this.setSearchString(searchString);
	}

	@computed get filteredResults() {
		return this.activeFilter === SearchFilterOptions.None
			? this.results
			: this.results?.slice().filter((result) => result.fullObject.__typename === this.activeFilter);
	}

	@computed get sortedResults() {
		switch (this.activeSort) {
			case SearchSortOptions.Relevance: {
				return this.filteredResults;
			}
			case SearchSortOptions.Name: {
				const sorter = createSorter<SearchItem<AnyModel>>((a) => a.name);
				return this.filteredResults?.slice().sort(sorter).reverse();
			}
			case SearchSortOptions.Type: {
				const sorter = createSorter<SearchItem<AnyModel>>((a) => a.fullObject.__typename);
				return this.filteredResults?.slice().sort(sorter).reverse();
			}
			default:
				break;
		}
	}

	@computed get sortedResultsWithDirection() {
		return this.isAscending ? this.sortedResults?.slice().reverse() : this.sortedResults;
	}

	@computed get isSearchModalOpen() {
		return this.appStore?.router.queryParams['search-modal'] === 'open';
	}

	getSearchableItems(items: AnyModel[]): {
		idsToValue: Record<string, SearchItem<AnyModel>>;
		allItems: SearchItem<AnyModel>[];
	} {
		const idsToValue = {};
		const allItems = items.map((item) => {
			// let nameField: string | number = item.__typename === "Operator" | item.__typename === "Server" ? item.name :
			const id = `${item.__typename}-${item.id}`;
			const values = SearchStore.getRankedValues(item);
			const nameLookup = SearchStore.getNameLookup(item);
			const searchItem: SearchItem<AnyModel> = {
				id,
				name: values[0] ?? '',
				field1: values[1],
				field2: values[2],
				field3: values[3],
				fieldToNamesLookup: nameLookup,
				fullObject: item,
			};
			idsToValue[id] = searchItem;
			return searchItem;
		});

		return {
			idsToValue,
			allItems,
		};
	}

	// NOTE: This needs to match getNameLookup
	static getRankedValues(item: AnyModel): (string | number | null | undefined)[] {
		if (item instanceof OperatorModel) {
			return [item.name];
		} else if (item instanceof ServerModel) {
			return [`${item.displayName} ${item.name}`];
		} else if (item instanceof HostModel) {
			return [`${item.displayName} ${item.hostName}`];
		} else if (item instanceof BeaconModel) {
			return [`${item.displayName} ${item.beaconName}`, item.meta?.[0]?.maybeCurrent?.username];
		} else if (item instanceof TagModel) {
			return [item.text];
		} else if (item instanceof AnnotationModel) {
			return [item.text];
		} else if (item instanceof CommandTypeCountModel) {
			return [item.id];
		} else if (item instanceof CommandModel) {
			return [`${item.inputText} ${item.inputLine}`, item.outputLines.join(' ')];
		} else if (item instanceof PresentationItemModel && item.id.slice(0, 5) === 'user-') {
			return [item.id.slice(5)];
		}
		return [];
	}

	// NOTE: This needs to match getRankedValues
	private static getNameLookup(item: AnyModel): FieldToNames {
		if (item instanceof BeaconModel) {
			return {
				field1: 'User Name',
			};
		} else if (item instanceof CommandModel) {
			return {
				field1: 'outputLines',
			};
		}
		return {};
	}
}

import { highlightPattern } from '@redeye/client/components';
import {
	AnnotationModel,
	BeaconModel,
	CommandModel,
	CommandTypeCountModel,
	HostModel,
	OperatorModel,
	PresentationItemModel,
	ServerModel,
	TagModel,
} from '@redeye/client/store';
import type { AnyModel, ProcessedSearchItem } from '@redeye/client/types/search';
import { observer } from 'mobx-react-lite';
import {
	AnnotationSearchRow,
	BeaconSearchRow,
	CommandSearchRow,
	HostSearchRow,
	OperatorSearchRow,
	SearchRow,
	ServerSearchRow,
} from './Rows';
import { CommandTypeSearchRow } from './Rows/CommandTypeSearchRow';
import { TagSearchRow } from './Rows/TagSearchRow';
import { UserSearchRow } from './Rows/UserSearchRow';

export interface SearchResultItemProps {
	searchTerm: string;
	result: ProcessedSearchItem<AnyModel>;
}

export const SearchResultItem = observer<SearchResultItemProps>(({ result, searchTerm }) => {
	const item = result.fullObject;

	const props = {
		result,
		searchTerm,
	};

	return item instanceof ServerModel ? (
		<ServerSearchRow item={item} {...props} />
	) : item instanceof HostModel ? (
		<HostSearchRow item={item} {...props} />
	) : item instanceof BeaconModel ? (
		<BeaconSearchRow item={item} {...props} />
	) : item instanceof OperatorModel ? (
		<OperatorSearchRow item={item} {...props} />
	) : item instanceof AnnotationModel ? (
		<AnnotationSearchRow item={item} {...props} />
	) : item instanceof CommandModel ? (
		<CommandSearchRow item={item} {...props} />
	) : item instanceof CommandTypeCountModel ? (
		<CommandTypeSearchRow item={item} {...props} />
	) : item instanceof TagModel ? (
		<TagSearchRow item={item} {...props} />
	) : item instanceof PresentationItemModel ? (
		<UserSearchRow item={item} {...props} />
	) : (
		<SearchRow item={item} text={highlightPattern(String(result.name), searchTerm)} path={['Other']} />
	);
});

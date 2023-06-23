import type { MatchInfo } from 'minisearch';
import type {
	AnnotationModel,
	BeaconModel,
	CommandModel,
	CommandTypeCountModel,
	HostModel,
	OperatorModel,
	PresentationItemModel,
	ServerModel,
	TagModel,
} from '../store';

export type AnyModel =
	| CommandModel
	| OperatorModel
	| HostModel
	| BeaconModel
	| ServerModel
	| AnnotationModel
	| CommandTypeCountModel
	| TagModel
	| PresentationItemModel;

type FieldRecord<T> = {
	field1?: T;
	field2?: T;
	field3?: T;
};

export type FieldToNames = FieldRecord<string>;

export type SearchItem<T> = FieldRecord<string | number | null> & {
	id: string;
	name: string | number;
	fieldToNamesLookup: FieldToNames;
	fullObject: T;
};

export type ProcessedSearchItem<T> = SearchItem<T> & {
	match: MatchInfo;
};

export enum SearchSortOptions {
	Relevance,
	Name,
	Type,
}

// Keep the three we put on hold for now
export enum SearchFilterOptions {
	None = 'None',
	Beacon = 'Beacons',
	Host = 'Hosts',
	Server = 'Teamservers',
	Operator = 'Operators',
	// UserContexts = 'User Contexts',
	Users = 'Users',
	Annotation = 'Comments',
	Command = 'Commands',
	CommandTypeCount = 'Command Type',
	Tag = 'Tags',
	// DateRange = 'Date Range',
}

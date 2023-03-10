/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import type { ObservableMap } from 'mobx';
import {
	types,
	prop,
	tProp,
	Ref,
	Model,
	modelAction,
	objectMap,
	detach,
	model,
	findParent,
	customRef,
	ExtendedModel,
	AbstractModelClass,
} from 'mobx-keystone';
import { MKGQLStore, createMKGQLStore, QueryOptions } from 'mk-gql';
import { MergeHelper } from './mergeHelper';

import { AnnotationModel, annotationModelPrimitives, AnnotationModelSelector } from './AnnotationModel';
import { BeaconModel, beaconModelPrimitives, BeaconModelSelector } from './BeaconModel';
import { BeaconMetaModel, beaconMetaModelPrimitives, BeaconMetaModelSelector } from './BeaconMetaModel';
import { CampaignModel, campaignModelPrimitives, CampaignModelSelector } from './CampaignModel';
import { CommandModel, commandModelPrimitives, CommandModelSelector } from './CommandModel';
import { CommandGroupModel, commandGroupModelPrimitives, CommandGroupModelSelector } from './CommandGroupModel';
import {
	CommandTypeCountModel,
	commandTypeCountModelPrimitives,
	CommandTypeCountModelSelector,
} from './CommandTypeCountModel';
import { FileModel, fileModelPrimitives, FileModelSelector } from './FileModel';
import { GlobalOperatorModel, globalOperatorModelPrimitives, GlobalOperatorModelSelector } from './GlobalOperatorModel';
import { HostModel, hostModelPrimitives, HostModelSelector } from './HostModel';
import { HostMetaModel, hostMetaModelPrimitives, HostMetaModelSelector } from './HostMetaModel';
import { ImageModel, imageModelPrimitives, ImageModelSelector } from './ImageModel';
import { LinkModel, linkModelPrimitives, LinkModelSelector } from './LinkModel';
import { LogEntryModel, logEntryModelPrimitives, LogEntryModelSelector } from './LogEntryModel';
import { OperatorModel, operatorModelPrimitives, OperatorModelSelector } from './OperatorModel';
import {
	ParsingProgressModel,
	parsingProgressModelPrimitives,
	ParsingProgressModelSelector,
} from './ParsingProgressModel';
import {
	PresentationCommandGroupModel,
	presentationCommandGroupModelPrimitives,
	PresentationCommandGroupModelSelector,
} from './PresentationCommandGroupModel';
import {
	PresentationItemModel,
	presentationItemModelPrimitives,
	PresentationItemModelSelector,
} from './PresentationItemModel';
import { ServerModel, serverModelPrimitives, ServerModelSelector } from './ServerModel';
import { ServerMetaModel, serverMetaModelPrimitives, ServerMetaModelSelector } from './ServerMetaModel';
import {
	ServerParsingProgressModel,
	serverParsingProgressModelPrimitives,
	ServerParsingProgressModelSelector,
} from './ServerParsingProgressModel';
import { TagModel, tagModelPrimitives, TagModelSelector } from './TagModel';
import { TimelineModel, timelineModelPrimitives, TimelineModelSelector } from './TimelineModel';
import { TimelineBucketModel, timelineBucketModelPrimitives, TimelineBucketModelSelector } from './TimelineBucketModel';
import {
	TimelineCommandCountTupleModel,
	timelineCommandCountTupleModelPrimitives,
	TimelineCommandCountTupleModelSelector,
} from './TimelineCommandCountTupleModel';

import type { BeaconLineType } from './BeaconLineTypeEnum';
import type { BeaconType } from './BeaconTypeEnum';
import type { FileFlag } from './FileFlagEnum';
import type { GenerationType } from './GenerationTypeEnum';
import type { LogType } from './LogTypeEnum';
import type { MitreTechniques } from './MitreTechniquesEnum';
import type { ParsingStatus } from './ParsingStatusEnum';
import type { ServerType } from './ServerTypeEnum';
import type { SortDirection } from './SortDirectionEnum';
import type { SortOption } from './SortOptionEnum';
import type { SortOptionComments } from './SortOptionCommentsEnum';

export type AnonymizationInput = {
	findReplace?: FindReplaceInput[];
	removeHidden?: boolean;
	removeKeystrokes?: boolean;
	removePasswordsHashes?: boolean;
	removeScreenshots?: boolean;
	replaceDomainsAndIps?: boolean;
	replaceHostnames?: boolean;
	replaceUsernames?: boolean;
};
export type FindReplaceInput = {
	find?: string;
	replace?: string;
};
export type SortType = {
	direction?: SortDirection;
	sortBy?: SortOption;
};
export type SortTypeComments = {
	direction?: SortDirection;
	sortBy?: SortOptionComments;
};
/* The TypeScript type that explicits the refs to other models in order to prevent a circular refs issue */

type Refs = {
	annotations: ObservableMap<string, AnnotationModel>;
	beacons: ObservableMap<string, BeaconModel>;
	beaconMetas: ObservableMap<string, BeaconMetaModel>;
	campaigns: ObservableMap<string, CampaignModel>;
	commands: ObservableMap<string, CommandModel>;
	commandGroups: ObservableMap<string, CommandGroupModel>;
	commandTypeCounts: ObservableMap<string, CommandTypeCountModel>;
	files: ObservableMap<string, FileModel>;
	globalOperators: ObservableMap<string, GlobalOperatorModel>;
	hosts: ObservableMap<string, HostModel>;
	hostMetas: ObservableMap<string, HostMetaModel>;
	images: ObservableMap<string, ImageModel>;
	links: ObservableMap<string, LinkModel>;
	logEntries: ObservableMap<string, LogEntryModel>;
	operators: ObservableMap<string, OperatorModel>;
	presentationCommandGroups: ObservableMap<string, PresentationCommandGroupModel>;
	presentationItems: ObservableMap<string, PresentationItemModel>;
	servers: ObservableMap<string, ServerModel>;
	serverMetas: ObservableMap<string, ServerMetaModel>;
	tags: ObservableMap<string, TagModel>;
};

/**
 * Enums for the names of base graphql actions
 */
export enum RootStoreBaseQueries {
	queryAnnotation = 'queryAnnotation',
	queryAnnotations = 'queryAnnotations',
	queryBeacons = 'queryBeacons',
	queryCampaign = 'queryCampaign',
	queryCampaigns = 'queryCampaigns',
	queryCommandGroup = 'queryCommandGroup',
	queryCommandGroupIds = 'queryCommandGroupIds',
	queryCommandGroups = 'queryCommandGroups',
	queryCommandIds = 'queryCommandIds',
	queryCommandTypes = 'queryCommandTypes',
	queryCommands = 'queryCommands',
	queryFiles = 'queryFiles',
	queryGlobalOperators = 'queryGlobalOperators',
	queryHosts = 'queryHosts',
	queryImages = 'queryImages',
	queryLinks = 'queryLinks',
	queryLogs = 'queryLogs',
	queryLogsByBeaconId = 'queryLogsByBeaconId',
	queryOperators = 'queryOperators',
	queryParsingProgress = 'queryParsingProgress',
	queryPresentationItems = 'queryPresentationItems',
	querySearchAnnotations = 'querySearchAnnotations',
	querySearchCommands = 'querySearchCommands',
	queryServers = 'queryServers',
	queryTags = 'queryTags',
	queryTimeline = 'queryTimeline',
}
export enum RootStoreBaseMutations {
	mutateAddAnnotationToCommandGroup = 'mutateAddAnnotationToCommandGroup',
	mutateAddCommandGroupAnnotation = 'mutateAddCommandGroupAnnotation',
	mutateAddCommandToCommandGroup = 'mutateAddCommandToCommandGroup',
	mutateAddLocalServerFolder = 'mutateAddLocalServerFolder',
	mutateAnonymizeCampaign = 'mutateAnonymizeCampaign',
	mutateCreateCampaign = 'mutateCreateCampaign',
	mutateCreateGlobalOperator = 'mutateCreateGlobalOperator',
	mutateCreateLink = 'mutateCreateLink',
	mutateDeleteAnnotation = 'mutateDeleteAnnotation',
	mutateDeleteCampaign = 'mutateDeleteCampaign',
	mutateDeleteLink = 'mutateDeleteLink',
	mutateEditLink = 'mutateEditLink',
	mutateRenameCampaign = 'mutateRenameCampaign',
	mutateServersParse = 'mutateServersParse',
	mutateToggleBeaconHidden = 'mutateToggleBeaconHidden',
	mutateToggleHostHidden = 'mutateToggleHostHidden',
	mutateToggleServerHidden = 'mutateToggleServerHidden',
	mutateUpdateAnnotation = 'mutateUpdateAnnotation',
	mutateUpdateBeaconMetadata = 'mutateUpdateBeaconMetadata',
	mutateUpdateHostMetadata = 'mutateUpdateHostMetadata',
	mutateUpdateServerMetadata = 'mutateUpdateServerMetadata',
}

/**
 * Store, managing, among others, all the objects received through graphQL
 */
export class RootStoreBase extends ExtendedModel(
	createMKGQLStore<AbstractModelClass<MKGQLStore>>(
		[
			['Annotation', () => AnnotationModel],
			['Beacon', () => BeaconModel],
			['BeaconMeta', () => BeaconMetaModel],
			['Campaign', () => CampaignModel],
			['Command', () => CommandModel],
			['CommandGroup', () => CommandGroupModel],
			['CommandTypeCount', () => CommandTypeCountModel],
			['File', () => FileModel],
			['GlobalOperator', () => GlobalOperatorModel],
			['Host', () => HostModel],
			['HostMeta', () => HostMetaModel],
			['Image', () => ImageModel],
			['Link', () => LinkModel],
			['LogEntry', () => LogEntryModel],
			['Operator', () => OperatorModel],
			['ParsingProgress', () => ParsingProgressModel],
			['PresentationCommandGroup', () => PresentationCommandGroupModel],
			['PresentationItem', () => PresentationItemModel],
			['Server', () => ServerModel],
			['ServerMeta', () => ServerMetaModel],
			['ServerParsingProgress', () => ServerParsingProgressModel],
			['Tag', () => TagModel],
			['Timeline', () => TimelineModel],
			['TimelineBucket', () => TimelineBucketModel],
			['TimelineCommandCountTuple', () => TimelineCommandCountTupleModel],
		],
		[
			'Annotation',
			'Beacon',
			'BeaconMeta',
			'Campaign',
			'Command',
			'CommandGroup',
			'CommandTypeCount',
			'File',
			'GlobalOperator',
			'Host',
			'HostMeta',
			'Image',
			'Link',
			'LogEntry',
			'Operator',
			'PresentationCommandGroup',
			'PresentationItem',
			'Server',
			'ServerMeta',
			'Tag',
		],
		'js'
	),
	{
		annotations: prop(() => objectMap<AnnotationModel>()),
		beacons: prop(() => objectMap<BeaconModel>()),
		beaconMetas: prop(() => objectMap<BeaconMetaModel>()),
		campaigns: prop(() => objectMap<CampaignModel>()),
		commands: prop(() => objectMap<CommandModel>()),
		commandGroups: prop(() => objectMap<CommandGroupModel>()),
		commandTypeCounts: prop(() => objectMap<CommandTypeCountModel>()),
		files: prop(() => objectMap<FileModel>()),
		globalOperators: prop(() => objectMap<GlobalOperatorModel>()),
		hosts: prop(() => objectMap<HostModel>()),
		hostMetas: prop(() => objectMap<HostMetaModel>()),
		images: prop(() => objectMap<ImageModel>()),
		links: prop(() => objectMap<LinkModel>()),
		logEntries: prop(() => objectMap<LogEntryModel>()),
		operators: prop(() => objectMap<OperatorModel>()),
		presentationCommandGroups: prop(() => objectMap<PresentationCommandGroupModel>()),
		presentationItems: prop(() => objectMap<PresentationItemModel>()),
		servers: prop(() => objectMap<ServerModel>()),
		serverMetas: prop(() => objectMap<ServerMetaModel>()),
		tags: prop(() => objectMap<TagModel>()),
		mergeHelper: prop<MergeHelper>(() => new MergeHelper({})),
	}
) {
	// Get an annotation
	@modelAction queryAnnotation(
		variables: { annotationId: string; campaignId: string },
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ annotation: AnnotationModel }>(
			`query annotation($annotationId: String!, $campaignId: String!) { annotation(annotationId: $annotationId, campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all annotations for a project
	@modelAction queryAnnotations(
		variables: { campaignId: string },
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ annotations: AnnotationModel[] }>(
			`query annotations($campaignId: String!) { annotations(campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all the beacons for a project
	@modelAction queryBeacons(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof BeaconModelSelector) => typeof BeaconModelSelector) = beaconModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ beacons: BeaconModel[] }>(
			`query beacons($campaignId: String!, $hidden: Boolean) { beacons(campaignId: $campaignId, hidden: $hidden) {
        ${typeof resultSelector === 'function' ? resultSelector(BeaconModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get a single campaign
	@modelAction queryCampaign(
		variables: { campaignId: string },
		resultSelector:
			| string
			| ((qb: typeof CampaignModelSelector) => typeof CampaignModelSelector) = campaignModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ campaign: CampaignModel }>(
			`query campaign($campaignId: String!) { campaign(campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(CampaignModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get the list of Campaigns
	@modelAction queryCampaigns(
		variables?: {},
		resultSelector:
			| string
			| ((qb: typeof CampaignModelSelector) => typeof CampaignModelSelector) = campaignModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ campaigns: CampaignModel[] }>(
			`query campaigns { campaigns {
        ${typeof resultSelector === 'function' ? resultSelector(CampaignModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get command group by id
	@modelAction queryCommandGroup(
		variables: { campaignId: string; commandGroupId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((
					qb: typeof CommandGroupModelSelector
			  ) => typeof CommandGroupModelSelector) = commandGroupModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commandGroup: CommandGroupModel }>(
			`query commandGroup($campaignId: String!, $commandGroupId: String!, $hidden: Boolean) { commandGroup(campaignId: $campaignId, commandGroupId: $commandGroupId, hidden: $hidden) {
        ${typeof resultSelector === 'function' ? resultSelector(CommandGroupModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get command groups ids
	@modelAction queryCommandGroupIds(
		variables: {
			beaconId?: string;
			campaignId: string;
			commandGroupIds?: string[];
			commandIds?: string[];
			commandType?: string;
			hidden?: boolean;
			hostId?: string;
			operatorId?: string;
			sort?: SortTypeComments;
		},
		_?: any,
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commandGroupIds: any }>(
			`query commandGroupIds($beaconId: String, $campaignId: String!, $commandGroupIds: [String!], $commandIds: [String!], $commandType: String, $hidden: Boolean, $hostId: String, $operatorId: String, $sort: SortTypeComments) { commandGroupIds(beaconId: $beaconId, campaignId: $campaignId, commandGroupIds: $commandGroupIds, commandIds: $commandIds, commandType: $commandType, hidden: $hidden, hostId: $hostId, operatorId: $operatorId, sort: $sort)  }`,
			variables,
			options,
			!!clean
		);
	}
	// Get command groups by ids
	@modelAction queryCommandGroups(
		variables: {
			beaconId?: string;
			campaignId: string;
			commandGroupIds?: string[];
			commandIds?: string[];
			commandType?: string;
			hidden?: boolean;
			hostId?: string;
			operatorId?: string;
			sort?: SortTypeComments;
		},
		resultSelector:
			| string
			| ((
					qb: typeof CommandGroupModelSelector
			  ) => typeof CommandGroupModelSelector) = commandGroupModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commandGroups: CommandGroupModel[] }>(
			`query commandGroups($beaconId: String, $campaignId: String!, $commandGroupIds: [String!], $commandIds: [String!], $commandType: String, $hidden: Boolean, $hostId: String, $operatorId: String, $sort: SortTypeComments) { commandGroups(beaconId: $beaconId, campaignId: $campaignId, commandGroupIds: $commandGroupIds, commandIds: $commandIds, commandType: $commandType, hidden: $hidden, hostId: $hostId, operatorId: $operatorId, sort: $sort) {
        ${typeof resultSelector === 'function' ? resultSelector(CommandGroupModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get commands by ids
	@modelAction queryCommandIds(
		variables: {
			beaconId?: string;
			campaignId: string;
			commandIds?: string[];
			commandType?: string;
			hidden?: boolean;
			hostId?: string;
			operatorId?: string;
			sort?: SortType;
		},
		_?: any,
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commandIds: any }>(
			`query commandIds($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hidden: Boolean, $hostId: String, $operatorId: String, $sort: SortType) { commandIds(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hidden: $hidden, hostId: $hostId, operatorId: $operatorId, sort: $sort)  }`,
			variables,
			options,
			!!clean
		);
	}
	// Get command types
	@modelAction queryCommandTypes(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((
					qb: typeof CommandTypeCountModelSelector
			  ) => typeof CommandTypeCountModelSelector) = commandTypeCountModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commandTypes: CommandTypeCountModel[] }>(
			`query commandTypes($campaignId: String!, $hidden: Boolean) { commandTypes(campaignId: $campaignId, hidden: $hidden) {
        ${
					typeof resultSelector === 'function'
						? resultSelector(CommandTypeCountModelSelector).toString()
						: resultSelector
				}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get commands by ids
	@modelAction queryCommands(
		variables: {
			beaconId?: string;
			campaignId: string;
			commandIds?: string[];
			commandType?: string;
			hidden?: boolean;
			hostId?: string;
			operatorId?: string;
			sort?: SortType;
		},
		resultSelector:
			| string
			| ((qb: typeof CommandModelSelector) => typeof CommandModelSelector) = commandModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ commands: CommandModel[] }>(
			`query commands($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hidden: Boolean, $hostId: String, $operatorId: String, $sort: SortType) { commands(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hidden: $hidden, hostId: $hostId, operatorId: $operatorId, sort: $sort) {
        ${typeof resultSelector === 'function' ? resultSelector(CommandModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get images by ids
	@modelAction queryFiles(
		variables: { beaconId?: string; campaignId: string; hostId?: string },
		resultSelector:
			| string
			| ((qb: typeof FileModelSelector) => typeof FileModelSelector) = fileModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ files: FileModel[] }>(
			`query files($beaconId: String, $campaignId: String!, $hostId: String) { files(beaconId: $beaconId, campaignId: $campaignId, hostId: $hostId) {
        ${typeof resultSelector === 'function' ? resultSelector(FileModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all the operators for all campaigns
	@modelAction queryGlobalOperators(
		variables: { password: string },
		resultSelector:
			| string
			| ((
					qb: typeof GlobalOperatorModelSelector
			  ) => typeof GlobalOperatorModelSelector) = globalOperatorModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ globalOperators: GlobalOperatorModel[] }>(
			`query globalOperators($password: String!) { globalOperators(password: $password) {
        ${
					typeof resultSelector === 'function' ? resultSelector(GlobalOperatorModelSelector).toString() : resultSelector
				}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all the hosts for a project
	@modelAction queryHosts(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof HostModelSelector) => typeof HostModelSelector) = hostModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ hosts: HostModel[] }>(
			`query hosts($campaignId: String!, $hidden: Boolean) { hosts(campaignId: $campaignId, hidden: $hidden) {
        ${typeof resultSelector === 'function' ? resultSelector(HostModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get images by ids
	@modelAction queryImages(
		variables: { beaconId?: string; campaignId: string; hostId?: string },
		resultSelector:
			| string
			| ((qb: typeof ImageModelSelector) => typeof ImageModelSelector) = imageModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ images: ImageModel[] }>(
			`query images($beaconId: String, $campaignId: String!, $hostId: String) { images(beaconId: $beaconId, campaignId: $campaignId, hostId: $hostId) {
        ${typeof resultSelector === 'function' ? resultSelector(ImageModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all links
	@modelAction queryLinks(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof LinkModelSelector) => typeof LinkModelSelector) = linkModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ links: LinkModel[] }>(
			`query links($campaignId: String!, $hidden: Boolean) { links(campaignId: $campaignId, hidden: $hidden) {
        ${typeof resultSelector === 'function' ? resultSelector(LinkModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get log entries by ids
	@modelAction queryLogs(
		variables: { beaconId?: string; campaignId: string; hostId?: string },
		resultSelector:
			| string
			| ((qb: typeof LogEntryModelSelector) => typeof LogEntryModelSelector) = logEntryModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ logs: LogEntryModel[] }>(
			`query logs($beaconId: String, $campaignId: String!, $hostId: String) { logs(beaconId: $beaconId, campaignId: $campaignId, hostId: $hostId) {
        ${typeof resultSelector === 'function' ? resultSelector(LogEntryModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get logs from beacon sorted by time. The goal is to be able to re-create the full log for that beacon.
	@modelAction queryLogsByBeaconId(
		variables: { beaconId: string; campaignId: string },
		resultSelector:
			| string
			| ((qb: typeof LogEntryModelSelector) => typeof LogEntryModelSelector) = logEntryModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ logsByBeaconId: LogEntryModel[] }>(
			`query logsByBeaconId($beaconId: String!, $campaignId: String!) { logsByBeaconId(beaconId: $beaconId, campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(LogEntryModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all the operators for a project
	@modelAction queryOperators(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof OperatorModelSelector) => typeof OperatorModelSelector) = operatorModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ operators: OperatorModel[] }>(
			`query operators($campaignId: String!, $hidden: Boolean) { operators(campaignId: $campaignId, hidden: $hidden) {
        ${typeof resultSelector === 'function' ? resultSelector(OperatorModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get the current progress of the parser
	@modelAction queryParsingProgress(
		variables?: {},
		resultSelector:
			| string
			| ((
					qb: typeof ParsingProgressModelSelector
			  ) => typeof ParsingProgressModelSelector) = parsingProgressModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ parsingProgress: ParsingProgressModel }>(
			`query parsingProgress { parsingProgress {
        ${
					typeof resultSelector === 'function'
						? resultSelector(ParsingProgressModelSelector).toString()
						: resultSelector
				}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get categories for presentation mode
	@modelAction queryPresentationItems(
		variables: { campaignId: string; hidden?: boolean },
		resultSelector:
			| string
			| ((
					qb: typeof PresentationItemModelSelector
			  ) => typeof PresentationItemModelSelector) = presentationItemModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ presentationItems: PresentationItemModel[] }>(
			`query presentationItems($campaignId: String!, $hidden: Boolean) { presentationItems(campaignId: $campaignId, hidden: $hidden) {
        ${
					typeof resultSelector === 'function'
						? resultSelector(PresentationItemModelSelector).toString()
						: resultSelector
				}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Search Annotations from textQuery
	@modelAction querySearchAnnotations(
		variables: { campaignId: string; hidden?: boolean; searchQuery: string },
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ searchAnnotations: AnnotationModel[] }>(
			`query searchAnnotations($campaignId: String!, $hidden: Boolean, $searchQuery: String!) { searchAnnotations(campaignId: $campaignId, hidden: $hidden, searchQuery: $searchQuery) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Search Commands from textQuery
	@modelAction querySearchCommands(
		variables: { campaignId: string; hidden?: boolean; searchQuery: string },
		resultSelector:
			| string
			| ((qb: typeof CommandModelSelector) => typeof CommandModelSelector) = commandModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ searchCommands: CommandModel[] }>(
			`query searchCommands($campaignId: String!, $hidden: Boolean, $searchQuery: String!) { searchCommands(campaignId: $campaignId, hidden: $hidden, searchQuery: $searchQuery) {
        ${typeof resultSelector === 'function' ? resultSelector(CommandModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get the list of servers for a project
	@modelAction queryServers(
		variables: { campaignId: string; hidden?: boolean; username: string },
		resultSelector:
			| string
			| ((qb: typeof ServerModelSelector) => typeof ServerModelSelector) = serverModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ servers: ServerModel[] }>(
			`query servers($campaignId: String!, $hidden: Boolean, $username: String!) { servers(campaignId: $campaignId, hidden: $hidden, username: $username) {
        ${typeof resultSelector === 'function' ? resultSelector(ServerModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get all tags for a project
	@modelAction queryTags(
		variables: { campaignId: string },
		resultSelector: string | ((qb: typeof TagModelSelector) => typeof TagModelSelector) = tagModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ tags: TagModel[] }>(
			`query tags($campaignId: String!) { tags(campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(TagModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Get a bucketed summary of active beacons and links with commands
	@modelAction queryTimeline(
		variables: {
			campaignId: string;
			hidden?: boolean;
			suggestedBuckets?: number;
			suggestedEndTime?: any;
			suggestedStartTime?: any;
		},
		resultSelector:
			| string
			| ((qb: typeof TimelineModelSelector) => typeof TimelineModelSelector) = timelineModelPrimitives.toString(),
		options: QueryOptions = {},
		clean?: boolean
	) {
		return this.query<{ timeline: TimelineModel }>(
			`query timeline($campaignId: String!, $hidden: Boolean, $suggestedBuckets: Float, $suggestedEndTime: DateTime, $suggestedStartTime: DateTime) { timeline(campaignId: $campaignId, hidden: $hidden, suggestedBuckets: $suggestedBuckets, suggestedEndTime: $suggestedEndTime, suggestedStartTime: $suggestedStartTime) {
        ${typeof resultSelector === 'function' ? resultSelector(TimelineModelSelector).toString() : resultSelector}
      } }`,
			variables,
			options,
			!!clean
		);
	}
	// Add an Annotation to an existing CommandGroup
	@modelAction mutateAddAnnotationToCommandGroup(
		variables: {
			campaignId: string;
			commandGroupId: string;
			favorite?: boolean;
			tags: string[];
			text: string;
			user: string;
		},
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ addAnnotationToCommandGroup: AnnotationModel }>(
			`mutation addAnnotationToCommandGroup($campaignId: String!, $commandGroupId: String!, $favorite: Boolean, $tags: [String!]!, $text: String!, $user: String!) { addAnnotationToCommandGroup(campaignId: $campaignId, commandGroupId: $commandGroupId, favorite: $favorite, tags: $tags, text: $text, user: $user) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Create a CommandGroup annotation
	@modelAction mutateAddCommandGroupAnnotation(
		variables: {
			campaignId: string;
			commandIds: string[];
			favorite?: boolean;
			tags: string[];
			text: string;
			user: string;
		},
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ addCommandGroupAnnotation: AnnotationModel }>(
			`mutation addCommandGroupAnnotation($campaignId: String!, $commandIds: [String!]!, $favorite: Boolean, $tags: [String!]!, $text: String!, $user: String!) { addCommandGroupAnnotation(campaignId: $campaignId, commandIds: $commandIds, favorite: $favorite, tags: $tags, text: $text, user: $user) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Add an Command to an existing CommandGroup
	@modelAction mutateAddCommandToCommandGroup(
		variables: { campaignId: string; commandGroupId: string; commandId: string },
		resultSelector:
			| string
			| ((
					qb: typeof CommandGroupModelSelector
			  ) => typeof CommandGroupModelSelector) = commandGroupModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ addCommandToCommandGroup: CommandGroupModel }>(
			`mutation addCommandToCommandGroup($campaignId: String!, $commandGroupId: String!, $commandId: String!) { addCommandToCommandGroup(campaignId: $campaignId, commandGroupId: $commandGroupId, commandId: $commandId) {
        ${typeof resultSelector === 'function' ? resultSelector(CommandGroupModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Add a server from folder already accessible from the server
	@modelAction mutateAddLocalServerFolder(
		variables: { campaignId: string; name: string; path: string },
		resultSelector:
			| string
			| ((qb: typeof ServerModelSelector) => typeof ServerModelSelector) = serverModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ addLocalServerFolder: ServerModel }>(
			`mutation addLocalServerFolder($campaignId: String!, $name: String!, $path: String!) { addLocalServerFolder(campaignId: $campaignId, name: $name, path: $path) {
        ${typeof resultSelector === 'function' ? resultSelector(ServerModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Anonymize campaign for export
	@modelAction mutateAnonymizeCampaign(
		variables: { anonymizeOptions: AnonymizationInput; campaignId: string },
		_?: any,
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ anonymizeCampaign: string }>(
			`mutation anonymizeCampaign($anonymizeOptions: AnonymizationInput!, $campaignId: String!) { anonymizeCampaign(anonymizeOptions: $anonymizeOptions, campaignId: $campaignId)  }`,
			variables,
			optimisticUpdate
		);
	}
	// Create a new Campaign
	@modelAction mutateCreateCampaign(
		variables: { creatorName: string; name: string },
		resultSelector:
			| string
			| ((qb: typeof CampaignModelSelector) => typeof CampaignModelSelector) = campaignModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ createCampaign: CampaignModel }>(
			`mutation createCampaign($creatorName: String!, $name: String!) { createCampaign(creatorName: $creatorName, name: $name) {
        ${typeof resultSelector === 'function' ? resultSelector(CampaignModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Create a global user
	@modelAction mutateCreateGlobalOperator(
		variables: { password: string; username: string },
		resultSelector:
			| string
			| ((
					qb: typeof GlobalOperatorModelSelector
			  ) => typeof GlobalOperatorModelSelector) = globalOperatorModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ createGlobalOperator: GlobalOperatorModel }>(
			`mutation createGlobalOperator($password: String!, $username: String!) { createGlobalOperator(password: $password, username: $username) {
        ${
					typeof resultSelector === 'function' ? resultSelector(GlobalOperatorModelSelector).toString() : resultSelector
				}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Create a new link between two beacons
	@modelAction mutateCreateLink(
		variables: { campaignId: string; commandId: string; destinationId: string; name: string; originId: string },
		resultSelector:
			| string
			| ((qb: typeof LinkModelSelector) => typeof LinkModelSelector) = linkModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ createLink: LinkModel }>(
			`mutation createLink($campaignId: String!, $commandId: String!, $destinationId: String!, $name: String!, $originId: String!) { createLink(campaignId: $campaignId, commandId: $commandId, destinationId: $destinationId, name: $name, originId: $originId) {
        ${typeof resultSelector === 'function' ? resultSelector(LinkModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Delete existing Annotation
	@modelAction mutateDeleteAnnotation(
		variables: { annotationId: string; campaignId: string },
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ deleteAnnotation: AnnotationModel }>(
			`mutation deleteAnnotation($annotationId: String!, $campaignId: String!) { deleteAnnotation(annotationId: $annotationId, campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Delete a Campaign by id
	@modelAction mutateDeleteCampaign(variables: { campaignId: string }, _?: any, optimisticUpdate?: () => void) {
		return this.mutate<{ deleteCampaign: boolean }>(
			`mutation deleteCampaign($campaignId: String!) { deleteCampaign(campaignId: $campaignId)  }`,
			variables,
			optimisticUpdate
		);
	}
	// Delete a link
	@modelAction mutateDeleteLink(
		variables: { campaignId: string; id: string },
		resultSelector:
			| string
			| ((qb: typeof LinkModelSelector) => typeof LinkModelSelector) = linkModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ deleteLink: LinkModel }>(
			`mutation deleteLink($campaignId: String!, $id: String!) { deleteLink(campaignId: $campaignId, id: $id) {
        ${typeof resultSelector === 'function' ? resultSelector(LinkModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Edit a link
	@modelAction mutateEditLink(
		variables: {
			campaignId: string;
			commandId: string;
			destinationId: string;
			id: string;
			name: string;
			originId: string;
		},
		resultSelector:
			| string
			| ((qb: typeof LinkModelSelector) => typeof LinkModelSelector) = linkModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ editLink: LinkModel }>(
			`mutation editLink($campaignId: String!, $commandId: String!, $destinationId: String!, $id: String!, $name: String!, $originId: String!) { editLink(campaignId: $campaignId, commandId: $commandId, destinationId: $destinationId, id: $id, name: $name, originId: $originId) {
        ${typeof resultSelector === 'function' ? resultSelector(LinkModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Rename existing Campaign
	@modelAction mutateRenameCampaign(
		variables: { campaignId: string; name: string },
		resultSelector:
			| string
			| ((qb: typeof CampaignModelSelector) => typeof CampaignModelSelector) = campaignModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ renameCampaign: CampaignModel }>(
			`mutation renameCampaign($campaignId: String!, $name: String!) { renameCampaign(campaignId: $campaignId, name: $name) {
        ${typeof resultSelector === 'function' ? resultSelector(CampaignModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	@modelAction mutateServersParse(variables: { campaignId: string }, _?: any, optimisticUpdate?: () => void) {
		return this.mutate<{ serversParse: boolean }>(
			`mutation serversParse($campaignId: String!) { serversParse(campaignId: $campaignId)  }`,
			variables,
			optimisticUpdate
		);
	}
	// Toggle beacon hidden state
	@modelAction mutateToggleBeaconHidden(
		variables: { beaconId?: string; beaconIds?: string[]; campaignId: string; setHidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof BeaconModelSelector) => typeof BeaconModelSelector) = beaconModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ toggleBeaconHidden: BeaconModel }>(
			`mutation toggleBeaconHidden($beaconId: String, $beaconIds: [String!], $campaignId: String!, $setHidden: Boolean) { toggleBeaconHidden(beaconId: $beaconId, beaconIds: $beaconIds, campaignId: $campaignId, setHidden: $setHidden) {
        ${typeof resultSelector === 'function' ? resultSelector(BeaconModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Toggle host hidden state
	@modelAction mutateToggleHostHidden(
		variables: { campaignId: string; hostId?: string; hostIds?: string[]; setHidden?: boolean },
		resultSelector:
			| string
			| ((qb: typeof HostModelSelector) => typeof HostModelSelector) = hostModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ toggleHostHidden: HostModel }>(
			`mutation toggleHostHidden($campaignId: String!, $hostId: String, $hostIds: [String!], $setHidden: Boolean) { toggleHostHidden(campaignId: $campaignId, hostId: $hostId, hostIds: $hostIds, setHidden: $setHidden) {
        ${typeof resultSelector === 'function' ? resultSelector(HostModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Toggle server hidden state
	@modelAction mutateToggleServerHidden(
		variables: { campaignId: string; serverId: string },
		resultSelector:
			| string
			| ((qb: typeof ServerModelSelector) => typeof ServerModelSelector) = serverModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ toggleServerHidden: ServerModel }>(
			`mutation toggleServerHidden($campaignId: String!, $serverId: String!) { toggleServerHidden(campaignId: $campaignId, serverId: $serverId) {
        ${typeof resultSelector === 'function' ? resultSelector(ServerModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Update existing Annotation
	@modelAction mutateUpdateAnnotation(
		variables: {
			annotationId: string;
			campaignId: string;
			favorite?: boolean;
			tags: string[];
			text: string;
			user: string;
		},
		resultSelector:
			| string
			| ((qb: typeof AnnotationModelSelector) => typeof AnnotationModelSelector) = annotationModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ updateAnnotation: AnnotationModel }>(
			`mutation updateAnnotation($annotationId: String!, $campaignId: String!, $favorite: Boolean, $tags: [String!]!, $text: String!, $user: String!) { updateAnnotation(annotationId: $annotationId, campaignId: $campaignId, favorite: $favorite, tags: $tags, text: $text, user: $user) {
        ${typeof resultSelector === 'function' ? resultSelector(AnnotationModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Update existing Beacon Metadata
	@modelAction mutateUpdateBeaconMetadata(
		variables: {
			beaconDisplayName?: string;
			beaconId: string;
			beaconTimeOfDeath?: any;
			beaconType?: BeaconType;
			campaignId: string;
		},
		resultSelector:
			| string
			| ((qb: typeof BeaconModelSelector) => typeof BeaconModelSelector) = beaconModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ updateBeaconMetadata: BeaconModel }>(
			`mutation updateBeaconMetadata($beaconDisplayName: String, $beaconId: String!, $beaconTimeOfDeath: DateTime, $beaconType: BeaconType, $campaignId: String!) { updateBeaconMetadata(beaconDisplayName: $beaconDisplayName, beaconId: $beaconId, beaconTimeOfDeath: $beaconTimeOfDeath, beaconType: $beaconType, campaignId: $campaignId) {
        ${typeof resultSelector === 'function' ? resultSelector(BeaconModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Update existing Host Display Name
	@modelAction mutateUpdateHostMetadata(
		variables: { campaignId: string; hostDisplayName: string; hostId: string },
		resultSelector:
			| string
			| ((qb: typeof HostModelSelector) => typeof HostModelSelector) = hostModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ updateHostMetadata: HostModel }>(
			`mutation updateHostMetadata($campaignId: String!, $hostDisplayName: String!, $hostId: String!) { updateHostMetadata(campaignId: $campaignId, hostDisplayName: $hostDisplayName, hostId: $hostId) {
        ${typeof resultSelector === 'function' ? resultSelector(HostModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
	// Update existing Server name
	@modelAction mutateUpdateServerMetadata(
		variables: { campaignId: string; serverDisplayName?: string; serverId: string; serverType?: ServerType },
		resultSelector:
			| string
			| ((qb: typeof ServerModelSelector) => typeof ServerModelSelector) = serverModelPrimitives.toString(),
		optimisticUpdate?: () => void
	) {
		return this.mutate<{ updateServerMetadata: ServerModel }>(
			`mutation updateServerMetadata($campaignId: String!, $serverDisplayName: String, $serverId: String!, $serverType: ServerType) { updateServerMetadata(campaignId: $campaignId, serverDisplayName: $serverDisplayName, serverId: $serverId, serverType: $serverType) {
        ${typeof resultSelector === 'function' ? resultSelector(ServerModelSelector).toString() : resultSelector}
      } }`,
			variables,
			optimisticUpdate
		);
	}
}
function resolve(path, obj = {}, separator = '.') {
	const properties = Array.isArray(path) ? path : path.split(separator);
	return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export const appRef = <T extends object>(storeInstance, modelTypeId, path) =>
	customRef<T>(`RootStore/${modelTypeId}`, {
		resolve: (ref: Ref<any>) =>
			resolve(
				path,
				findParent<typeof storeInstance>(ref, (n) => n instanceof storeInstance)
			)?.get(ref?.id),
		onResolvedValueChange(ref, newItem, oldItem) {
			if (oldItem && !newItem) detach(ref);
		},
	});

export const annotationsRef = appRef<AnnotationModel>(RootStoreBase, 'Annotation', 'annotations');

export const beaconsRef = appRef<BeaconModel>(RootStoreBase, 'Beacon', 'beacons');

export const beaconMetasRef = appRef<BeaconMetaModel>(RootStoreBase, 'BeaconMeta', 'beaconMetas');

export const campaignsRef = appRef<CampaignModel>(RootStoreBase, 'Campaign', 'campaigns');

export const commandsRef = appRef<CommandModel>(RootStoreBase, 'Command', 'commands');

export const commandGroupsRef = appRef<CommandGroupModel>(RootStoreBase, 'CommandGroup', 'commandGroups');

export const commandTypeCountsRef = appRef<CommandTypeCountModel>(
	RootStoreBase,
	'CommandTypeCount',
	'commandTypeCounts'
);

export const filesRef = appRef<FileModel>(RootStoreBase, 'File', 'files');

export const globalOperatorsRef = appRef<GlobalOperatorModel>(RootStoreBase, 'GlobalOperator', 'globalOperators');

export const hostsRef = appRef<HostModel>(RootStoreBase, 'Host', 'hosts');

export const hostMetasRef = appRef<HostMetaModel>(RootStoreBase, 'HostMeta', 'hostMetas');

export const imagesRef = appRef<ImageModel>(RootStoreBase, 'Image', 'images');

export const linksRef = appRef<LinkModel>(RootStoreBase, 'Link', 'links');

export const logEntriesRef = appRef<LogEntryModel>(RootStoreBase, 'LogEntry', 'logEntries');

export const operatorsRef = appRef<OperatorModel>(RootStoreBase, 'Operator', 'operators');

export const presentationCommandGroupsRef = appRef<PresentationCommandGroupModel>(
	RootStoreBase,
	'PresentationCommandGroup',
	'presentationCommandGroups'
);

export const presentationItemsRef = appRef<PresentationItemModel>(
	RootStoreBase,
	'PresentationItem',
	'presentationItems'
);

export const serversRef = appRef<ServerModel>(RootStoreBase, 'Server', 'servers');

export const serverMetasRef = appRef<ServerMetaModel>(RootStoreBase, 'ServerMeta', 'serverMetas');

export const tagsRef = appRef<TagModel>(RootStoreBase, 'Tag', 'tags');

export const rootRefs = {
	annotations: annotationsRef,
	beacons: beaconsRef,
	beaconMetas: beaconMetasRef,
	campaigns: campaignsRef,
	commands: commandsRef,
	commandGroups: commandGroupsRef,
	commandTypeCounts: commandTypeCountsRef,
	files: filesRef,
	globalOperators: globalOperatorsRef,
	hosts: hostsRef,
	hostMetas: hostMetasRef,
	images: imagesRef,
	links: linksRef,
	logEntries: logEntriesRef,
	operators: operatorsRef,
	presentationCommandGroups: presentationCommandGroupsRef,
	presentationItems: presentationItemsRef,
	servers: serversRef,
	serverMetas: serverMetasRef,
	tags: tagsRef,
};

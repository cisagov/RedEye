import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any;
};

export type Annotation = {
	__typename: 'Annotation';
	commandGroupId?: Maybe<Scalars['String']>;
	commandIds?: Maybe<Array<Maybe<Scalars['String']>>>;
	date: Scalars['DateTime'];
	favorite: Scalars['Boolean'];
	generation: GenerationType;
	id: Scalars['String'];
	tags?: Maybe<Array<Tag>>;
	text: Scalars['String'];
	user: Scalars['String'];
};

export type AnonymizationInput = {
	findReplace?: InputMaybe<Array<FindReplaceInput>>;
	removeHidden?: InputMaybe<Scalars['Boolean']>;
	removeKeystrokes?: InputMaybe<Scalars['Boolean']>;
	removePasswordsHashes?: InputMaybe<Scalars['Boolean']>;
	removeScreenshots?: InputMaybe<Scalars['Boolean']>;
	replaceDomainsAndIps?: InputMaybe<Scalars['Boolean']>;
	replaceHostnames?: InputMaybe<Scalars['Boolean']>;
	replaceUsernames?: InputMaybe<Scalars['Boolean']>;
};

export type Beacon = {
	__typename: 'Beacon';
	/** The name Cobalt Strike gives the beacon or the Cobalt Strike server name. Not _necessarily_ unique across a campaign but is unique to a server */
	beaconName: Scalars['String'];
	commandsCount: Scalars['Float'];
	displayName?: Maybe<Scalars['String']>;
	hidden?: Maybe<Scalars['Boolean']>;
	host?: Maybe<Host>;
	id: Scalars['String'];
	logsCount: Scalars['Float'];
	meta: Array<BeaconMeta>;
	mitreTechniques?: Maybe<Array<Maybe<MitreTechniques>>>;
	serverId: Scalars['String'];
};

/** The type of line in a beacon log */
export enum BeaconLineType {
	CHECKIN = 'CHECKIN',
	ERROR = 'ERROR',
	INDICATOR = 'INDICATOR',
	INPUT = 'INPUT',
	METADATA = 'METADATA',
	MODE = 'MODE',
	OUTPUT = 'OUTPUT',
	TASK = 'TASK',
}

/** Data derived from the Beacon metadata line */
export type BeaconMeta = {
	__typename: 'BeaconMeta';
	/** The time that the last command was run */
	endTime?: Maybe<Scalars['DateTime']>;
	id: Scalars['String'];
	/** The IP of the host at the time of the metadata line */
	ip?: Maybe<Scalars['String']>;
	/** Process Identifier the beacon is running on */
	pid?: Maybe<Scalars['Int']>;
	/** The start time of the beacon */
	startTime?: Maybe<Scalars['DateTime']>;
	/** The username the beacon is running under */
	username?: Maybe<Scalars['String']>;
};

export type Campaign = {
	__typename: 'Campaign';
	annotationCount: Scalars['Int'];
	beaconCount: Scalars['Int'];
	bloodStrikeServerCount: Scalars['Int'];
	commandCount: Scalars['Int'];
	computerCount: Scalars['Int'];
	creator?: Maybe<GlobalOperator>;
	firstLogTime?: Maybe<Scalars['DateTime']>;
	id: Scalars['String'];
	lastLogTime?: Maybe<Scalars['DateTime']>;
	lastOpenedBy?: Maybe<GlobalOperator>;
	liveCampaign: Scalars['Boolean'];
	name: Scalars['String'];
	parsingStatus: ParsingStatus;
};

export type Command = {
	__typename: 'Command';
	attackIds?: Maybe<Array<Scalars['String']>>;
	beacon: Beacon;
	commandFailed: Scalars['Boolean'];
	commandGroups: Array<CommandGroup>;
	id: Scalars['String'];
	input: LogEntry;
	inputText: Scalars['String'];
	mitreTechniques?: Maybe<Array<Maybe<MitreTechniques>>>;
	operator?: Maybe<Operator>;
	output: Array<LogEntry>;
};

export type CommandGroup = {
	__typename: 'CommandGroup';
	annotations: Array<Annotation>;
	commandIds: Array<Scalars['String']>;
	generation: GenerationType;
	id: Scalars['String'];
};

export type CommandTypeCount = {
	__typename: 'CommandTypeCount';
	count: Scalars['Float'];
	id: Scalars['String'];
	text: Scalars['String'];
};

export type File = {
	__typename: 'File';
	dateTime: Scalars['DateTime'];
	fileFlag: FileFlag;
	fileName: Scalars['String'];
	id: Scalars['String'];
	ip?: Maybe<Scalars['String']>;
	location: Scalars['String'];
	/** Generated automatically when using the upload command, the MD5 message-digest algorithm is a widely used hash function producing a 128-bit hash value. */
	md5?: Maybe<Scalars['String']>;
};

/**
 * Designates if this is an upload or download
 *     UPLOAD: File was put on or replace on a target host
 *     DOWNLOAD: File was taken from a target host
 */
export enum FileFlag {
	DOWNLOAD = 'DOWNLOAD',
	UPLOAD = 'UPLOAD',
}

export type FindReplaceInput = {
	find?: InputMaybe<Scalars['String']>;
	replace?: InputMaybe<Scalars['String']>;
};

/** How the entity was generated */
export enum GenerationType {
	MANUAL = 'MANUAL',
	PROCEDURAL = 'PROCEDURAL',
	PROCEDURAL_MODIFIED = 'PROCEDURAL_MODIFIED',
}

export type GlobalOperator = {
	__typename: 'GlobalOperator';
	id: Scalars['String'];
	name: Scalars['String'];
};

export type Host = {
	__typename: 'Host';
	beaconIds: Array<Scalars['String']>;
	cobaltStrikeServer?: Maybe<Scalars['Boolean']>;
	displayName?: Maybe<Scalars['String']>;
	hidden?: Maybe<Scalars['Boolean']>;
	hostName: Scalars['String'];
	id: Scalars['String'];
	meta: Array<HostMeta>;
};

export type HostMeta = {
	__typename: 'HostMeta';
	id: Scalars['String'];
	ip?: Maybe<Scalars['String']>;
	os?: Maybe<Scalars['String']>;
	type?: Maybe<Scalars['String']>;
};

export type Image = {
	__typename: 'Image';
	fileType?: Maybe<Scalars['String']>;
	id: Scalars['String'];
	url?: Maybe<Scalars['String']>;
};

export type Link = {
	__typename: 'Link';
	command?: Maybe<Command>;
	destination?: Maybe<Beacon>;
	endTime?: Maybe<Scalars['DateTime']>;
	id: Scalars['String'];
	origin?: Maybe<Beacon>;
	/** Shouldn't be nullable but it is to handle bad data sets */
	startTime?: Maybe<Scalars['DateTime']>;
};

export type LogEntry = {
	__typename: 'LogEntry';
	beacon?: Maybe<Beacon>;
	/** All lines in a LogEntry */
	blob: Scalars['String'];
	command?: Maybe<Command>;
	dateTime?: Maybe<Scalars['DateTime']>;
	filepath: Scalars['String'];
	id: Scalars['String'];
	lineNumber: Scalars['Float'];
	lineType?: Maybe<BeaconLineType>;
	logType: LogType;
};

/** Basic Log Types based on the filename */
export enum LogType {
	BEACON = 'BEACON',
	DOWNLOAD = 'DOWNLOAD',
	EVENT = 'EVENT',
	KEYSTROKES = 'KEYSTROKES',
	UNKNOWN = 'UNKNOWN',
	WEBLOG = 'WEBLOG',
}

/** High level mitre technique */
export enum MitreTechniques {
	Collection = 'Collection',
	CommandAndControl = 'CommandAndControl',
	CredentialAccess = 'CredentialAccess',
	DefenseEvasion = 'DefenseEvasion',
	Discovery = 'Discovery',
	Execution = 'Execution',
	Exfiltration = 'Exfiltration',
	GoldenTicket = 'GoldenTicket',
	Impact = 'Impact',
	InitialAccess = 'InitialAccess',
	LateralMovement = 'LateralMovement',
	Persistence = 'Persistence',
	PrivilegeEscalation = 'PrivilegeEscalation',
	Reconnaissance = 'Reconnaissance',
	ResourceDevelopment = 'ResourceDevelopment',
}

export type Mutation = {
	__typename: 'Mutation';
	/** Add an Annotation to an existing CommandGroup */
	addAnnotationToCommandGroup: Annotation;
	/** Create a CommandGroup annotation */
	addCommandGroupAnnotation: Annotation;
	/** Add an Command to an existing CommandGroup */
	addCommandToCommandGroup: CommandGroup;
	/** Anonymize campaign for export */
	anonymizeCampaign: Scalars['String'];
	/** Create a new Campaign */
	createCampaign: Campaign;
	/** Create a global user */
	createGlobalOperator?: Maybe<GlobalOperator>;
	/** Delete existing Annotation */
	deleteAnnotation: Annotation;
	/** Delete a Campaign by id */
	deleteCampaign: Scalars['Boolean'];
	/** Rename existing Campaign */
	renameCampaign: Campaign;
	/** Add a server to a campaign without uploading the files to the server. Intended specifically for live parsing. */
	serverFolderCreate: Server;
	/** Add a server to a campaign without uploading the files to the server. Intended specifically for live parsing. */
	serverUpdate: Server;
	serversParse: Scalars['Boolean'];
	/** Toggle beacon hidden state */
	toggleBeaconHidden: Beacon;
	/** Toggle host hidden state */
	toggleHostHidden: Host;
	/** Toggle server hidden state */
	toggleServerHidden: Server;
	/** Update existing Annotation */
	updateAnnotation: Annotation;
	/** Update existing Beacon Metadata */
	updateBeaconMetadata: Beacon;
	/** Update existing Host Display Name */
	updateHostMetadata: Host;
	/** Update existing Server name */
	updateServerMetadata: Server;
};

export type MutationaddAnnotationToCommandGroupArgs = {
	campaignId: Scalars['String'];
	commandGroupId: Scalars['String'];
	favorite?: InputMaybe<Scalars['Boolean']>;
	tags: Array<Scalars['String']>;
	text: Scalars['String'];
	user: Scalars['String'];
};

export type MutationaddCommandGroupAnnotationArgs = {
	campaignId: Scalars['String'];
	commandIds: Array<Scalars['String']>;
	favorite?: InputMaybe<Scalars['Boolean']>;
	tags: Array<Scalars['String']>;
	text: Scalars['String'];
	user: Scalars['String'];
};

export type MutationaddCommandToCommandGroupArgs = {
	campaignId: Scalars['String'];
	commandGroupId: Scalars['String'];
	commandId: Scalars['String'];
};

export type MutationanonymizeCampaignArgs = {
	anonymizeOptions: AnonymizationInput;
	campaignId: Scalars['String'];
};

export type MutationcreateCampaignArgs = {
	creatorName: Scalars['String'];
	liveCampaign?: InputMaybe<Scalars['Boolean']>;
	name: Scalars['String'];
};

export type MutationcreateGlobalOperatorArgs = {
	username: Scalars['String'];
};

export type MutationdeleteAnnotationArgs = {
	annotationId: Scalars['String'];
	campaignId: Scalars['String'];
};

export type MutationdeleteCampaignArgs = {
	campaignId: Scalars['String'];
};

export type MutationrenameCampaignArgs = {
	campaignId: Scalars['String'];
	name: Scalars['String'];
};

export type MutationserverFolderCreateArgs = {
	campaignId: Scalars['String'];
	name: Scalars['String'];
	path: Scalars['String'];
};

export type MutationserverUpdateArgs = {
	campaignId: Scalars['String'];
	input: ServerUpdateInput;
	serverId: Scalars['String'];
};

export type MutationserversParseArgs = {
	campaignId: Scalars['String'];
};

export type MutationtoggleBeaconHiddenArgs = {
	beaconId: Scalars['String'];
	campaignId: Scalars['String'];
};

export type MutationtoggleHostHiddenArgs = {
	campaignId: Scalars['String'];
	hostId: Scalars['String'];
};

export type MutationtoggleServerHiddenArgs = {
	campaignId: Scalars['String'];
	serverId: Scalars['String'];
};

export type MutationupdateAnnotationArgs = {
	annotationId: Scalars['String'];
	campaignId: Scalars['String'];
	favorite?: InputMaybe<Scalars['Boolean']>;
	tags: Array<Scalars['String']>;
	text: Scalars['String'];
	user: Scalars['String'];
};

export type MutationupdateBeaconMetadataArgs = {
	beaconDisplayName?: InputMaybe<Scalars['String']>;
	beaconId: Scalars['String'];
	beaconTimeOfDeath?: InputMaybe<Scalars['DateTime']>;
	campaignId: Scalars['String'];
};

export type MutationupdateHostMetadataArgs = {
	campaignId: Scalars['String'];
	hostDisplayName: Scalars['String'];
	hostId: Scalars['String'];
};

export type MutationupdateServerMetadataArgs = {
	campaignId: Scalars['String'];
	serverDisplayName?: InputMaybe<Scalars['String']>;
	serverId: Scalars['String'];
	serverType?: InputMaybe<ServerType>;
};

export type Operator = {
	__typename: 'Operator';
	beaconIds: Array<Scalars['String']>;
	endTime?: Maybe<Scalars['DateTime']>;
	id: Scalars['String'];
	logIds: Array<Scalars['String']>;
	name: Scalars['String'];
	startTime?: Maybe<Scalars['DateTime']>;
};

export type ParsingProgress = {
	__typename: 'ParsingProgress';
	date: Scalars['DateTime'];
	nextTaskDescription: Scalars['String'];
	progress: Array<ServerParsingProgress>;
};

/** The current state of Campaign parsing */
export enum ParsingStatus {
	LIVE_PARSING_CS = 'LIVE_PARSING_CS',
	NOT_READY_TO_PARSE = 'NOT_READY_TO_PARSE',
	PARSING_COMPLETED = 'PARSING_COMPLETED',
	PARSING_FAILURE = 'PARSING_FAILURE',
	PARSING_IN_PROGRESS = 'PARSING_IN_PROGRESS',
	PARSING_NOT_STARTED = 'PARSING_NOT_STARTED',
	PARSING_QUEUED = 'PARSING_QUEUED',
}

export type PresentationCommandGroup = {
	__typename: 'PresentationCommandGroup';
	beaconIds: Array<Scalars['String']>;
	commandIds: Array<Scalars['String']>;
	id: Scalars['String'];
	maxDate?: Maybe<Scalars['DateTime']>;
	minDate?: Maybe<Scalars['DateTime']>;
};

export type PresentationItem = {
	__typename: 'PresentationItem';
	/** Every beacon in the presentation. Including both presentation beacons and connection beacons. */
	beaconIds: Array<Scalars['String']>;
	commandGroups: Array<PresentationCommandGroup>;
	/** Beacon Ids that are not in the command groups but are needed to link beacons to other beacons in the graph */
	connectionBeaconIds: Array<Scalars['String']>;
	count: Scalars['Float'];
	id: Scalars['String'];
	key: Scalars['String'];
	linkIds: Array<Scalars['String']>;
};

export type Query = {
	__typename: 'Query';
	/** Get an annotation */
	annotation?: Maybe<Annotation>;
	/** Get all annotations for a project */
	annotations?: Maybe<Array<Maybe<Annotation>>>;
	/** Get all the beacons for a project */
	beacons?: Maybe<Array<Maybe<Beacon>>>;
	/** Get a single campaign */
	campaign?: Maybe<Campaign>;
	/** Get the list of Campaigns */
	campaigns?: Maybe<Array<Maybe<Campaign>>>;
	/** Get command group by id */
	commandGroup?: Maybe<CommandGroup>;
	/** Get command groups by ids */
	commandGroups?: Maybe<Array<Maybe<CommandGroup>>>;
	/** Get commands by ids */
	commandIds?: Maybe<Array<Maybe<Scalars['String']>>>;
	/** Get command types */
	commandTypes?: Maybe<Array<Maybe<CommandTypeCount>>>;
	/** Get commands by ids */
	commands?: Maybe<Array<Maybe<Command>>>;
	/** Get images by ids */
	files?: Maybe<Array<Maybe<File>>>;
	/** Get all the operators for all campaigns */
	globalOperators?: Maybe<Array<Maybe<GlobalOperator>>>;
	/** Get all the hosts for a project */
	hosts?: Maybe<Array<Maybe<Host>>>;
	/** Get images by ids */
	images?: Maybe<Array<Maybe<Image>>>;
	/** Get log entries by ids */
	links?: Maybe<Array<Maybe<Link>>>;
	/** Get log entries by ids */
	logs?: Maybe<Array<Maybe<LogEntry>>>;
	/** Get logs from beacon sorted by time. The goal is to be able to re-create the full log for that beacon. */
	logsByBeaconId: Array<LogEntry>;
	/** Get all the operators for a project */
	operators?: Maybe<Array<Maybe<Operator>>>;
	/** Get the current progress of the parser */
	parsingProgress: ParsingProgress;
	/** Get categories for presentation mode */
	presentationItems?: Maybe<Array<Maybe<PresentationItem>>>;
	/** Search Annotations from textQuery */
	searchAnnotations?: Maybe<Array<Annotation>>;
	/** Search Commands from textQuery */
	searchCommands?: Maybe<Array<Command>>;
	/** Get the list of servers for a project */
	servers?: Maybe<Array<Maybe<Server>>>;
	/** Get all tags for a project */
	tags?: Maybe<Array<Maybe<Tag>>>;
	/** Get a bucketed summary of active beacons and links with commands */
	timeline: Timeline;
};

export type QueryannotationArgs = {
	annotationId: Scalars['String'];
	campaignId: Scalars['String'];
};

export type QueryannotationsArgs = {
	campaignId: Scalars['String'];
};

export type QuerybeaconsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerycampaignArgs = {
	campaignId: Scalars['String'];
};

export type QuerycommandGroupArgs = {
	campaignId: Scalars['String'];
	commandGroupId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerycommandGroupsArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	commandIds?: InputMaybe<Array<Scalars['String']>>;
	commandType?: InputMaybe<Scalars['String']>;
	hidden?: InputMaybe<Scalars['Boolean']>;
	hostId?: InputMaybe<Scalars['String']>;
	operatorId?: InputMaybe<Scalars['String']>;
};

export type QuerycommandIdsArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	commandIds?: InputMaybe<Array<Scalars['String']>>;
	commandType?: InputMaybe<Scalars['String']>;
	hidden?: InputMaybe<Scalars['Boolean']>;
	hostId?: InputMaybe<Scalars['String']>;
	operatorId?: InputMaybe<Scalars['String']>;
	sort?: InputMaybe<SortType>;
};

export type QuerycommandTypesArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerycommandsArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	commandIds?: InputMaybe<Array<Scalars['String']>>;
	commandType?: InputMaybe<Scalars['String']>;
	hidden?: InputMaybe<Scalars['Boolean']>;
	hostId?: InputMaybe<Scalars['String']>;
	operatorId?: InputMaybe<Scalars['String']>;
	sort?: InputMaybe<SortType>;
};

export type QueryfilesArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	hostId?: InputMaybe<Scalars['String']>;
};

export type QueryhostsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QueryimagesArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	hostId?: InputMaybe<Scalars['String']>;
};

export type QuerylinksArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerylogsArgs = {
	beaconId?: InputMaybe<Scalars['String']>;
	campaignId: Scalars['String'];
	hostId?: InputMaybe<Scalars['String']>;
};

export type QuerylogsByBeaconIdArgs = {
	beaconId: Scalars['String'];
	campaignId: Scalars['String'];
};

export type QueryoperatorsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerypresentationItemsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
};

export type QuerysearchAnnotationsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
	searchQuery: Scalars['String'];
};

export type QuerysearchCommandsArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
	searchQuery: Scalars['String'];
};

export type QueryserversArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
	username: Scalars['String'];
};

export type QuerytagsArgs = {
	campaignId: Scalars['String'];
};

export type QuerytimelineArgs = {
	campaignId: Scalars['String'];
	hidden?: InputMaybe<Scalars['Boolean']>;
	suggestedBuckets?: InputMaybe<Scalars['Float']>;
	suggestedEndTime?: InputMaybe<Scalars['DateTime']>;
	suggestedStartTime?: InputMaybe<Scalars['DateTime']>;
};

export type Server = {
	__typename: 'Server';
	beacons: Array<Beacon>;
	displayName: Scalars['String'];
	hidden?: Maybe<Scalars['Boolean']>;
	id: Scalars['String'];
	logsCount: Scalars['Float'];
	meta: ServerMeta;
	name: Scalars['String'];
	/** Intended for using in parsing only */
	parsingPath: Scalars['String'];
};

export type ServerMeta = {
	__typename: 'ServerMeta';
	id: Scalars['String'];
	type: ServerType;
};

export type ServerParsingProgress = {
	__typename: 'ServerParsingProgress';
	campaignId: Scalars['String'];
	serverName: Scalars['String'];
	tasksCompleted: Scalars['Int'];
	totalTasks: Scalars['Int'];
};

/** The communication type used by the server */
export enum ServerType {
	DNS = 'DNS',
	HTTP = 'HTTP',
	HTTPS = 'HTTPS',
	SMB = 'SMB',
}

export type ServerUpdateInput = {
	displayName?: InputMaybe<Scalars['String']>;
	name?: InputMaybe<Scalars['String']>;
	parsingPath?: InputMaybe<Scalars['String']>;
};

/** The desired sort direction */
export enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC',
}

/** The desired property to sort on */
export enum SortOption {
	name = 'name',
	text = 'text',
	time = 'time',
}

export type SortType = {
	direction?: InputMaybe<SortDirection>;
	sortBy?: InputMaybe<SortOption>;
};

export type Tag = {
	__typename: 'Tag';
	id: Scalars['String'];
	text: Scalars['String'];
};

export type Timeline = {
	__typename: 'Timeline';
	bucketEndTime: Scalars['DateTime'];
	/** The number of minutes a bucket spans */
	bucketMinutes: Scalars['Float'];
	bucketStartTime: Scalars['DateTime'];
	buckets: Array<TimelineBucket>;
	campaignEndTime: Scalars['DateTime'];
	campaignStartTime: Scalars['DateTime'];
};

export type TimelineBucket = {
	__typename: 'TimelineBucket';
	/** Beacons that were active during the entire time interval (mutually exclusive with all other beacon lists) */
	activeBeacons: Array<Scalars['String']>;
	/** Links that were active during the entire time interval. (mutually exclusive to all other link lists) */
	activeLinks: Array<Scalars['String']>;
	beaconCommandCountPair: Array<TimelineCommandCountTuple>;
	bucketEndTime: Scalars['DateTime'];
	bucketStartTime: Scalars['DateTime'];
	/** Beacons that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead) */
	createdBeacons: Array<Scalars['String']>;
	/** Links that were created during this time interval (Not mutually exclusive with dying but is mutually exclusive with active and dead) */
	createdLinks: Array<Scalars['String']>;
	/** Beacons that used to exist by this point in time but have either failed or exited (mutually exclusive with all other beacon lists) */
	deadBeacons: Array<Scalars['String']>;
	/** links that used to exist by this point in time but no longer exist (mutually exclusive to all other link lists) */
	deadLinks: Array<Scalars['String']>;
	/** Beacons that died or exited during this time interval (mutually exclusive with dead and active beacons but not with created) */
	dyingBeacons: Array<Scalars['String']>;
	/** Links that died or exited during this time interval (Not mutually exclusive with created links list but is mutually exclusive with active and dead) */
	dyingLinks: Array<Scalars['String']>;
};

export type TimelineCommandCountTuple = {
	__typename: 'TimelineCommandCountTuple';
	beaconId: Scalars['String'];
	/** The number of commands run during this time interval */
	commandCount: Scalars['Float'];
};

export type CAMPAIGNSQueryVariables = Exact<{ [key: string]: never }>;

export type CAMPAIGNSQuery = {
	__typename: 'Query';
	campaigns?: Array<{ __typename: 'Campaign'; id: string; name: string; liveCampaign: boolean } | null> | null;
};

export type CAMPAIGN_CREATEMutationVariables = Exact<{
	creatorName: Scalars['String'];
	campaignName: Scalars['String'];
}>;

export type CAMPAIGN_CREATEMutation = {
	__typename: 'Mutation';
	createCampaign: { __typename: 'Campaign'; id: string; name: string };
};

export type SERVERSQueryVariables = Exact<{
	campaignId: Scalars['String'];
	username: Scalars['String'];
}>;

export type SERVERSQuery = {
	__typename: 'Query';
	servers?: Array<{
		__typename: 'Server';
		id: string;
		name: string;
		parsingPath: string;
		displayName: string;
	} | null> | null;
};

export type SERVER_FOLDER_CREATEMutationVariables = Exact<{
	campaignId: Scalars['String'];
	name: Scalars['String'];
	path: Scalars['String'];
}>;

export type SERVER_FOLDER_CREATEMutation = {
	__typename: 'Mutation';
	serverFolderCreate: { __typename: 'Server'; id: string; name: string; parsingPath: string; displayName: string };
};

export type SERVER_UPDATEMutationVariables = Exact<{
	campaignId: Scalars['String'];
	serverId: Scalars['String'];
	input: ServerUpdateInput;
}>;

export type SERVER_UPDATEMutation = {
	__typename: 'Mutation';
	serverUpdate: { __typename: 'Server'; id: string; name: string; parsingPath: string; displayName: string };
};

export const CAMPAIGNSDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'CAMPAIGNS' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'campaigns' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'liveCampaign' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<CAMPAIGNSQuery, CAMPAIGNSQueryVariables>;
export const CAMPAIGN_CREATEDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CAMPAIGN_CREATE' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'creatorName' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'campaignName' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'createCampaign' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'creatorName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'creatorName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'liveCampaign' },
								value: { kind: 'BooleanValue', value: true },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'name' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'campaignName' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<CAMPAIGN_CREATEMutation, CAMPAIGN_CREATEMutationVariables>;
export const SERVERSDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SERVERS' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'servers' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'campaignId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'username' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
							},
							{ kind: 'Argument', name: { kind: 'Name', value: 'hidden' }, value: { kind: 'BooleanValue', value: true } },
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'parsingPath' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SERVERSQuery, SERVERSQueryVariables>;
export const SERVER_FOLDER_CREATEDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'SERVER_FOLDER_CREATE' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'path' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'serverFolderCreate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'campaignId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'name' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'path' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'path' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'parsingPath' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SERVER_FOLDER_CREATEMutation, SERVER_FOLDER_CREATEMutationVariables>;
export const SERVER_UPDATEDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'SERVER_UPDATE' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'serverId' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
					type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ServerUpdateInput' } } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'serverUpdate' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'campaignId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'campaignId' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'serverId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'serverId' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'input' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'parsingPath' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SERVER_UPDATEMutation, SERVER_UPDATEMutationVariables>;

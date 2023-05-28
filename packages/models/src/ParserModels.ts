import { BeaconType, File, Image, LogEntry, ServerType } from './projectModels';

export interface ParserBeacon {
	name: string;
	server: string;
	host: string;
	ip?: string;
	type?: BeaconType;
	port?: number;
	process?: string;
	processId?: number;
	startTime?: Date;
	endTime?: Date;
	images?: Pick<Image, 'fileType' | 'url' | 'blob'>[];
	files?: Omit<File, 'id' | 'beacon'>[];
}

export interface ParserHost {
	name: string;
	server: string;
	os?: string;
	osVersion?: string;
	ip?: string;
	type?: string;
}

export interface ParserServer {
	name: string;
	type?: ServerType;
	parsingPath?: string;
}

export interface ParserOperator {
	name: string;
	startTime?: Date;
	endTime?: Date;
}

export interface ParserLink {
	from: string;
	to: string;
}

export type ParserLogEntry = Pick<LogEntry, 'blob' | 'filepath' | 'lineNumber' | 'lineType' | 'logType' | 'dateTime'>;
export interface ParserCommand {
	operator?: string;
	beacon: string;
	host?: string;
	input: ParserLogEntry;
	commandFailed?: boolean;
	output?: ParserLogEntry;
	attackIds?: string[];
}

export interface ParserOutput {
	servers: Record<string, ParserServer>;
	hosts: Record<string, ParserHost>;
	beacons: Record<string, ParserBeacon>;
	operators: Record<string, ParserOperator>;
	commands: Record<string, ParserCommand>;
	links: Record<string, ParserLink>;
}

export enum ValidationMode {
	None = 'none',
	FileExtensions = 'file-extensions',
	Parser = 'parser',
}

export enum UploadType {
	File = 'file',
	Directory = 'directory',
}

type UploadValidation =
	| { validate: ValidationMode.None | ValidationMode.Parser }
	| { validate: ValidationMode.FileExtensions; acceptedExtensions: string[] };
export interface UploadForm {
	tabTitle: string;
	enabledInBlueTeam: boolean;
	fileUpload: {
		type: UploadType;
		description: string;
	} & UploadValidation;
	// Must return JSON as {[serverName: string]: FileName[]}
	fileDisplay: {
		description: string;
		editable: boolean;
	};
}

/**
 * file-directory is server data seperated into distinct folders
 * database is server data not in any particular file/folder structure
 */
export enum ServerDelineationTypes {
	Folder = 'folder',
	Database = 'database',
}

export interface ParserInfo {
	/** The version of the RedEye parser config that the parser is compatible with */
	version: number;
	id: string;
	name: string;
	description?: string;
	serverDelineation: ServerDelineationTypes;
	uploadForm: UploadForm;
}

export enum ParserMessageTypes {
	Data = '[DATA]',
	Progress = '[PROGRESS]',
	Log = '[LOG]',
	Error = '[ERROR]',
	Debug = '[DEBUG]',
	End = '[END]',
}

export const parserMessagePrefixes = [
	ParserMessageTypes.Data,
	ParserMessageTypes.Progress,
	ParserMessageTypes.Progress,
	ParserMessageTypes.Error,
	ParserMessageTypes.Debug,
];

export const formatParserMessage = (prefix: ParserMessageTypes, message: any) =>
	`${prefix} ${JSON.stringify(message)}\n`;
export const writeParserMessage = (prefix: ParserMessageTypes, message: any) =>
	process.stdout.write(formatParserMessage(prefix, message));
const messageRegex = /(\[\w+\]) (.*)/;
export const getParserPrefixAndMessage = (message: string) => {
	const messageMatch = message.match(messageRegex);
	return messageMatch ? [messageMatch[1], messageMatch[2]] : [];
};

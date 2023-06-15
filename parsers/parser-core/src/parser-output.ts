import type { BeaconType, File, Image, LogEntry, ServerType } from '@redeye/models';

type ParserImage = Pick<Image, 'fileType' | 'url' | 'blob'>;
type ParserFile = Omit<File, 'id' | 'beacon'>;
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
	images?: ParserImage[];
	files?: ParserFile[];
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
	servers: { [server: string]: ParserServer };
	hosts: { [host: string]: ParserHost };
	beacons: { [beacon: string]: ParserBeacon };
	operators: { [operator: string]: ParserOperator };
	commands: { [command: string]: ParserCommand };
	links: { [link: string]: ParserLink };
}

import type { LoggerOptions } from './logging';
import type { ParserOutput } from './parser-output';
import type { ParserProgress } from './parser-progress';
import type { ParserInfo } from './parser-info';
import type { ParserValidateFiles } from './parser-validate-files';

export enum ParserMessageTypes {
	/** The complete parsed data in {ParserOutput}  */
	Data = '[DATA]',
	/** The progress of the parsing process, the message should match the {ParserProgress} type */
	Progress = '[PROGRESS]',
	/** Messages to append to a log file, the message should match the {LoggerOptions} type */
	Log = '[LOG]',
	/** Errors that occur during parsing, ends the parsing process */
	Error = '[ERROR]',
	/** Debug messages used only for development or debugging */
	Debug = '[DEBUG]',
}

/**
 * The format of messages that are sent from the parser to RedEye
 * @example
 * [DATA] '{"data": {"beacon": "233", "host": "DESKTOP-123", "data": {"key": "value"}}}'\n
 * [PROGRESS] '{"percent": 50, "message": "Processing logs for beacon "233" on host "DESKTOP-123"'}'\n
 * [LOG] '{"message": "Parsing file 1 of 1"}'\n
 * [ERROR] '{"message": "An unrecoverable error occurred while parsing file 'beacon-123.log'"}'\n
 */
export type ParserMessageFormat = `${ParserMessageTypes} ${string}\n`;

export const formatParserMessage = (prefix: ParserMessageTypes, message: any): ParserMessageFormat =>
	`${prefix} ${JSON.stringify(message)}\n`;

export function writeParserMessage(
	prefix: ParserMessageTypes.Data,
	message: ParserOutput | ParserInfo | ParserValidateFiles
): void;
export function writeParserMessage(prefix: ParserMessageTypes.Progress, message: ParserProgress): void;
export function writeParserMessage(prefix: ParserMessageTypes.Log, message: LoggerOptions): void;
export function writeParserMessage(prefix: ParserMessageTypes.Debug, message: any): void;
export function writeParserMessage(prefix: ParserMessageTypes.Error, message: any): void;
export function writeParserMessage(prefix: ParserMessageTypes, message: any) {
	process.stdout.write(formatParserMessage(prefix, message));
}

const messageRegex = /(\[\w+\]) (.*)/;
export const getParserPrefixAndMessage = (message: string) => {
	const messageMatch = message.match(messageRegex);
	return messageMatch ? [messageMatch[1], messageMatch[2]] : [];
};

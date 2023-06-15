import { LoggerOptions } from './logging';
import { ParserOutput } from './parser-output';
import { ParserProgress } from './parser-progress';

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

export const formatParserMessage = (prefix: ParserMessageTypes, message: any) =>
	`${prefix} ${JSON.stringify(message)}\n`;
export const writeParserMessage = (prefix: ParserMessageTypes, message: any) =>
	process.stdout.write(formatParserMessage(prefix, message));

export const sendParserDataOutput = (prefix: ParserMessageTypes.Data, message: ParserOutput) =>
	process.stdout.write(formatParserMessage(prefix, message));

export const sendParserProgress = (prefix: ParserMessageTypes.Progress, message: ParserProgress) =>
	process.stdout.write(formatParserMessage(prefix, message));
export const sendParserLog = (prefix: ParserMessageTypes.Log, message: LoggerOptions) =>
	process.stdout.write(formatParserMessage(prefix, message));

const messageRegex = /(\[\w+\]) (.*)/;
export const getParserPrefixAndMessage = (message: string) => {
	const messageMatch = message.match(messageRegex);
	return messageMatch ? [messageMatch[1], messageMatch[2]] : [];
};

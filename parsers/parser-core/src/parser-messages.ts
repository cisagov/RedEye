import { LoggerOptions } from './logging';

export enum ParserMessageTypes {
	Data = '[DATA]',
	Progress = '[PROGRESS]',
	Log = '[LOG]',
	Error = '[ERROR]',
	Debug = '[DEBUG]',
}

export const formatParserMessage = (prefix: ParserMessageTypes, message: any) =>
	`${prefix} ${JSON.stringify(message)}\n`;
export const writeParserMessage = (prefix: ParserMessageTypes, message: any) =>
	process.stdout.write(formatParserMessage(prefix, message));
export const writeParserLogMessage = (prefix: ParserMessageTypes.Log, message: LoggerOptions) =>
	process.stdout.write(formatParserMessage(prefix, message));

const messageRegex = /(\[\w+\]) (.*)/;
export const getParserPrefixAndMessage = (message: string) => {
	const messageMatch = message.match(messageRegex);
	return messageMatch ? [messageMatch[1], messageMatch[2]] : [];
};

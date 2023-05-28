import { createLogger, format, transports } from 'winston';

const myFormat = format.combine(format.json());

export enum LogLevel {
	error = 'error',
	warn = 'warn',
	debug = 'debug',
}

type LoggerOptions = {
	message: string;
	tags?: string[];
	level?: keyof typeof LogLevel;
	error?: unknown;
	payload?: unknown;
};

export const createLoggerInstance = (filePath: string) => {
	const logger = createLogger({
		format: myFormat,
		transports: [new transports.File({ filename: 'parsing.log', dirname: filePath })],
	});
	return (options: LoggerOptions) => {
		const time = new Date().toISOString();
		const { tags, level = 'debug', error, payload } = options ?? {};
		const baseLogObject = { level, message: options.message, time };
		const additionalMetadata: Record<string, unknown> = {};
		if (error) additionalMetadata.error = error;
		if (payload) additionalMetadata.payload = payload;
		if (tags?.length) additionalMetadata.tags = tags;
		Object.assign(baseLogObject, additionalMetadata);
		logger.log(baseLogObject);
	};
};

export type LoggerInstance = ReturnType<typeof createLoggerInstance>;

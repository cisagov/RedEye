import { format, transports, createLogger } from 'winston';
import { ActionMeta, EventObject } from 'xstate';
import { LogLevel } from './commandOptions';

const myFormat = format.combine(format.json());

type LoggerOptions = {
	tags?: string[];
	level?: keyof typeof LogLevel;
	error?: unknown;
	payload?: unknown;
};

export const createLoggerInstance = (filePath: string) => {
	const logger = createLogger({
		format: myFormat,
		transports: [
			new transports.File({ filename: 'parsing-error.log', level: 'error', dirname: filePath }),
			new transports.File({ filename: 'parsing-debug.log', level: 'debug', dirname: filePath }),
			new transports.File({ filename: 'parsing-warn.log', level: 'warn', dirname: filePath }),
		],
	});
	return (message: string, options?: LoggerOptions) => {
		const time = new Date().toISOString();
		const { tags, level = 'debug', error, payload } = options ?? {};
		const baseLogObject = { level, message, time };
		const additionalMetadata: Record<string, unknown> = {};
		if (error) additionalMetadata.error = error;
		if (payload) additionalMetadata.payload = payload;
		if (tags?.length) additionalMetadata.tags = tags;
		Object.assign(baseLogObject, additionalMetadata);
		logger.log(baseLogObject);
	};
};

export type LoggerInstance = ReturnType<typeof createLoggerInstance>;

const getNextStateName = <TContext extends SharedContext, TEvent extends EventObject>(
	meta: ActionMeta<TContext, TEvent>
): string => {
	const allNextState = meta.state.toStrings();
	return allNextState[allNextState.length - 1];
};

const getPreviousState = <TContext extends SharedContext, TEvent extends EventObject>(
	meta: ActionMeta<TContext, TEvent>
): string => {
	const allPreviousState = meta.state.history?.toStrings();
	return allPreviousState ? allPreviousState[allPreviousState.length - 1] : 'uninitialized';
};

type SharedContext = { logger: LoggerInstance };
export const logTransition = <TContext extends SharedContext, TEvent extends EventObject>(
	ctx: TContext,
	event: TEvent,
	meta: ActionMeta<TContext, TEvent>,
	id: string
) => {
	const previousState = getPreviousState(meta);
	const nextState = getNextStateName(meta);
	ctx.logger(`${previousState} ==> ${nextState}`, {
		tags: [id],
		level: 'debug',
		payload: event.type,
	});
};

export const logFinalState = <TContext extends SharedContext, TEvent extends EventObject>(
	ctx: TContext,
	event: TEvent,
	meta: ActionMeta<TContext, TEvent>,
	finalStateText: string,
	id: string
) => {
	const previousState = getPreviousState(meta);
	ctx.logger(`${previousState} ==| ${finalStateText}`, {
		tags: [id],
		level: 'debug',
		payload: event.type,
	});
};

export const logEntryState = <TContext extends SharedContext, TEvent extends EventObject>(
	ctx: TContext,
	event: TEvent,
	meta: ActionMeta<TContext, TEvent>,
	id: string
) => {
	const nextState = getNextStateName(meta);
	ctx.logger(`[INITIAL] >>==> ${nextState}`, {
		tags: [id],
		level: 'debug',
		payload: event.type,
	});
};

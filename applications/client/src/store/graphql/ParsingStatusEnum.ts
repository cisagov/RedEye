/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types, prop, tProp, Model, Ref } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum ParsingStatus {
	LIVE_PARSING_CS = 'LIVE_PARSING_CS',
	NOT_READY_TO_PARSE = 'NOT_READY_TO_PARSE',
	PARSING_COMPLETED = 'PARSING_COMPLETED',
	PARSING_FAILURE = 'PARSING_FAILURE',
	PARSING_IN_PROGRESS = 'PARSING_IN_PROGRESS',
	PARSING_NOT_STARTED = 'PARSING_NOT_STARTED',
	PARSING_QUEUED = 'PARSING_QUEUED',
}

/**
 * ParsingStatus
 *
 * The current state of Campaign parsing
 */
export const ParsingStatusEnumType = types.enum(ParsingStatus);

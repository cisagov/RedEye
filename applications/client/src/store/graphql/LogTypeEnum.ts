/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types, prop, tProp, Model, Ref } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum LogType {
	BEACON = 'BEACON',
	DOWNLOAD = 'DOWNLOAD',
	EVENT = 'EVENT',
	KEYSTROKES = 'KEYSTROKES',
	UNKNOWN = 'UNKNOWN',
	WEBLOG = 'WEBLOG',
}

/**
 * LogType
 *
 * Basic Log Types based on the filename
 */
export const LogTypeEnumType = types.enum(LogType);

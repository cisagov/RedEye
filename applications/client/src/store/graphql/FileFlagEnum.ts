/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum FileFlag {
	DOWNLOAD = 'DOWNLOAD',
	UPLOAD = 'UPLOAD',
}

/**
 * FileFlag
 *
 * Designates if this is an upload or download     UPLOAD: File was put on or replace on a target host     DOWNLOAD: File was taken from a target host
 */
export const FileFlagEnumType = types.enum(FileFlag);

/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types, prop, tProp, Model, Ref } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum ServerType {
	dns = 'dns',
	http = 'http',
	https = 'https',
	smb = 'smb',
}

/**
 * ServerType
 *
 * The communication type used by the server
 */
export const ServerTypeEnumType = types.enum(ServerType);

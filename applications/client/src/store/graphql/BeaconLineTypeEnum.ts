/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum BeaconLineType {
	CHECKIN = 'CHECKIN',
	ERROR = 'ERROR',
	INDICATOR = 'INDICATOR',
	INPUT = 'INPUT',
	METADATA = 'METADATA',
	MODE = 'MODE',
	OUTPUT = 'OUTPUT',
	TASK = 'TASK',
}

/**
 * BeaconLineType
 *
 * The type of line in a beacon log
 */
export const BeaconLineTypeEnumType = types.enum(BeaconLineType);

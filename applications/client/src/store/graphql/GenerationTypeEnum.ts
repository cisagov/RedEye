/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum GenerationType {
	MANUAL = 'MANUAL',
	PROCEDURAL = 'PROCEDURAL',
	PROCEDURAL_MODIFIED = 'PROCEDURAL_MODIFIED',
}

/**
 * GenerationType
 *
 * How the entity was generated
 */
export const GenerationTypeEnumType = types.enum(GenerationType);

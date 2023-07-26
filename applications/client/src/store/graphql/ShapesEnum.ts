/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types, prop, tProp, Model, Ref } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum Shapes {
	circle = 'circle',
	diamond = 'diamond',
	hexagonDown = 'hexagonDown',
	hexagonUp = 'hexagonUp',
	pentagonDown = 'pentagonDown',
	pentagonUp = 'pentagonUp',
	square = 'square',
	triangleDown = 'triangleDown',
	triangleUp = 'triangleUp',
}

/**
 * Shapes
 *
 * The shape of the node
 */
export const ShapesEnumType = types.enum(Shapes);

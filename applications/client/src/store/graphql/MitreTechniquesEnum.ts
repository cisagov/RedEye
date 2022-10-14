/* This is a mk-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { types } from 'mobx-keystone';

/**
 * Typescript enum
 */

export enum MitreTechniques {
	Collection = 'Collection',
	CommandAndControl = 'CommandAndControl',
	CredentialAccess = 'CredentialAccess',
	DefenseEvasion = 'DefenseEvasion',
	Discovery = 'Discovery',
	Execution = 'Execution',
	Exfiltration = 'Exfiltration',
	GoldenTicket = 'GoldenTicket',
	Impact = 'Impact',
	InitialAccess = 'InitialAccess',
	LateralMovement = 'LateralMovement',
	Persistence = 'Persistence',
	PrivilegeEscalation = 'PrivilegeEscalation',
	Reconnaissance = 'Reconnaissance',
	ResourceDevelopment = 'ResourceDevelopment',
}

/**
 * MitreTechniques
 *
 * High level mitre technique
 */
export const MitreTechniquesEnumType = types.enum(MitreTechniques);

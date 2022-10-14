import { registerEnumType } from 'type-graphql';

export enum GenerationType {
	PROCEDURAL = 'PROCEDURAL',
	PROCEDURAL_MODIFIED = 'PROCEDURAL_MODIFIED',
	MANUAL = 'MANUAL',
}

registerEnumType(GenerationType, {
	name: 'GenerationType',
	description: 'How the entity was generated',
});

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

export enum Shapes {
	circle = 'circle',
	pentagonUp = 'pentagonUp',
	'hexagonDown' = 'hexagonDown',
	'square' = 'square',
	'diamond' = 'diamond',
	'pentagonDown' = 'pentagonDown',
	'triangleUp' = 'triangleUp',
	'triangleDown' = 'triangleDown',
	'hexagonUp' = 'hexagonUp',
}

registerEnumType(Shapes, {
	name: 'Shapes',
	description: `The shape of the node`,
});

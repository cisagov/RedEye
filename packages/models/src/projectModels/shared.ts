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

export enum NodeColors {
	default = 'default',
	vermilion = 'vermilion',
	red = 'red',
	rose = 'rose',
	violet = 'violet',
	indigo = 'indigo',
	turquoise = 'turquoise',
	green = 'green',
	forest = 'forest',
	lime = 'lime',
	gold = 'gold',
	orange = 'orange',
}

registerEnumType(NodeColors, {
	name: 'NodeColors',
	description: `The color of the node`,
});

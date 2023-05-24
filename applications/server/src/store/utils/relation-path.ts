// TODO: Need to relook at this and see why I needed to add nocheck

import { createParamDecorator } from 'type-graphql';
import { ParameterDecorator } from 'type-graphql/dist/interfaces/LegacyDecorators';
import fieldsToRelations from 'graphql-fields-to-relations';

export type Relation<T> = (keyof T)[];

/**
 * Finds all the population strings based on the graphql query
 */
export function RelationPath<T>(): ParameterDecorator {
	return createParamDecorator(({ info }): Relation<T> => {
		return fieldsToRelations(info as unknown as Parameters<typeof fieldsToRelations>[0]) as Relation<T>;
	});
}

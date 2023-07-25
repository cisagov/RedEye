import { createParamDecorator } from 'type-graphql';
import fieldsToRelations from 'graphql-fields-to-relations';

export type Relation<T> = (keyof T)[];

/**
 * Finds all the population strings based on the graphql query
 */
export function RelationPath<T>() {
	return createParamDecorator(({ info }): Relation<T> => {
		return fieldsToRelations(info as unknown as Parameters<typeof fieldsToRelations>[0]) as Relation<T>;
	});
}

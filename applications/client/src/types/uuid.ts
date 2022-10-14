type StringOrNumber = string | number;
type UUID8 =
	`${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}`;
type UUID4 = `${StringOrNumber}${StringOrNumber}${StringOrNumber}${StringOrNumber}`;
type UUID12 = `${UUID8}${UUID4}`;

export const uuidRegex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

export type UUID = `${UUID8}-${UUID4}-${UUID4}-${UUID4}-${UUID12}`;

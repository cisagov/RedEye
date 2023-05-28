// Global DB Models
import { Campaign, ParsingStatus, MultiParsingPath } from './Campaign';
import { GlobalOperator } from './Operator';

export {
	// Global DB Models
	Campaign,
	GlobalOperator,
	//enum
	ParsingStatus,
	//type
	MultiParsingPath,
};

export const applicationEntities = [Campaign, GlobalOperator];

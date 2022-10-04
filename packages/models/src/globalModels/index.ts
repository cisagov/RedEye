// Global DB Models
import { Campaign, ParsingStatus } from './Campaign';
import { GlobalOperator } from './Operator';

export {
	// Global DB Models
	Campaign,
	GlobalOperator,
	//enum
	ParsingStatus,
};

export const applicationEntities = [Campaign, GlobalOperator];

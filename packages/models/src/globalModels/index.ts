// Global DB Models
import { Campaign, ParsingStatus, CampaignParser } from './Campaign';
import { GlobalOperator } from './Operator';

export {
	// Global DB Models
	Campaign,
	GlobalOperator,
	//enum
	ParsingStatus,
	//type
	CampaignParser,
};

export const applicationEntities = [Campaign, GlobalOperator];

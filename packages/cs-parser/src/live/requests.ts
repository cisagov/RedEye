import { gql } from 'graphql-request';

export const CAMPAIGNS = gql`
	query CAMPAIGNS {
		campaigns {
			id
			name
			liveCampaign
		}
	}
`;

export const CAMPAIGN_CREATE = gql`
	mutation CAMPAIGN_CREATE($creatorName: String!, $campaignName: String!) {
		createCampaign(creatorName: $creatorName, liveCampaign: true, name: $campaignName) {
			id
			name
		}
	}
`;

export const SERVERS = gql`
	query SERVERS($campaignId: String!, $username: String!) {
		servers(campaignId: $campaignId, username: $username, hidden: true) {
			id
			name
			parsingPath
			displayName
		}
	}
`;

export const SERVER_FOLDER_CREATE = gql`
	mutation SERVER_FOLDER_CREATE($campaignId: String!, $name: String!, $path: String!) {
		serverFolderCreate(campaignId: $campaignId, name: $name, path: $path) {
			id
			name
			parsingPath
			displayName
		}
	}
`;

export const SERVER_UPDATE = gql`
	mutation SERVER_UPDATE($campaignId: String!, $serverId: String!, $input: ServerUpdateInput!) {
		serverUpdate(campaignId: $campaignId, serverId: $serverId, input: $input) {
			id
			name
			parsingPath
			displayName
		}
	}
`;

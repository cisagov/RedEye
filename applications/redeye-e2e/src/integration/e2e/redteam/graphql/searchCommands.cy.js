import { graphqlRequest } from '../../../../support/utils';

describe('Search Request', () => {
	const camp = 'searchCommandsGraphQL';

	it('Query Presentation Items', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.clickSearch();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const query = `query searchCommands($campaignId: String!, $searchQuery: String!) {
        searchCommands(campaignId: $campaignId, searchQuery: $searchQuery) {
        id
        inputText
      }
    }`;
			const variables = { campaignId: returnedUrl, searchQuery: 'exit' };
			graphqlRequest(query, variables).then((res) => {
				const search = res.body.data.searchCommands;
				expect(search.length).to.eq(4);
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

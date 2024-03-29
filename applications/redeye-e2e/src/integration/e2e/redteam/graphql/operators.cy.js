import { graphqlRequest } from '../../../../support/utils';

describe('Query Operators', () => {
	const camp = 'operatorsGraphQL';

	it('Query Operators', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const query = `query operators($campaignId: String!) {
        operators(campaignId: $campaignId) {
        id
      }
    }`;

			const variables = { campaignId: returnedUrl };
			graphqlRequest(query, variables).then((res) => {
				const resp = res.body.data.operators[0];
				expect(resp.id).to.eq('analyst01');
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

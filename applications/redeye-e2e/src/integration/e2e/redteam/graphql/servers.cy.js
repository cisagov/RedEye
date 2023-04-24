import { graphqlRequest } from '../../../../support/utils';

describe('Query Servers', () => {
	const camp = 'serversGraphQL';

	it('Query Servers', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const query = `query servers($campaignId: String!, $username: String!) {
        servers(campaignId: $campaignId, username: $username) {
        id
      }
    }`;

			const variables = { campaignId: returnedUrl, username: 'seb' };
			graphqlRequest(query, variables).then((res) => {
				expect(res.body.data.servers.length).to.eq(1);
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

import { graphqlRequest } from '../../../../support/utils';

describe('Get All Links', () => {
	const camp = 'linksGraphQL';

	it('Get All Links', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const query = `query links($campaignId: String!) {
      links(campaignId: $campaignId) {
        id
      }
    }`;
			const variables = { campaignId: returnedUrl };
			graphqlRequest(query, variables).then((res) => {
				const search = res.body.data.links;
				expect(search.length).to.eq(5);
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

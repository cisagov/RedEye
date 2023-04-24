import { graphqlRequest } from '../../../../support/utils';

describe('Query Hosts', () => {
	const camp = 'hostsGraphQL';

	it('Query Hosts', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const query = `query hosts($campaignId: String!) {
       hosts(campaignId: $campaignId) {
        id
      }
    }`;
			const variables = { campaignId: returnedUrl };
			graphqlRequest(query, variables).then((res) => {
				const comp = res.body.data.hosts;
				expect(comp.length).to.eq(3);
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

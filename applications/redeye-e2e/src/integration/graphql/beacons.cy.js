import { graphqlRequest } from '../../support/utils';

describe('Query Beacons', () => {
	const camp = 'beaconsGraphQL';

	it('Query Beacons', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const query = `query beacons($campaignId: String!) {
       beacons(campaignId: $campaignId) {
        id
      }
    }`;
			const variables = `{"campaignId": "${returnedUrl}"}`;
			graphqlRequest(query, variables).then((res) => {
				const comp = res.body.data.beacons;
				expect(comp.length).to.eq(6);
			});
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

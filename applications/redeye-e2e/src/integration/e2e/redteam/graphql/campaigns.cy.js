import { graphqlRequest } from '../../../../support/utils';

describe('Get All Campaigns', () => {
	const camp = 'campaignsGraphQL';

	it('Get All Campaigns', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		const query = `query campaigns {
        campaigns {
              id
            }
          }`;
		graphqlRequest(query).then((res) => {
			const campaigns = res.body.data.campaigns;
			expect(campaigns.length).to.gte(1);
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

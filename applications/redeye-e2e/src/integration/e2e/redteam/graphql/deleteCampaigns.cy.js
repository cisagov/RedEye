import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Delete Campaign', () => {
	it('Upload and Delete Campaign', () => {
		const campName = 'deleteCampaignGraphQL';

		const fileName = 'gt.redeye';
		cy.uploadCampaign(campName, fileName);

		const query = `query campaigns {
        campaigns {
              id
              name
            }
          }`;
		graphqlRequest(query).then((res) => {
			const camp = res.body.data.campaigns;

			const ids = Cypress._.find(camp, { name: campName });
			const campToDelete = ids.id;

			const mutation = `
        mutation deleteCampaign($campaignId: String!) {
         deleteCampaign(campaignId: $campaignId) 
      }`;
			const variables = { campaignId: campToDelete };
			mutRequest(mutation, variables).then((res) => {
				cy.log(res);
			});
		});

		cy.reload();
	});
});

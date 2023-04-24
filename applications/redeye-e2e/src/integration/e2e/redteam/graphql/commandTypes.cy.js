import { graphqlRequest } from '../../../../support/utils';

describe('Query CommandTypes', () => {
	const camp = 'commandTypesGraphQL';

	it('Query CommandTypes', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const query = `query commandTypes($campaignId: String!) {
       commandTypes(campaignId: $campaignId) {
        id
      }
    }`;
			const variables = { campaignId: returnedUrl };
			graphqlRequest(query, variables).then((res) => {
				const comp = res.body.data.commandTypes;
				//23 Unique Command Types
				expect(comp.length).to.eq(22);
				let co = res.body.data.commandTypes.map((ty) => ty.id);
				expect(co).to.include('shell');
			});
		});
		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

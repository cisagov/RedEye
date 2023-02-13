import { graphqlRequest } from '../../../../support/utils';

describe('Query Global Operators', () => {
	const camp = 'globalOperatorGraphQL';

	it('Query Global Operators', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		const query = `query globalOperators($password: String!) {
        globalOperators(password: $password) {
        id
        name
      }
    }`;
		const variables = `{"password": "937038570"}`;
		graphqlRequest(query, variables)
			.its('body.data.globalOperators.0')
			.then((res) => {
				expect(res.id).to.eq('analyst');
				expect(res.name).to.eq('analyst');
			});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

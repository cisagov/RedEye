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
		const variables = { password: '937038570' };
		graphqlRequest(query, variables).then((response) => {
			const res = response.body.data.globalOperators;
			const match = Cypress._.find(res, { id: 'cypress' });
			cy.wrap(match).its('name').should('eq', 'cypress');
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

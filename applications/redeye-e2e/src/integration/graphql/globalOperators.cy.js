import { graphqlRequest } from '../../support/utils';

describe('Query Global Operators', () => {
	const camp = 'globalOperatorGraphQL';

	it('Query Global Operators', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		const query = `query globalOperators {
        globalOperators {
        id
        name
      }
    }`;
		graphqlRequest(query).then((res) => {
			expect(res.body.data.globalOperators[0].id).to.eq('analyst');
			expect(res.body.data.globalOperators[0].name).to.eq('analyst');
		});

		cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

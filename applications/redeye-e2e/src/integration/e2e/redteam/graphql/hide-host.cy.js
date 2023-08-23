import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Host using GraphQL', () => {
	const camp = 'hideHostGraphQL';
	const hiddenHost = 'COMPUTER03';

	it('Hide a host', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const mutation = `mutation toggleHostHidden($campaignId: String!, $hostId: String!) {
					toggleHostHidden(campaignId: $campaignId, hostId: $hostId) {
					  id
					}
				  }
				  `;

			const variables1 = { campaignId: returnedUrl, hostId: hiddenHost };
			mutRequest(mutation, variables1);

			const query = `query hosts($campaignId: String!) {
					hosts(campaignId: $campaignId) {
					  meta {
						id
					  }
					}
				  }
				  `;

			const variables2 = { campaignId: returnedUrl };

			graphqlRequest(query, variables2).then((res) => {
				const comp = res.body.data.hosts;
				expect(comp.length).to.eq(2);

				const co = res.body.data.hosts.map((ty) => ty.id);
				expect(co).to.not.include(hiddenHost);
			});
		});
		cy.returnToCampaignCard();
		cy.doNotShowHiddenItems();
		cy.selectCampaign(camp);
		const hostsList = [];
		cy.get('[cy-test=info-row]')
			.each(($li) => hostsList.push($li.text()))
			.then(() => {
				// cy.log(hostsList.join(', '));
				cy.wrap(hostsList).should('deep.equal', ['08/17—08/17Server:TestDataSet', '08/17—08/17COMPUTER02243']);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

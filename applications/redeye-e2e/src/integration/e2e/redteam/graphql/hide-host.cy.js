import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Host using GraphQL', () => {
	const camp = 'hideHostGraphQL';

	it('Hide a host', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const mutation = `mutation toggleHostHidden($campaignId: String!, $hostId: String!) {
					toggleHostHidden(campaignId: $campaignId, hostId: $hostId) {
					  id
					  meta {
						id
					  }
					}
				  }
				  `;

			const variables1 = `{"campaignId": "${returnedUrl}", "hostId": "COMPUTER03"}`;
			mutRequest(mutation, variables1).then((res) => {
				cy.log(res.body.data);
			});

			const query = `query hosts($campaignId: String!) {
					hosts(campaignId: $campaignId) {
					  id
					 hostName
					  meta {
						id
					  }
					}
				  }
				  `;

			const variables2 = `{"campaignId": "${returnedUrl}"}`;

			graphqlRequest(query, variables2).then((res) => {
				const comp = res.body.data.hosts;
				expect(comp.length).to.eq(2);

				const co = res.body.data.hosts.map((ty) => ty.id);

				expect(co).to.not.include('COMPUTER03');
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

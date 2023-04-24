import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Beacon using GraphQL', () => {
	const camp = 'hideBeaconGraphQL';

	it('Hide a beacon', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const mutation = `mutation toggleBeaconHidden($beaconId: String!, $campaignId: String!) {
				toggleBeaconHidden(beaconId: $beaconId, campaignId: $campaignId) {
				  id
				  beaconName
				  meta {
					id

				  }
				}
			  }
				  `;

			const variables1 = { beaconId: 'COMPUTER02-1166658656', campaignId: returnedUrl };
			mutRequest(mutation, variables1).then((res) => {
				cy.log(res.body.data);
			});

			const query = `query beacons($campaignId: String!) {
					beacons(campaignId: $campaignId) {
					  id
					  meta {
						id
					  }
					}
				  }
				  `;

			const variables2 = { campaignId: returnedUrl };

			graphqlRequest(query, variables2).then((res) => {
				const comp = res.body.data.beacons;
				expect(comp.length).to.eq(5);

				const co = res.body.data.beacons.map((ty) => ty.id);

				expect(co).to.not.include('1166658656');
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

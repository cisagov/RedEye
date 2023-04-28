import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Beacon using GraphQL', () => {
	const camp = 'hideBeaconGraphQL';
	const beaconId1 = 'COMPUTER02-1166658656';
	const beaconId2 = 'COMPUTER02-330588776';

	it('Hide a beacon', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const mutation = `mutation toggleBeaconHidden(
				$beaconIds: [String!]
				$campaignId: String!
				$setHidden: Boolean
			  ) {
				toggleBeaconHidden(
				  beaconIds: $beaconIds
				  campaignId: $campaignId
				  setHidden: $setHidden
				) {
				  id
				  beaconName
				  hidden
				  meta {
					id
				  }
				}
			  }	  
				  `;

			const variables1 = { beaconIds: [beaconId1, beaconId2], campaignId: returnedUrl, setHidden: true };

			mutRequest(mutation, variables1).then((res) => {
				cy.log(res.body.data);
				const mutResponse = res.body.data.toggleBeaconHidden;

				const hiddenStatus = mutResponse.map((hidden) => hidden.hidden);
				expect(hiddenStatus).to.include(true, true);
			});

			const query = `query beacons($campaignId: String!, $hidden: Boolean) {
				beacons(campaignId: $campaignId, hidden: $hidden) {
				  id
				  beaconName
				  hidden
				  meta {
					id
				  }
				}
			  }
				  `;

			const variables2 = { campaignId: returnedUrl, hidden: true };

			graphqlRequest(query, variables2).then((res) => {
				const comp = res.body.data.beacons;
				cy.log(comp);
				// expect(comp.length).to.eq(2);

				const hiddenBeacons = res.body.data.beacons.map((hidden) => hidden.hidden);

				// expect(hiddenBeacons.length).to.eq(2);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Update beacon time of deathusing GraphQL', () => {
	const camp = 'beaconTodGraphQL';
	const newBeaconTod = '2020-08-17T19:37:00.000Z';

	it('Change beacon time of death', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const mutation = `mutation updateBeaconMetadata(
				$beaconId: String!
				$beaconTimeOfDeath: DateTime
				$campaignId: String!
			  ) {
				updateBeaconMetadata(
				  beaconId: $beaconId
				  beaconTimeOfDeath: $beaconTimeOfDeath
				  campaignId: $campaignId
				) {
				  id
				  beaconName
				  meta {
					id
					endTime
				  }
				}
			  }
			  
				  `;

			const variables = {
				beaconId: 'COMPUTER02-1166658656',
				beaconTimeOfDeath: newBeaconTod,
				campaignId: returnedUrl,
			};

			mutRequest(mutation, variables).then((res) => {
				const response = res.body.data.updateBeaconMetadata;

				const beaconIdName = response.beaconName;
				expect(beaconIdName).to.include('1166658656');

				const newTod = response.meta.map((time) => time.endTime);
				expect(newTod).to.include(newBeaconTod);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

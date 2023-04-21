import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Update beacon display name using GraphQL', () => {
	const camp = 'beaconNameaGraphQL';

	it('Change beacon display name', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

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

			const variables1 = `{"beaconId": "COMPUTER02-1166658656", "beaconTimeOfDeath": "2020-08-17T19:37:00.000Z", "campaignId": "${returnedUrl}"}`;
			mutRequest(mutation, variables1).then((res) => {
				cy.log(res.body.data);

				const response = res.body.data.updateBeaconMetadata;

				const beaconIdName = response.beaconName;
				expect(beaconIdName).to.include('1166658656');

				const newTod = response.meta.map((time) => time.endTime);
				expect(newTod).to.include('2020-08-17T19:37:00.000Z');
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

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
				$beaconDisplayName: String
				$beaconId: String!
				$campaignId: String!
			  ) {
				updateBeaconMetadata(
				  beaconDisplayName: $beaconDisplayName
				  beaconId: $beaconId
				  campaignId: $campaignId
				) {
				  id
				  beaconName
				  displayName
				  meta {
					id
				  }
				}
			  }
			  
				  `;

			const variables1 = `{"beaconDisplayName": "newName", "beaconId": "COMPUTER02-1166658656", "campaignId": "${returnedUrl}"}`;
			mutRequest(mutation, variables1).then((res) => {
				cy.log(res.body.data);

				const response = res.body.data.updateBeaconMetadata;

				const beaconIdName = response.beaconName;
				expect(beaconIdName).to.include('1166658656');

				const beaconData = response.displayName;
				expect(beaconData).to.include('newName');
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Update beacon display name using GraphQL', () => {
	const camp = 'beaconNameGraphQL';
	const newDisplayName = 'newName';

	it('Change beacon display name', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

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

			const variables = {
				beaconDisplayName: newDisplayName,
				beaconId: 'COMPUTER02-1166658656',
				campaignId: returnedUrl,
			};

			mutRequest(mutation, variables).then((res) => {
				const response = res.body.data.updateBeaconMetadata;

				const beaconIdName = response.beaconName;
				expect(beaconIdName).to.include('1166658656');

				const beaconData = response.displayName;
				expect(beaconData).to.include(newDisplayName);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

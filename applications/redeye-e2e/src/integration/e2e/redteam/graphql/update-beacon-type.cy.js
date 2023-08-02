import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Update beacon type using GraphQL', () => {
	const camp = 'beaconTypeGraphQL';
	const newBeaconType = 'smb';

	it('Change beacon type', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const mutation = `mutation updateBeaconMetadata(
				$beaconId: String!
				$beaconType: BeaconType
				$campaignId: String!
			  ) {
				updateBeaconMetadata(
				  beaconId: $beaconId
				  beaconType: $beaconType
				  campaignId: $campaignId
				) {
				  id
				  beaconName
				  meta {
					type
				  }
				}
			  }
			  
				  `;

			const variables = { beaconId: 'COMPUTER02-1166658656', beaconType: newBeaconType, campaignId: returnedUrl };

			mutRequest(mutation, variables).then((res) => {
				const response = res.body.data.updateBeaconMetadata;

				const beaconIdName = response.beaconName;
				expect(beaconIdName).to.include('1166658656');

				const newType = response.meta.map((type) => type.type);
				expect(newType).to.include(newBeaconType);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

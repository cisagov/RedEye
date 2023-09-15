import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Beacon using GraphQL', () => {
	const camp = 'hideBeaconGraphQL';
	const beaconId1 = 'COMPUTER02-1166658656';
	const beaconId2 = 'COMPUTER02-330588776';
	const beaconId3 = 'COMPUTER02-2146137244';

	it('Hide a beacon', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

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
				  hidden
				}
			  }	  
				  `;

			const variables1 = { beaconIds: [beaconId1, beaconId2, beaconId3], campaignId: returnedUrl, setHidden: true };

			mutRequest(mutation, variables1).then((res) => {
				const mutResponse = res.body.data.toggleBeaconHidden;

				const hiddenStatus = mutResponse.map((hidden) => hidden.hidden);
				expect(hiddenStatus).to.deep.equal([true, true, true]);
			});

			const query = `query beacons($campaignId: String!, $hidden: Boolean) {
				beacons(campaignId: $campaignId, hidden: $hidden) {
				  hidden
				}
			  }
				  `;

			const variables2 = { campaignId: returnedUrl, hidden: true };

			graphqlRequest(query, variables2).then((res) => {
				const qResp = res.body.data.beacons;

				const beaconStatus = Cypress._.filter(qResp, { hidden: true });
				cy.get(beaconStatus).its('length').should('equal', 3);
			});
		});
		cy.returnToCampaignCard();
		cy.doNotShowHiddenItems();
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		const beacs = [];
		cy.get('[cy-test=beacons-row]')
			.each(($li) =>
				beacs.push(`${$li.find('[cy-test=beacon-time]').text()}${$li.find('[cy-test=beacon-display-name]').text()}`)
			)
			.then(() => {
				cy.log(beacs.join(', '));
				cy.wrap(beacs).should('deep.equal', [
					'08/17—08/17COMPUTER03 / 500978634 · SYSTEM *',
					'08/17—08/17COMPUTER03 / 1042756528 · user01',
				]);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

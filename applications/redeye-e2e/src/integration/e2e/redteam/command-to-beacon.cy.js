// <reference types="cypress" />

const exp = require('constants');

describe('Navigate to beacon through command details', () => {
	const camp = 'commandtobeacon';
	const fileName = 'gt.redeye';

	it('Click details in command to go to beacon', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and select a host
		cy.selectCampaign(camp);
		cy.get('[cy-test=info-row]').eq(1).click();

		// Click to expand the first command
		cy.get('[cy-test=info-row]').eq(0).click();
		cy.wait(1000);

		// Log the beacon name
		cy.get('[cy-test=hostBeaconInfo]')
			.eq(0)
			.children()
			.eq(2)
			.invoke('text')
			.then((text) => {
				// Click on the beacon name
				cy.get('[cy-test=hostBeaconInfo]').contains(text).click();

				// Verify that the page directed to the appropriate beacon
				cy.get('[cy-test=panel-header]')
					.invoke('text')
					.then((beaconName) => {
						expect(beaconName).to.eq(text);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

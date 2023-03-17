/// <reference types="cypress" />

describe('Update Beacon metadata', () => {
	const camp = 'updatebeaconmetadata';
	const fileName = 'gt.redeye';
	const newBeaconName = 'Beacon 1';
	const newTOD = '08/17/20 13:33'; // could fail based on browser timezone // use moment.tz.guess() to offset?

	it('Rename a beacon and change time of death', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		cy.clickBeaconsTab();

		// Get current info for the beacon
		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').eq(0).click();

		cy.clickMetaTab();
		cy.get('[cy-test=beacon-display-name]')
			.invoke('attr', 'value')
			.then((resultBeacon1) => {
				// Change beacon name and save
				cy.get('[cy-test=beacon-display-name]').click().clear().type(newBeaconName);

				cy.get('[cy-test=save-beacon-name]').click();

				// Change TOD and save
				cy.get('input[type=text]').eq(1).click().clear().type(newTOD);
				cy.wait(500);
				cy.get('[cy-test=save-beacon-time-of-death]').click();

				// Verify new beacon name shows
				cy.clickExplorerMode();

				cy.clickBeaconsTab();

				cy.get('[cy-test=beacons-view]').should('contain', newBeaconName).and('not.contain', resultBeacon1);

				// Verify new TOD shows
				cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').contains(newBeaconName).click();
				cy.clickMetaTab();
				cy.get('[cy-test=beacon-time-of-death]')
					.find('.bp4-input')
					.invoke('attr', 'value')
					.then((resultTOD1) => {
						expect(resultTOD1).to.equal(newTOD);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

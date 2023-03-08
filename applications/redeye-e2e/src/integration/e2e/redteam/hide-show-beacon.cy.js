/// <reference types="cypress" />

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Hide beacon via Meta tab using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// // Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the name of the first beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.eq(0)
			.invoke('text')
			.then((beaconName) => {
				// Hide a beacon
				cy.get('[cy-test=beacons-row]').contains(beaconName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify beacon no longer shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify beacon now shows again
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Unhide the beacon
				cy.get('[cy-test=beacons-row]').contains(beaconName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Toggle off switch for hidden beacons
				cy.doNotShowHiddenItems();

				// Verify beacon shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	it('Hide beacon via Meta tab using toggle on main page', () => {
		// Toggle off switch for hidden beacons
		cy.doNotShowHiddenItems();

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the first beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.eq(0)
			.invoke('text')
			.then((beaconName) => {
				// Hide a beacon
				cy.get('[cy-test=beacons-row]').contains(beaconName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify beacon no longer shows
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Toggle switch back on
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Verify beacon now shows again
				cy.selectCampaign(camp);
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Unhide the beacon
				cy.get('[cy-test=beacons-row]').contains(beaconName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Toggle off switch for hidden beacons
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();

				// Verify beacon shows
				cy.selectCampaign(camp);
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	it('Hide beacon using the kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the first beacon
		cy.clickBeaconsTab();

		cy.get('[cy-test=beacon-display-name]')
			.eq(0)
			.invoke('text')
			.then((beaconName) => {
				// Hide the first beacon in the list
				cy.get('[cy-test=quick-meta-button]').eq(0).click();
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('be.visible').and('contain.text', 'Hiding this beacon');

				// Confirm that you want to hide the beacon
				cy.get('[cy-test=confirm-show-hide]').click();

				cy.wait(1000);

				// Verify hidden beacon does not show in the list
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName);
				});

				// Go to settings and toggle swtich to show hidden
				cy.showHiddenItems();

				// Verify hidden beacon now shows in the list again
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-view]').should('contain', beaconName);

				// Set beacon to show again
				cy.get('[cy-test=quick-meta-button]').eq(0).click();
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to show the beacon
				cy.get('[cy-test=confirm-show-hide]').click();

				cy.wait(1000);

				// Go to settings and toggle switch to not show hidden
				cy.doNotShowHiddenItems();

				// Verify host still appears in the list
				cy.clickBeaconsTab();

				cy.get('[cy-test=beacons-view]').should('contain', beaconName);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Hide last beacon', () => {
	const camp = 'hidelastbeacon';
	const fileName = 'smalldata.redeye';

	it('Should not be able to hide last beacon', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get name of first beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.eq(0)
			.invoke('text')
			.as('beacon')
			.then((beaconName1) => {
				// Hide the first beacon in the list
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.verifyDialogBoxAppears();

				// Confirm that you want to hide the beacon
				cy.confirmShowHide();

				// Navigate back to beacons list
				cy.clickBeaconsTab();

				// Confirm first beacon does not show in list
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName1);
				});
			});

		// Get name of second beacon
		cy.get('@beacon').then((beaconName2) => {
			// Hide the second beacon (now first showing in list)
			cy.showHideItem(0);

			// Verify confirmation modal appears
			cy.verifyDialogBoxAppears();

			// Confirm that you want to hide the beacon
			cy.confirmShowHide();

			// Navigate back to beacons list
			cy.clickBeaconsTab();

			// Confirm second beacon does not show in list
			cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
				expect($beacons.text()).to.not.contain(beaconName2);
			});
		});

		// Get name of third/last becaon
		cy.get('@beacon').then((beaconName3) => {
			// Try to hide the last beacon
			cy.showHideItem(0);

			// Verify notification appears saying it cannot be hidden
			cy.get('[cy-test=cannot-hide-final-text1]').should('exist');
			cy.get('[cy-test=cannot-hide-final-text2]').should('exist');

			// Click to confirm
			cy.confirmShowHide();

			// Navigate back to beacons list
			cy.clickBeaconsTab();

			// Verify last beacon still shows in UI
			cy.get('[cy-test=beacons-view]').should('contain', beaconName3);
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

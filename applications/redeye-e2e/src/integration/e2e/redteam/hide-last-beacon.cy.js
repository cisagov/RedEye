/// <reference types="cypress" />

function showHideConfirm(index) {
	// Hide the second beacon (now first showing in list)
	cy.showHideItem(index);

	// Verify confirmation modal appears
	cy.verifyDialogBoxAppears();

	// Confirm that you want to hide the beacon
	cy.confirmShowHide();
}

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
				showHideConfirm(0);

				// Confirm first beacon does not show in list
				cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
					expect($beacons.text()).to.not.contain(beaconName1);
				});
			});

		// Get name of second beacon
		cy.get('@beacon').then((beaconName2) => {
			// Hide the second beacon (now first showing in list)
			showHideConfirm(0);

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
			cy.verifyCannotHideFinal();

			// Click to confirm
			cy.confirmShowHide();

			// Verify last beacon still shows in UI
			cy.get('[cy-test=beacons-view]').should('contain', beaconName3);
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

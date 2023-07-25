/// <reference types="cypress" />

function showHideConfirm() {
	// Hide the second beacon (now first showing in list)
	cy.showHideItem(0);

	// Verify confirmation modal appears
	cy.verifyDialogBoxAppears();

	// Confirm that you want to hide the beacon
	cy.confirmShowHide();
}

describe('Hide last beacon', () => {
	const camp = 'hidelastbeacon';
	const fileName = 'gt.redeye';

	it('Should not be able to hide last beacon', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get beacon names and create array
		cy.clickBeaconsTab();
		const beacons = [];
		cy.get('[cy-test=beacon-display-name]').each(($beacon) => beacons.push($beacon.text()));
		cy.wrap(beacons).as('fullList').should('have.length', 5);

		// Hide first 2 beacons using bulk edit
		cy.clickBulkEdit();
		cy.get('[type=checkbox]').eq(0).check({ force: true });
		cy.get('[type=checkbox]').eq(1).check({ force: true });
		cy.get('[type=checkbox]').eq(2).check({ force: true });
		cy.get('[type=checkbox]').eq(4).check({ force: true });
		cy.clickBulkEdit();
		cy.bulkEditHide();

		// Verify first 4 no longer show
		cy.get('[cy-test=beacon-display-name]')
			.invoke('text')
			.should(($in) => {
				expect($in)
					.to.not.contain(beacons[0])
					.and.to.not.contain(beacons[1])
					.and.to.not.contain(beacons[2])
					.and.to.not.contain(beacons[4]);
			});

		// Try to hide the last beacon
		cy.showHideItem(0);

		// Verify last beacon still shows in UI
		cy.get('[cy-test = beacon-display-name]')
			.invoke('text')
			.should(($in) => {
				expect($in).to.contain(beacons[3]);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

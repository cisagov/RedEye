/// <reference types="cypress" />

function selectMultipleBeacons() {
	cy.get('[type=checkbox]').eq(0).check({ force: true });
	cy.get('[type=checkbox]').eq(1).check({ force: true });
	cy.get('[type=checkbox]').eq(2).check({ force: true });
}

describe('Bulk edit to hide beacons', () => {
	const camp = 'bulkEditHideBeacon';
	const fileName = 'gt.redeye';

	it('Can hide multiple beacons using Bulk Edit', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// // Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get beacon names and create array
		cy.clickBeaconsTab();

		const beacons = [];
		cy.get('[cy-test=beacons-row]').each(($beac) => beacons.push($beac.text()));
		cy.wrap(beacons).as('fullList').should('have.length', 5);

		// Use Bulk Edit to hide 3 beacons
		cy.clickBulkEdit();
		selectMultipleBeacons();
		cy.clickBulkEdit();
		cy.bulkEditHide();

		// Verify beacons no longer show
		cy.get('[cy-test=beacons-row]')
			.invoke('text')
			.should(($in) => {
				expect($in).to.not.contain(beacons[0]).and.to.not.contain(beacons[1]).and.to.not.contain(beacons[2]);
			});

		// Toggle switch back on
		cy.returnToCampaignCard();
		cy.showHiddenItems();
		cy.selectCampaign(camp);

		// Verify beacons now show again with the hidden icon
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').should('have.length', 5);
		cy.get('[cy-test=hidden]')
			.its('length')
			.then((hiddenCount) => {
				expect(hiddenCount).to.eq(3);
			});

		// Use Bulk Edit to unhide the beacons
		cy.clickBulkEdit();
		selectMultipleBeacons();
		cy.clickBulkEdit();
		cy.bulkEditShow();

		// Toggle off switch for hidden beacons
		cy.returnToCampaignCard();
		cy.doNotShowHiddenItems();
		cy.selectCampaign(camp);

		// // Verify beacons show
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').should('have.length', 5);
	});

	it('Verify Cancel button works for Bulk Edit', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Go to Beacons tab and log starting number of beacons
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').its('length').as('beaconCount').should('eq', 5);

		// Use Bulk Edit to select the first three
		cy.clickBulkEdit();
		selectMultipleBeacons();

		// Click Cancel button above Bulk Edit to cancel action
		cy.get('[cy-test=cancel]').click();

		// Toggle switch so that hidden items are not shown
		cy.doNotShowHiddenItems();

		// Verify beacon numbers are still the same
		cy.clickBeaconsTab();
		cy.get('@beaconCount').should('eq', 5);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

function selectMultipleBeacons() {
	cy.get('[type=checkbox]').eq(0).click({ force: true });
	cy.get('[type=checkbox]').eq(1).click({ force: true });
	cy.get('[type=checkbox]').eq(2).click({ force: true });
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

		// Get the names of the first 3 beacons
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacon-display-name]')
			.eq(0)
			.invoke('text')
			.then((beaconName1) => {
				cy.get('[cy-test=beacon-display-name]')
					.eq(1)
					.invoke('text')
					.then((beaconName2) => {
						cy.get('[cy-test=beacon-display-name]')
							.eq(2)
							.invoke('text')
							.then((beaconName3) => {
								// Use Bulk Edit to hide 3 beacons
								cy.clickBulkEdit();
								selectMultipleBeacons();
								cy.clickBulkEdit();
								cy.bulkEditHide();

								// Verify beacons no longer show
								cy.get('[cy-test=beacon-display-name]').each(($beacons) => {
									expect($beacons.text())
										.to.not.contain(beaconName1)
										.and.to.not.contain(beaconName2)
										.and.to.not.contain(beaconName3);
								});

								// Toggle switch back on
								cy.showHiddenItems();

								// Verify beacons now show again with the hidden icon
								cy.clickBeaconsTab();
								cy.get('[cy-test=beacons-view]')
									.invoke('text')
									.then((beaconList) => {
										expect(beaconList).to.include(beaconName1).and.to.include(beaconName2).and.to.include(beaconName3);
									});
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
								cy.doNotShowHiddenItems();

								// // Verify beacons show
								cy.clickBeaconsTab();
								cy.get('[cy-test=beacons-view]')
									.invoke('text')
									.then((beaconList) => {
										cy.log(beaconList);
										expect(beaconList).to.include(beaconName1).and.to.include(beaconName2).and.to.include(beaconName3);
									});
							});
					});
			});
	});

	it('Verify Cancel button works for Bulk Edit', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Go to Beacons tab and log starting number of beacons
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]')
			.its('length')
			.then((origBeaconRows) => {
				// Use Bulk Edit to select the first three
				cy.clickBulkEdit();
				selectMultipleBeacons();

				// Click Cancel button above Bulk Edit to cancel action
				cy.get('[cy-test=cancel]').click();

				// Toggle switch so that hidden items are not shown
				cy.doNotShowHiddenItems();

				// Verify beacon numbers are still the same
				cy.clickBeaconsTab();
				cy.get('[cy-test=beacons-row]')
					.its('length')
					.then((beaconRows) => {
						expect(beaconRows).to.eq(origBeaconRows);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

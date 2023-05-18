/// <reference types="cypress" />

function selectMultipleHosts() {
	cy.get('[type=checkbox]').eq(0).click({ force: true });
	cy.get('[type=checkbox]').eq(1).click({ force: true });
	cy.get('[type=checkbox]').eq(2).click({ force: true });
}

describe('Bulk edit to hide hosts', () => {
	const camp = 'bulkEditHideHost';
	const fileName = 'smalldata.redeye';

	it('Can hide multiple hosts using Bulk Edit', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// // Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the names of the first 3 hosts
		cy.get('[cy-test=info-row]')
			.eq(0)
			.invoke('text')
			.then((hostName1) => {
				cy.get('[cy-test=info-row]')
					.eq(1)
					.invoke('text')
					.then((hostName2) => {
						cy.get('[cy-test=info-row]')
							.eq(2)
							.invoke('text')
							.then((hostName3) => {
								// Use Bulk Edit to hide 3 hosts
								cy.clickBulkEdit();
								selectMultipleHosts();
								cy.clickBulkEdit();
								cy.bulkEditHide();

								// Verify hosts no longer show
								cy.get('[cy-test=info-row]').each(($hosts) => {
									expect($hosts.text())
										.to.not.contain(hostName1)
										.and.to.not.contain(hostName2)
										.and.to.not.contain(hostName3);
								});

								// Toggle switch back on
								cy.showHiddenItems();

								// Verify hosts now show again with the hidden icon
								cy.get('[data-test-id=virtuoso-item-list]')
									.invoke('text')
									.then((hostList) => {
										expect(hostList).to.include(hostName1).and.to.include(hostName2).and.to.include(hostName3);
									});
								cy.get('[cy-test=hidden]')
									.its('length')
									.then((hiddenCount) => {
										expect(hiddenCount).to.gte(3);
										// used gte since hiding some of these will hide other items nested under them
									});

								// Use Bulk Edit to unhide the hosts
								cy.clickBulkEdit();
								selectMultipleHosts();
								cy.clickBulkEdit();
								cy.bulkEditShow();

								// Toggle off switch for hidden items
								cy.doNotShowHiddenItems();

								// // Verify beacons show
								cy.get('[data-test-id=virtuoso-item-list]')
									.invoke('text')
									.then((hostList) => {
										expect(hostList).to.include(hostName1).and.to.include(hostName2).and.to.include(hostName3);
									});
							});
					});
			});
	});

	it('Verify Cancel button works for Bulk Edit', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Log starting number of hosts
		cy.get('[cy-test=info-row]')
			.its('length')
			.then((origHostRows) => {
				// Use Bulk Edit to select the first three
				cy.get('[cy-test=bulk-edit]').click();
				selectMultipleHosts();

				// Click Cancel button above Bulk Edit to cancel action
				cy.get('[cy-test=cancel]').click();

				// Toggle switch so that hidden items are not shown
				cy.doNotShowHiddenItems();

				// Verify beacon numbers are still the same
				cy.get('[cy-test=info-row]')
					.its('length')
					.then((hostRows) => {
						cy.log(hostRows);
						expect(hostRows).to.eq(origHostRows);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

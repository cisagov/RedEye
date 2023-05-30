/// <reference types="cypress" />

function selectMultipleHosts() {
	cy.get('[type=checkbox]').eq(0).check({ force: true });
	cy.get('[type=checkbox]').eq(1).check({ force: true });
	cy.get('[type=checkbox]').eq(2).check({ force: true });
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

		const hosts = [];
		cy.get('[cy-test=hostName]').each(($ho) => hosts.push($ho.text()));
		cy.wrap(hosts).as('fullList').should('have.length', 6);

		cy.clickBulkEdit();
		selectMultipleHosts();
		cy.clickBulkEdit();
		cy.bulkEditHide();

		cy.get('[cy-test=hostName]')
			.invoke('text')
			.should(($in) => {
				expect($in).to.not.contain(hosts[0]).and.to.not.contain(hosts[1]).and.to.not.contain(hosts[2]);
			});

		// Toggle switch back on
		cy.showHiddenItems();

		cy.get('[cy-test=hostName]').should('have.length', 6);

		// Use Bulk Edit to unhide the hosts
		cy.clickBulkEdit();
		selectMultipleHosts();
		cy.clickBulkEdit();
		cy.bulkEditShow();

		// Toggle off switch for hidden items
		cy.doNotShowHiddenItems();

		cy.get('[cy-test=hostName]').should('have.length', 6);
	});

	it('Verify Cancel button works for Bulk Edit', () => {
		// Search for new campaign by name.

		cy.selectCampaign(camp);

		// Log starting number of hosts
		cy.get('[cy-test=info-row]').its('length').as('hostsCount').should('eq', 6);

		// Use Bulk Edit to select the first three
		cy.clickBulkEdit();
		selectMultipleHosts();

		// Click Cancel button above Bulk Edit to cancel action
		cy.get('[cy-test=cancel]').click();

		// Toggle switch so that hidden items are not shown
		cy.doNotShowHiddenItems();

		// Verify beacon numbers are still the same
		cy.get('@hostsCount').should('eq', 6);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

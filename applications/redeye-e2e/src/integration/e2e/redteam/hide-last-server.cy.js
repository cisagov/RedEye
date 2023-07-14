/// <reference types="cypress" />

function showHideConfirm() {
	// Hide the first server in the list
	cy.showHideItem(0);

	// Verify confirmation modal appears
	cy.verifyDialogBoxAppears();

	// Confirm that you want to hide the server
	cy.confirmShowHide();
}

function tryToHideFinal() {
	// Try to hide the only server
	cy.showHideItem(0);

	// Verify notification appears saying it cannot be hidden
	cy.verifyCannotHideFinal();

	// Click to confirm
	cy.confirmShowHide();
}

describe('Hide last server', () => {
	const camp = 'hideonlyserver';
	const fileName = 'gt.redeye';
	const camp2 = 'hidelastserver';
	const fileName2 = 'smalldata.redeye';

	it('Should not be able to hide only server', () => {
		// NOTE: this dataset only has one server

		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get name of only server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('server')
			.then((serverName) => {
				// Try to hide the only server
				tryToHideFinal();

				// Verify last host still shows in UI
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});

		// Delete campaign
		cy.deleteCampaignGraphQL(camp);
	});

	it('Should not be able to hide last server', () => {
		cy.uploadCampaign(camp2, fileName2);

		// Search for new campaign by name
		cy.selectCampaign(camp2);

		// Get server names and create an array
		const servers = [];
		cy.get('[cy-test=hostName]').each(($server) => servers.push($server.text()));
		cy.wrap(servers).as('fullList').should('have.length', 6);

		// Use Bulk Edit to hide all by one
		cy.clickBulkEdit();
		cy.get('[type=checkbox]').eq(0).check({ force: true });
		cy.get('[type=checkbox]').eq(1).check({ force: true });
		cy.get('[type=checkbox]').eq(2).check({ force: true });
		cy.clickBulkEdit();
		cy.bulkEditHide();

		// Verify that those hidden no longer show
		cy.get('[cy-test=hostName]')
			.invoke('text')
			.should(($in) => {
				expect($in).to.not.contain(servers[0]).and.to.not.contain(servers[1]).and.to.not.contain(servers[2]);
			});

		// Get name of fourth/last server
		cy.get('[cy-test=hostName]')
			.invoke('text')
			.then((serverName4) => {
				// Try to hide the fourth/last server
				tryToHideFinal();

				// Verify last server still shows in UI
				cy.get('[cy-test=hosts-view]').should('contain', serverName4);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp2);
	});
});

/// <reference types="cypress" />

describe('Hide a server', () => {
	const camp = 'hideshowserver';
	const fileName = 'gt.redeye';

	it('Hide server via Meta tab using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the name of the server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Toggle off switch for hidden items
				cy.doNotShowHiddenItems();
				cy.wait(1000);

				// Verify server still shows
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Hide server via Meta tab using toggle on main page', () => {
		// Toggle off switch for hidden items on the main page
		cy.doNotShowHiddenItems();

		// Search for campaign by name and open
		cy.selectCampaign(camp);

		// Get the name of the server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('hiddenHost')
			.then((serverName) => {
				// Hide the server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on to show hidden items
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.clickMetaTab();
				cy.showHideServerMetaTab();

				// Toggle switch off to hide hidden items
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();

				// Go back into campaign and verify server still shows
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Hide server using the kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the first host
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide the server in the list
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to hide the server
				cy.confirmShowHide();

				// Verify list shows nothing (hiding server hides all hosts under it)
				// cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Go to settings and toggle swtich to show hidden
				cy.showHiddenItems();

				// Verify hidden server now shows in the list again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Set server to show again
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to show the host
				cy.confirmShowHide();

				// Go to settings and toggle switch to not show hidden
				cy.doNotShowHiddenItems();

				// Verify host still appears in the list
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

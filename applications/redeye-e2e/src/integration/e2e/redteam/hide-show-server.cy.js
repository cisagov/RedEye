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
		cy
			.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-server]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify list shows nothing (hiding server hides all hosts under it)
				cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-server]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

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
		cy
			.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('hiddenHost')
			.then((serverName) => {
				// Hide the server via the Meta tab
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-server]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify list shows nothing (hiding server hides all hosts under it)
				cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Toggle switch back on to show hidden items
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Verify hidden server now shows again
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Unhide the server
				cy.get('[cy-test=info-row]').contains(serverName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-server]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

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
		cy
			.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.then((serverName) => {
				// Hide the server in the list
				cy.get('[cy-test=show-hide-hover]').eq(0).trigger('mouseover');
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('[cy-test=show-hide-dialog-text]').should('exist');

				// Confirm that you want to hide the server
				cy.get('[cy-test=confirm-show-hide]').click();
				cy.wait(1000);

				// Verify list shows nothing (hiding server hides all hosts under it)
				cy.get('[cy-test=message-row]').contains('No Hosts').should('exist');

				// Go to settings and toggle swtich to show hidden
				cy.showHiddenItems();

				// Verify hidden server now shows in the list again
				cy.get('[cy-test=hosts-view]').should('contain', serverName);

				// Set server to show again
				cy.get('[cy-test=show-hide-hover]').eq(0).trigger('mouseover');
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('[cy-test=show-hide-dialog-text]').should('exist');

				// Confirm that you want to show the host
				cy.get('[cy-test=confirm-show-hide]').click();
				cy.wait(1000);

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

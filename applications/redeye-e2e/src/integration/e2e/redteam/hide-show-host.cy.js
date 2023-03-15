/// <reference types="cypress" />

describe('Hide a host', () => {
	const camp = 'hideshowhost';
	const fileName = 'gt.redeye';

	it('Hide host via Meta tab using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle switch to not show hidden items
		cy.doNotShowHiddenItems();

		// Get the name of the first host
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName) => {
				// Hide a host via the Meta tab
				cy.get('[cy-test=info-row]').contains(hostName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-host]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify host no longer shows
				cy.get('[cy-test=hostName]').each(($hosts) => {
					expect($hosts.text()).to.not.contain(hostName);
				});

				// Toggle switch back on
				cy.showHiddenItems();

				// Verify hidden host now shows again
				cy.get('[cy-test=hosts-view]').should('contain', hostName);

				// Unhide the host
				cy.get('[cy-test=info-row]').contains(hostName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-host]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Toggle off switch for hidden items
				cy.doNotShowHiddenItems();
				cy.wait(1000);

				// Verify host still shows
				cy.get('[cy-test=hosts-view]').should('contain', hostName);
			});
	});

	it('Hide host via Meta tab using toggle on main page', () => {
		// Toggle off switch for hidden items on the main page
		cy.doNotShowHiddenItems();

		// Search for campaign by name and open
		cy.selectCampaign(camp);

		// Get the name of the first host
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName) => {
				// Hide the host via the Meta tab
				cy.get('[cy-test=info-row]').contains(hostName).click();
				cy.get('[cy-test=Metadata]').click();

				cy.get('[cy-test=show-hide-this-host]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Verify host no longer shows
				cy.get('[cy-test=hostName]').each(($hosts) => {
					expect($hosts.text()).to.not.contain(hostName);
				});

				// Toggle switch back on to show hidden items
				cy.returnToCampaignCard();
				cy.showHiddenItems();

				// Go back into campaign and verify host now shows
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', hostName);

				// Unhide the host
				cy.get('[cy-test=info-row]').contains(hostName).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-host]').click();
				cy.get('[cy-test=confirm-show-hide]').click();

				// Toggle switch off to hide hidden items
				cy.returnToCampaignCard();
				cy.doNotShowHiddenItems();

				// Go back into campaign and verify host still shows
				cy.selectCampaign(camp);
				cy.get('[cy-test=hosts-view]').should('contain', hostName);
			});
	});

	it('Hide host using the kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get the name of the first host
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName) => {
				// Hide the first host (not server) in the list
				cy.get('[cy-test=quick-meta-button]').eq(1).click();
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to hide the host
				cy.get('[cy-test=confirm-show-hide]').click();
				cy.wait(1000);

				// Verify hidden host does not show in the list
				cy.get('[cy-test=hostName]').each(($hosts) => {
					expect($hosts.text()).to.not.contain(hostName);
				});

				// Go to settings and toggle swtich to show hidden
				cy.showHiddenItems();

				// Verify hidden host now shows in the list again
				cy.get('[cy-test=hosts-view]').should('contain', hostName);

				// Set host to show again
				cy.get('[cy-test=quick-meta-button]').eq(1).click();
				cy.get('[cy-test=show-hide-item]').click();

				// Verify confirmation modal appears
				cy.get('.bp4-dialog-body').should('exist');

				// Confirm that you want to show the host
				cy.get('[cy-test=confirm-show-hide]').click();
				cy.wait(1000);

				// Go to settings and toggle switch to not show hidden
				cy.doNotShowHiddenItems();

				// Verify host still appears in the list
				cy.get('[cy-test=hosts-view]').should('contain', hostName);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

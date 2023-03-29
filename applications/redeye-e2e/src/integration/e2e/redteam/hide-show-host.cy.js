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
				cy.clickMetaTab();
				cy.showHideHostMetaTab();

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
				cy.clickMetaTab();
				cy.showHideHostMetaTab();

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
				cy.clickMetaTab();
				cy.showHideHostMetaTab();

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
				cy.clickMetaTab();
				cy.showHideHostMetaTab();

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
				cy.showHideItem(1);

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
				cy.showHideItem(1);

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

	it('Verify Cancel button works from Meta tab', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Select the first host, go to Meta tab, click show/hide link
		cy.get('[cy-test=hostName]').eq(1).click();
		cy.clickMetaTab();
		cy.get('[cy-test=show-hide-this-host]').click();

		// Verify modal shows; click Cancel
		cy.get('[cy-test=dialog-text-line1]').should('exist');
		cy.get('[cy-test=dialog-text-line2]').should('exist');
		cy.get('[cy-test=dialog-text-line3]').should('exist');

		cy.get('[cy-test=cancel-show-hide]').click();

		// Verify modal disappears
		cy.get('[cy-test=dialog-text-line1]').should('not.exist');
		cy.get('[cy-test=dialog-text-line2]').should('not.exist');
		cy.get('[cy-test=dialog-text-line3]').should('not.exist');

		// Verify the Meta tab link says "Hide this host" vs. "Show"
		cy.get('[cy-test=show-hide-this-host]').invoke('text').should('eq', 'Hide this host');
	});

	it('Verify Cancel button works from kebab menu', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Click kebab menu for first hostto bring up options; click "Hide Host"
		cy.get('[cy-test=quick-meta-button]').eq(1).click();
		cy.get('[cy-test=show-hide-item]').click();

		// Verify modal shows; click Cancel
		cy.get('[cy-test=dialog-text-line1]').should('exist');
		cy.get('[cy-test=dialog-text-line2]').should('exist');
		cy.get('[cy-test=dialog-text-line3]').should('exist');

		cy.get('[cy-test=cancel-show-hide]').click();

		// Verify modal disappears
		cy.get('[cy-test=dialog-text-line1]').should('not.exist');
		cy.get('[cy-test=dialog-text-line2]').should('not.exist');
		cy.get('[cy-test=dialog-text-line3]').should('not.exist');

		// Verify the kebab menu link still says "Hide Host" vs. "Show"
		cy.get('[cy-test=quick-meta-button]').eq(1).click();
		cy.get('[cy-test=show-hide-item]').invoke('text').should('eq', 'Hide  Host');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

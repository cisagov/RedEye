/// <reference types="cypress" />

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Toggle hide/show switch using left nav panel', () => {
		cy.uploadCampaignBlue(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle off switch for hidden beacons
		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });

		cy.closeRawLogs();

		cy.clickBeaconsTab();

		// Verify unable to hide/show new beacons/host
		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').eq(0).click();

		cy.clickMetaTab();

		cy.get('[cy-test=show-hide-this-beacon]').should('be.disabled');
	});

	it('Toggle hide/show switch from main page', () => {
		// Toggle off switch for hidden beacons
		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').check({ force: true });

		cy.closeRawLogs();

		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });
	});

	it.skip('Verify Hide option is disabled in kebab menu', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Navigate to the Beacons tab and open kebab menu for first beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').should('be.disabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

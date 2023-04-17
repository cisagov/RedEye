/// <reference types="cypress" />

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Toggle hide/show switch using left nav panel', () => {
		cy.uploadCampaignBlue(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle off switch for hidden beacons
		cy.doNotShowHiddenItems();

		// Toggle switch back on
		cy.showHiddenItems();
	});

	it('Toggle hide/show switch from main page', () => {
		// Toggle off switch for hidden beacons
		cy.doNotShowHiddenItems();

		// Toggle switch back on
		cy.showHiddenItems();
	});

	it('Verify Hide button is disabled in Meta tab', () => {
		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Go to Beacons tab; open first beacon; go to Meta tab
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.clickMetaTab();

		// Verify unable to hide/show new beacons/host
		cy.get('[cy-test=show-hide-this-beacon]').should('be.disabled');
	});

	it('Toggle hide/show switch from main page', () => {
		// Toggle off switch for hidden beacons
		cy.get('[cy-test=settings]').click();

		// Navigate to the Beacons tab and open kebab menu for first beacon
		cy.clickBeaconsTab();
		cy.get('[cy-test=quick-meta-button]').eq(0).click();
		cy.get('[cy-test=show-hide-item]').should('be.disabled');
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

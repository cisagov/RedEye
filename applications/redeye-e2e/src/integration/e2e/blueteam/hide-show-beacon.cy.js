/// <reference types="cypress" />

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Hide beacon using toggle in left nav panel', () => {
		cy.uploadCampaignBlue(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle off switch for hidden beacons
		cy.get('[cy-test=general-settings]').click();

		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });

		cy.closeRawLogs();

		cy.clickBeaconsTab();

		// Verify unable to hide/show new beacons/host
		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').eq(0).click();

		cy.get('[cy-test=Metadata]').click();

		cy.get('[cy-test=show-hide-this-beacon]').should('be.disabled');
	});

	it('Hide beacon using toggle on main page', () => {
		// Toggle off switch for hidden beacons
		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').check({ force: true });

		cy.closeRawLogs();

		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

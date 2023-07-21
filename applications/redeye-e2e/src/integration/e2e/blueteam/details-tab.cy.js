/// <reference types="cypress" />

describe('Details tab fields disabled', () => {
	const camp = 'detailstab';
	const fileName = 'gt.redeye';

	it('Cannot update beacon info via Details tab', () => {
		// Upload campaign and open
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		// Go to Beacons tab
		cy.clickBeaconsTab();

		// Select beacon and go to Details tab
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.clickDetailsTab();

		// Verify Display Name, TOD, and Type fields are disabled
		cy.get('[cy-test=beacon-display-name]').should('be.disabled');
		cy.get('[cy-test=save-beacon-time-of-death]').should('be.disabled');
		cy.get('[cy-test=type-dropdown]').should('be.disabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

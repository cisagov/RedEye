/// <reference types="cypress" />

describe('Redacted mode toggle', () => {
	const camp = 'toggleredactedmode';
	const fileName = 'gt.redeye';

	it('Toggle Redacted mode within a campaign', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickGeneralSettings();
		cy.get('[cy-test=toggle-redacted-mode]').check({ force: true });
		cy.get('[cy-test=close-log]').click();

		cy.get('#root').should('have.css', 'RedactedFont');

		// cy.get('[cy-test=toggle-redacted-mode]').click()

		// cy.get('[cy-test=graph]').should('have.css', 'color-scheme', 'dark');
	});

	// it('Toggle Redacted mode from campaign menu', () => {
	// 	cy.toggleLightTheme();

	// 	cy.get('#root').should('have.css', 'color-scheme', 'light');

	// 	cy.toggleDarkTheme();

	// 	cy.get('#root').should('have.css', 'color-scheme', 'dark');
	// });

	// after(() => {
	// 	cy.deleteCampaignGraphQL(camp);
	// });
});

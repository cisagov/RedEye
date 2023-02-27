/// <reference types="cypress" />

describe('Light Theme Test', () => {
	const camp = 'togglethemes';
	const fileName = 'gt.redeye';

	it('Toggle Themes From Campaign', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.toggleLightTheme();

		cy.get('[cy-test=graph]').should('have.css', 'color-scheme', 'light');

		cy.toggleDarkTheme();

		cy.get('[cy-test=graph]').should('have.css', 'color-scheme', 'dark');
	});

	it('Toggle Themes From Explorer Card', () => {
		cy.toggleLightTheme();

		cy.get('#root').should('have.css', 'color-scheme', 'light');

		cy.toggleDarkTheme();

		cy.get('#root').should('have.css', 'color-scheme', 'dark');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Redacted mode toggle', () => {
	const camp = 'toggleredactedmode';
	const fileName = 'gt.redeye';

	it('Toggle Redacted mode within a campaign', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.toggleRedacted();

		cy.get('#root').should('have.css', 'font', '14px / 18.2px "Redacted Script"');

		cy.toggleUnredacted();

		cy.get('#root').should(
			'have.css',
			'font',
			'14px / 18.2px "IBM Plex Sans", "Helvetica Neue", -apple-system, "Segoe UI", Arial, sans-serif'
		);
	});

	it('Toggle Redacted mode from campaign menu', () => {
		cy.toggleRedacted();

		cy.get('#root').should('have.css', 'font', '14px / 18.2px "Redacted Script"');

		cy.toggleUnredacted();

		cy.get('#root').should(
			'have.css',
			'font',
			'14px / 18.2px "IBM Plex Sans", "Helvetica Neue", -apple-system, "Segoe UI", Arial, sans-serif'
		);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

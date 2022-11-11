/// <reference types="cypress" />

describe('Testing of graph', () => {
	const camp = 'selecthost';
	const fileName = 'gt.redeye';

	it('Test Graph', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		if (Cypress.isBrowser({ family: 'chromium' })) {
			cy.get('[cy-test=graphNode]').eq(1).click({ force: true });

			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=selectedLabel]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=command-info]').should('contain.text', 'sleep');
		}

		if (Cypress.isBrowser('firefox')) {
			cy.get('[cy-test=graphNode]').eq(0).click({ force: true });

			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=selectedLabel]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=command-info]').should('contain.text', 'sleep');
		}
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

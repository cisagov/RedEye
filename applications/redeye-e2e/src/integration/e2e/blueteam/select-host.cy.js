/// <reference types="cypress" />

describe('Testing of graph', () => {
	const camp = 'selecthost';
	const fileName = 'gt.redeye';

	it('Test Graph', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		if (Cypress.isBrowser({ family: 'chromium' })) {
			cy.get('[id=COMPUTER02]').click({ force: true });

			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=selectedLabel]').should('contain.text', 'COMPUTER02');

			cy.get('[cy-test=command-info]').should('contain.text', 'sleep');
		}

		if (Cypress.isBrowser('firefox')) {
			cy.get('[id=COMPUTER02]').click({ force: true });

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

/// <reference types="cypress" />

describe('Selecting Host Via Graph', () => {
	const camp = 'selectbeacon';
	const fileName = 'gt.redeye';

	it('Test Graph', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		if (Cypress.isBrowser({ family: 'chromium' })) {
			//Host Win-10-02

			cy.get('[cy-test=graph]').within((g) => {
				cy.get('[id=COMPUTER03]').click({ force: true });
			});
			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER03');

			// //return to main page
			cy.returnToCampaignCard();
		}

		if (Cypress.isBrowser('firefox')) {
			cy.get('[cy-test=graph]').within((g) => {
				cy.get('[id=COMPUTER03]').click({ force: true });
			});
			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER03');

			// //return to main page
			cy.returnToCampaignCard();
		}
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

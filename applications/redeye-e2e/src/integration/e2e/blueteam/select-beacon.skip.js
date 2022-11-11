/// <reference types="cypress" />

describe('Selecting Host Via Graph', () => {
	const camp = 'selectbeacon';
	const fileName = 'gt.redeye';

	it('Test Graph', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		if (Cypress.isBrowser({ family: 'chromium' })) {
			//Host Win-10-02
			cy.get('[cy-test=graph]').within((g) => {
				cy.wrap(g).find('[cy-test=graphNode]').eq(2).click({ force: true });
			});

			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER03');

			// //return to main page
			cy.get('[cy-test=return-campaign-menu').click();
		}

		if (Cypress.isBrowser('firefox')) {
			cy.get('[cy-test=graph]').within((g) => {
				cy.wrap(g).find('[cy-test=graphNode]').eq(1).click({ force: true });
			});
			cy.wait(1000);

			cy.get('[cy-test=panel-header]').should('contain.text', 'COMPUTER03');

			// //return to main page
			cy.get('[cy-test=return-campaign-menu').click();
		}
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

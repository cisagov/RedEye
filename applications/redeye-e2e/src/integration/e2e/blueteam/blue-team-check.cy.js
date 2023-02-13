/// <reference types="cypress" />

describe('Verify Blue Team Version is Opened', () => {
	const camp = 'blueteamversioncheck';
	const fileName = 'gt.redeye';

	it('Verify Blue Team Version Is Shown', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.get('[cy-test=BT]').should('be.visible').and('contain.text', 'BT');

		cy.get('[cy-test=BT]').should('have.css', 'background-color').and('eq', 'rgb(16, 100, 254)');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

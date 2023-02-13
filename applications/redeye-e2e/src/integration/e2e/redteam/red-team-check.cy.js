/// <reference types="cypress" />

describe('Verify Red Team Version is Opened', () => {
	const camp = 'redteamversioncheck';
	const fileName = 'gt.redeye';

	it('Verify Red Team Version Is Shown', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.get('[cy-test=RT]').should('be.visible').and('contain.text', 'RT');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

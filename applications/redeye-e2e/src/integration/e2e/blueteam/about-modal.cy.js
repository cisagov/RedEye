/// <reference types="cypress" />

describe('Verify About Modal', () => {
	const camp = 'aboutmodal';
	const fileName = 'gt.redeye';

	it('About Modal in Campaign Card Screen', () => {
		cy.clickAboutOnCampaignCard();
	});

	it('About Modal in Explore Campaign', () => {
		cy.uploadCampaignBlue(camp, fileName);
		cy.selectCampaign(camp);
		cy.clickAboutModal();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

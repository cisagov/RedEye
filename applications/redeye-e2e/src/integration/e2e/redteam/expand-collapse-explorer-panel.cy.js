/// <reference types="cypress" />

describe('Expand/collapse explorer panel', () => {
	const camp = 'expandcollapse';
	const fileName = 'gt.redeye';

	it('Explorer panel can be collapsed and expanded', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		// Verify explorer panel is expanded by default when opening a campaign
		cy.get('[cy-test=hosts]').should('be.visible');
		cy.get('[cy-test=operators]').should('be.visible');
		cy.get('[cy-test=comments]').should('be.visible');
		cy.get('[cy-test=beacons]').should('be.visible');
		cy.get('[cy-test=command-overview]').should('be.visible');

		// Click collapse button and verify panel is collapsed
		cy.get('[cy-test=collapse-panel]').realClick();
		cy.get('[cy-test=hosts]').should('not.be.visible');
		cy.get('[cy-test=operators]').should('not.be.visible');
		cy.get('[cy-test=comments]').should('not.be.visible');
		cy.get('[cy-test=beacons]').should('not.be.visible');
		cy.get('[cy-test=command-overview]').should('not.be.visible');

		// Click button again and verify panel is expanded
		cy.get('[cy-test=expand-panel]').eq(0).realClick();
		cy.get('[cy-test=hosts]').should('be.visible');
		cy.get('[cy-test=operators]').should('be.visible');
		cy.get('[cy-test=comments]').should('be.visible');
		cy.get('[cy-test=beacons]').should('be.visible');
		cy.get('[cy-test=command-overview]').should('be.visible');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

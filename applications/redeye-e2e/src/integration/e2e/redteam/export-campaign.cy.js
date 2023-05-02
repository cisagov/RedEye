/// <reference types="cypress" />

describe('Export a campaign', () => {
	const camp = 'exportcampaign';
	const fileName = 'gt.redeye';

	it('Red Team - Verify Red Team file is generated when a campaign is exported', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for campaign, open options, choose Export
		cy.searchForCampaign(camp);
		cy.get('[cy-test=campaign-options]').realClick();
		cy.get('[cy-test=export-campaign]').realClick();

		// Verify boxes are unchecked for a Red Team-friendly file
		cy.get('[cy-test=red-team-export]').realClick();
		cy.get('[cy-test=export-checkbox-option]').eq(0).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(1).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(2).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(3).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(4).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(5).should('not.be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(6).should('not.be.checked');

		// Click the export button
		cy.get('[cy-test=export-database]').realClick();
		cy.readFile('cypress/downloads/exportcampaign.redeye');
	});

	it('Blue Team - Verify Blue Team file is generated when a campaign is exported', () => {
		// Search for campaign, open options, choose Export
		cy.searchForCampaign(camp);
		cy.get('[cy-test=campaign-options]').realClick();
		cy.get('[cy-test=export-campaign]').realClick();

		// Verify boxes are checked for a Blue Team-friendly file (default option)
		cy.get('[cy-test=export-checkbox-option]').eq(0).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(1).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(2).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(3).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(4).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(5).should('be.checked');
		cy.get('[cy-test=export-checkbox-option]').eq(6).should('be.checked');

		// Click the export button
		cy.get('[cy-test=export-database]').realClick();
		cy.readFile('cypress/downloads/exportcampaign.redeye');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

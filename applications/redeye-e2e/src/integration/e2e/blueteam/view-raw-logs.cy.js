/// <reference types="cypress" />

function verifyRawLogs() {
	cy.get('[cy-test=log-title]').should('be.visible');
	cy.get('[cy-test=scroll-to-top]').should('be.visible');
	cy.get('[cy-test=copyLogs]').should('be.visible');
	cy.get('[cy-test=log]').should('be.visible');
	cy.get('[cy-test=close-log]').should('be.visible');
}

describe('View Raw Logs', () => {
	const camp = 'viewrawlogs';
	const fileName = 'gt.redeye';

	it('Can open/view raw logs from Commands', () => {
		cy.uploadCampaignBlue(camp, fileName);

		// Open campaign, go to Commands, select command
		cy.selectCampaign(camp);
		cy.clickCommandTypesTab();
		cy.selectCommandType('ps');

		// Expand first command
		cy.get('[cy-test=info-row]').eq(0).click();
		cy.wait(500);
		cy.get('[cy-test=openRawLogs]').should('be.visible').click();

		verifyRawLogs();
	});

	it('Can open/view raw logs from Comments', () => {
		// Open campaign; go to Comments
		cy.selectCampaign(camp);
		cy.clickCommentsTab();

		// Click expandable row under first comment
		cy.get('[cy-test=command-info]').eq(0).click();
		cy.wait(500);
		cy.get('[cy-test=openRawLogs]').should('be.visible').click();

		verifyRawLogs();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

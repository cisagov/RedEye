/// <reference types="cypress" />

describe('Check and verify screenshots are available', () => {
	const camp = 'screenshotcheck';
	const fileName = 'gt.redeye';

	it('Verify screenshots are viewable in Command Types', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType('screenshot');

		cy.expandInfoRow(0);

		cy.get('[cy-test=screenshot]').should('be.visible');

		cy.get('[cy-test=screenshot]').click();

		cy.get('[cy-test=large-screenshot]').should('be.visible');

		cy.closeRawLogs();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

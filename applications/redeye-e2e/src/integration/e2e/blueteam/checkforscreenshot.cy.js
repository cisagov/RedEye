/// <reference types="cypress" />

describe('Check and verify screenshots are available', () => {
	const camp = 'screenshotcheck';
	const fileName = 'gt.redeye';

	it('Verify screenshots are viewable', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType('screenshot');

		cy.expandInfoRow(0);

		cy.get('[cy-test=screenshot]').should('be.visible');

		cy.get('[cy-test=screenshot]').realClick();

		cy.get('[cy-test=large-screenshot]').should('be.visible');

		cy.closeRawLogs();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

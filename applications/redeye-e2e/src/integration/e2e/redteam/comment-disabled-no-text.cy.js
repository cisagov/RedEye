/// <reference types="cypress" />

describe('Cannot add comment without text', () => {
	const camp = 'commentbuttondisabled';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';
	const comment = 'Test comment';
	const tag = 'testing';

	it('Verify comment button is disabled when there is no text', () => {
		// Upload and open campaign
		cy.uploadCampaign(camp, fileName);
		cy.selectCampaign(camp);

		// Open command, try to add comment with no text, verify button is disabled
		cy.clickExplorerMode();
		cy.clickCommandTypesTab();
		cy.selectCommandType(cmd);
		cy.wait(1000);
		cy.get('[cy-test=command-info] [cy-test=add-comment]')
			.eq(0)
			.invoke('attr', 'style', 'visibility: visible')
			.should('be.visible')
			.click({ force: true });
		cy.get('[cy-test=save-comment]').should('be.disabled');

		// Add a tag only (no comment), verify button is still disabled
		cy.get('[cy-test=tag-input]').type(tag);
		cy.get('[cy-test=add-tag]').contains(tag).click({ force: true });
		cy.get('[cy-test=save-comment]').should('be.disabled');

		// Type in comment box, verify button is enabled
		cy.get('[cy-test=comment-input]').click().type(comment);
		cy.get('[cy-test=save-comment]').should('be.enabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

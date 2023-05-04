/// <reference types="cypress" />
import 'cypress-map';

describe('Add Delete Campaign Comments', () => {
	const camp = 'addDeleteComments';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';
	// const comment = 'Another comment';
	// const tag = 'testing';

	let count;

	it('Add campaign comments and check counts', () => {
		cy.uploadCampaign(camp, fileName);
		cy.searchForCampaign(camp);

		cy.get('[cy-test=comment-count] > span')
			.map('innerText')
			.map(parseInt)
			.reduce(Cypress._.add, 0)
			.as('campaignCommentCount')
			.asEnv('campaignCommentCount')
			.should('equals', 5);

		// Open campaign and log starting number of comments via Comments tab
		cy.selectCampaign(camp);
		cy.clickCommentsTab();

		cy.get('[cy-test=comment-group]')
			.map('innerText')
			.as('commentsTabCount')
			.asEnv('commentsTabCount')
			.should('have.length', 5);

		// Log starting number of comments via Presentation Mode
		cy.clickPresentationMode();
		cy.get('[cy-test=all] [cy-test=count]')
			.map('innerText')
			.map(parseInt)
			.reduce(Cypress._.add, 0)
			.as('presentationCommentCount')
			.asEnv('presentationCommentCount')
			.should('equals', 5);

		// Add a new comment
		cy.clickExplorerMode();
		cy.clickCommandTypesTab();
		cy.selectCommandType(cmd);
		cy.addNewComment('0', 'Another comment', 'testing');

		cy.clickPresentationMode();
		cy.get('@presentationCommentCount').should('equals', 6);

		// Log new number of comments via Comments tab - should be 1 more
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		cy.get('@commentsTabCount').should('have.length', 6);

		cy.returnToCampaignCard();
		cy.searchForCampaign(camp);
		cy.get('@campaignCommentCount').should('equals', 6);
	});

	it('Delete campaign comments and check counts', () => {
		// Open campaign, go to command, delete a comment
		cy.selectCampaign(camp);
		cy.clickCommandTypesTab();
		cy.selectCommandType(cmd);
		cy.deleteComment(0);

		cy.clickPresentationMode();
		expect(Cypress.env('presentationCommentCount')).to.equal(5);

		// Log new number of comments via Comments tab - should be 1 less
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		expect(Cypress.env('commentsTabCount')).to.have.length(5);

		// Return to campaign menu and log new number of comments - should be one less than original, and all comment counts should match
		cy.returnToCampaignCard();
		cy.searchForCampaign(camp);
		expect(Cypress.env('campaignCommentCount')).to.equal(5);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

const user = 'cypress';
describe('Username shows on comments when appropriate', () => {
	const camp = 'username';
	const fileName = 'gt.redeye';
	const normalizeText = (s) => s.replace(/\s/g, '').toLowerCase();

	it('Username should not appear when favoriting a comment', () => {
		// Upload campaign and log username
		cy.uploadCampaign(camp, fileName);

		// Open campaign, find an existing comment, and mark it as a favorite
		cy.selectCampaign(camp);

		cy.clickCommentsTab();

		cy.viewAllComments();

		cy.favoriteComment(0);

		// Verify username does not show anywhere in the comment box info
		cy.get('[cy-test="user-that-commented"]')
			.eq(0)
			.should(($commentInfo1) => {
				const name = normalizeText($commentInfo1.text());
				expect(name).to.not.eq(user);
			});
	});

	it('Username should appear when comment is edited', () => {
		cy.selectCampaign(camp);

		// Find an existing comment and edit it
		cy.selectHostByName('COMPUTER03');
		cy.clickCommentsTabWithinTab();
		cy.editExistingComment(0, 'Edited comment');

		// Verify username shows in the comment box info
		cy.wait(500);

		cy.get('[cy-test=comment-group]')
			.eq(0)
			.invoke('text')
			.then((commentInfo2) => {
				expect(commentInfo2).to.contain(user);
			});
	});

	it('Username should appear when new comment is made', () => {
		cy.selectCampaign(camp);

		// Add a new comment
		cy.clickExplorerMode();
		cy.clickCommandTypesTab();
		cy.selectCommandType('dcsync');
		cy.addNewComment('0', 'New comment', 'newtag');

		// Verify username shows in comment box info
		cy.get('[cy-test=existing-comment-display]')
			.invoke('text')
			.then((commentInfo3) => {
				expect(commentInfo3).to.contain(user);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

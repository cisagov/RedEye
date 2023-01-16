/// <reference types="cypress" />

describe('Username shows on comments when appropriate', () => {
	const camp = 'username';
	const fileName = 'gt.redeye';

	it('Username should not appear when favoriting a comment', () => {
		// Upload campaign and log username
		cy.uploadCampaign(camp, fileName);
		cy
			.get('[cy-test=user]')
			.invoke('text')
			.then((username) => {
				// cy.log(username)

				// Open campaign, find an existing comment, and mark it as a favorite
				cy.selectCampaign(camp);

				cy.clickCommentsTab();
				cy.favoriteComment(0);

				// Verify username does not show anywhere in the comment box info
				cy
					.get('[cy-test=comment-group]')
					.eq(0)
					.invoke('text')
					.then((commentInfo1) => {
						// cy.log(commentInfo1)
						expect(commentInfo1).to.not.contain(username);
					});
			});
	});

	it('Username should appear when comment is edited', () => {
		// Log username and open campaign
		cy
			.get('[cy-test=user]')
			.invoke('text')
			.then((username) => {
				// cy.log(username)

				cy.selectCampaign(camp);

				// Find an existing comment and edit it
				cy.selectHostByName('COMPUTER03');
				cy.clickCommentsTab();
				cy.editExistingComment(0, 'Edited comment');

				// Verify username shows in the comment box info
				cy.wait(500);
				cy
					.get('[cy-test=comment-group]')
					.eq(0)
					.invoke('text')
					.then((commentInfo2) => {
						cy.log(commentInfo2);
						expect(commentInfo2).to.contain(username);
					});
			});
	});

	it('Username should appear when new comment is made', () => {
		// Log username and open campaign
		cy
			.get('[cy-test=user]')
			.invoke('text')
			.then((username) => {
				// cy.log(username)

				cy.selectCampaign(camp);

				// Add a new comment
				cy.clickExplorerMode();
				cy.clickCommandTypesTab();
				cy.selectCommandType('dcsync');
				cy.addNewComment('0', 'New comment', 'newtag');

				// Verify username shows in comment box info
				cy
					.get('[cy-test=existing-comment-display]')
					.invoke('text')
					.then((commentInfo3) => {
						cy.log(commentInfo3);
						expect(commentInfo3).to.contain(username);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

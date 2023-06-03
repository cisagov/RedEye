/// <reference types="cypress" />

describe('Pending comments', () => {
	const camp = 'pendingcomments';
	const fileName = 'gt.redeye';

	const commentText = 'PENDING COMMENT';

	it('Pending comment should persist when navigating away', () => {
		// Upload campaign and open
		cy.uploadCampaign(camp, fileName);
		cy.selectCampaign(camp);

		// Go to Beacons tab, select a beacon, then start a new comment on a command
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.addComment(0, commentText);

		// Navigate away from the current page
		cy.clickExplorerMode();

		// Navigate back to pending comment and make sure it's still there
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.get('[cy-test=add-comment]').eq(0).click();
		cy.get('[cy-test=comment-input]').should('contain', commentText);
	});

	it('Pending comment should not persist after clicking Cancel button', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Beacons tab, select a beacon, then start a new comment on a command
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.addComment(0, 'PENDING COMMENT');

		// Navigate away from the current page
		cy.clickExplorerMode();

		// Navigate back to pending comment and click Cancel button
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.get('[cy-test=add-comment]').eq(0).click();
		cy.get('[cy-test=cancel-comment]').click();

		// Go to Comments tab and verify the comment did not persist
		cy.clickCommentsTabWithinTab();
		cy.get('[cy-test=message-row]').should('not.contain', commentText);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

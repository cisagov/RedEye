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
		cy.addComment(0, commentText);

		// Navigate away from the current page
		cy.clickExplorerMode();

		// Navigate back to pending comment and click Cancel button
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.get('[cy-test=add-comment]').eq(0).click();
		cy.get('[cy-test=cancel-comment]').click();

		// Verify the pending comment is gone
		cy.get('[cy-test=comment-dialog]').should('not.contain', commentText);
	});

	it('Pending comment should not appear in All Comments list in Presentation mode', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Log starting number of comments in Presentation mode
		cy.clickPresentationMode();
		cy.get('[cy-test=all]').within(() => {
			cy.get('[cy-test=count]').invoke('text').as('origCount');
		});

		// Go to Beacons tab, select a beacon, then start a new comment on a command
		cy.clickExplorerMode();
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.addComment(0, commentText);

		// Go back to Presentation mode and verify comment count is still the same
		cy.clickPresentationMode();
		cy.get('[cy-test=all]').within(() => {
			cy.get('[cy-test=count]').invoke('text').as('updatedCount');
		});

		cy.get('@origCount').then((origCount) => {
			cy.get('@updatedCount').then((updatedCount) => {
				expect(updatedCount).to.eq(origCount);
			});
		});
	});

	it('Pending comment should not appear in Comments tab in Explorer mode', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Click Comments tab and log starting number of All Comments
		cy.clickCommentsTab();
		cy.get('[cy-test=comment-count]').eq(0).invoke('text').as('origCount');

		// Go to Beacons tab, select a beacon, then start a new comment on a command
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.addComment(0, commentText);

		// Go back to Comments tab and verify comment count is still the same
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		cy.get('[cy-test=comment-count]').eq(0).invoke('text').as('updatedCount');

		cy.get('@origCount').then((origCount) => {
			cy.get('@updatedCount').then((updatedCount) => {
				expect(updatedCount).to.eq(origCount);
			});
		});
	});

	it('Pending comment marked as favorite should not appear in Favorites', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Click Comments tab and log starting number of Favorite Comments
		cy.clickCommentsTab();
		cy.get('[cy-test=comment-count]').eq(1).invoke('text').as('origCount');

		// Go to Beacons tab, select a beacon, then start a new comment on a command and mark as Favorite
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.addComment(0, commentText);
		cy.favoriteComment(0);

		// Go back to Comments tab and verify Favorite comment count is still the same
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		cy.get('[cy-test=comment-count]').eq(1).invoke('text').as('updatedCount');

		cy.get('@origCount').then((origCount) => {
			cy.get('@updatedCount').then((updatedCount) => {
				expect(updatedCount).to.eq(origCount);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Reply to  Campaign Comments', () => {
	const camp = 'editComments';
	const fileName = 'gt.redeye';

	// SKIPPING FOR NOW - PENDING BUG FIX (https://jira.pnnl.gov/jira/browse/BLDSTRIKE-544).
	// Per conversations at a weekly meeting, replies are not comments and should not increase comment counts/
	// Count on the main campaign card page still increases when you reply to a comment.
	it('Reply to a comment and verify comment count does not increase', () => {
		cy.uploadCampaign(camp, fileName);
		cy.searchForCampaign(camp);

		// Log the total number of comments showing on the campaign card
		cy.get('[cy-test=comment-count]').then((cardCount1) => {
			const campaignCardCount1 = cardCount1.text().split(' ').shift();
			cy.get('[cy-test=comment-count]').should('contain', campaignCardCount1);

			// Open campaign and verify Presentation mode shows the same number of comments
			cy.selectCampaign(camp);

			cy.clickPresentationMode();

			cy
				.get('[cy-test=all] [cy-test=count]')
				.should('be.visible')
				.invoke('text')
				.then((commentCountAll1) => {
					cy.log(commentCountAll1);
					expect(commentCountAll1).to.eq(campaignCardCount1);

					// Go to Comments tab and verify total there matches
					cy.clickExplorerMode();

					cy.clickCommentsTab();
					cy
						.get('[cy-test=comment-group]')
						.its('length')
						.then((commentsTab1) => {
							expect(+commentsTab1)
								.to.eq(+commentCountAll1)
								.and.to.eq(+campaignCardCount1);

							// Reply to one of the comments
							cy.replyToComment(0, 'Replying to above comment.');
							cy.get('[cy-test=save-comment]').should('be.visible').click();

							// Go back to Presentation mode and verify that the comment count did not change
							cy.clickPresentationMode();

							cy
								.get('[cy-test=all] [cy-test=count]')
								.should('be.visible')
								.invoke('text')
								.then((commentCountAll2) => {
									cy.log(commentCountAll2);
									expect(+commentCountAll2)
										.to.eq(+commentCountAll1)
										.and.to.eq(+campaignCardCount1);

									// Go back to campaign card and verify that the comment count did not change
									cy.returnToCampaignCard();
									cy.searchForCampaign(camp);

									cy.get('[cy-test=comment-count]').then((cardCount2) => {
										const campaignCardCount2 = cardCount2.text().split(' ').shift();
										cy.get('[cy-test=comment-count]').should('contain', campaignCardCount2);

										expect(+campaignCardCount2)
											.to.eq(+campaignCardCount1)
											.and.to.eq(+commentCountAll2);
									});
								});
						});
				});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

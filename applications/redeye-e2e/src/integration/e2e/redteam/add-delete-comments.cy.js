/// <reference types="cypress" />

describe('Add Delete Campaign Comments', () => {
	const camp = 'addDeleteComments';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';
	const comment = 'Another comment';
	const tag = 'testing';

	let count;
	it('Add campaign comments and check counts', () => {
		cy.uploadCampaign(camp, fileName);

		cy
			.get('[cy-test=comment-count]')
			.find('span')
			.then((num) => num.text().split(' ').shift())
			.as('campaignCommentCount');

		//Open campaign and log starting number of comments via Comments tab - should equal campaign card count
		cy.selectCampaign(camp);

		cy.clickCommentsTab();

		cy.wait(1000);

		cy
			.get('[cy-test=comment-group]')
			.its('length')
			.then((num) => parseInt(num))
			.as('commentsTabCount');

		// Log starting number of comments via Presentation Mode - should equal campaign card and Comments tab counts
		cy.clickPresentationMode();

		cy.wait(1000);

		cy
			.get('[cy-test=all] [cy-test=count]')
			.find('span')
			.first()
			.should('be.visible')
			.invoke('text')
			.as('presentationCommentCount');

		cy.get('@campaignCommentCount').then((campaignCommentCount) => {
			cy.get('@commentsTabCount').then((commentsTabCount) => {
				cy.get('@presentationCommentCount').then((presentationCommentCount) => {
					expect(+campaignCommentCount)
						.to.eq(+commentsTabCount)
						.and.to.eq(+presentationCommentCount);
				});
			});
		});

		// 		// Add a new comment
		cy.clickExplorerMode();

		cy.clickCommandTypesTab();

		cy.selectCommandType(cmd);

		cy.addNewComment('0', comment, tag);

		// Log new number of comments via Comments tab - should be 1 more
		cy.clickExplorerMode();

		cy.clickCommentsTab();

		cy.wait(1000);

		cy.get('@commentsTabCount').then((commentsTabCount) => {
			cy
				.get('[cy-test=comment-group]')
				.its('length')
				.then((num) => {
					const commentsTabCount2 = parseInt(num);
					expect(commentsTabCount2).to.eq(commentsTabCount + 1);
				});
		});

		// Log new number of comments via Presentation Mode - should be one more
		cy.clickPresentationMode();

		cy.wait(1000);

		cy.get('@presentationCommentCount').then((presentationCommentCount) => {
			cy
				.get('[cy-test=all] [cy-test=count]')
				.find('span')
				.first()
				.then((num) => {
					const presentationCommentCount2 = num.text();
					expect(+presentationCommentCount2).to.eq(+presentationCommentCount + +'1');
				});
		});

		// Return to campaign menu and log new number of comments - should be one more than original, and all comment counts should match
		cy.returnToCampaignCard();

		cy.wait(1000);

		cy.get('@campaignCommentCount').then((campaignCommentCount) => {
			cy
				.get('[cy-test=comment-count]')
				.find('span')
				.then((num) => {
					const campaignCommentCount2 = num.text();
					expect(+campaignCommentCount2).to.eq(+campaignCommentCount + +'1');
				});
		});
	});

	it('Delete campaign comments and check counts', () => {
		cy
			.get('[cy-test=comment-count]')
			.find('span')
			.invoke('text')
			.then((num) => {
				count = num.split(' ').shift();
			})
			.as('campaignCommentCount');

		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType(cmd);

		cy.deleteComment(0);

		// Log new number of comments via Comments tab - should be 1 less
		cy.clickExplorerMode();

		cy.clickCommentsTab();

		cy.wait(1000);

		cy
			.get('[cy-test=comment-group]')
			.its('length')
			.then((num) => parseInt(num))
			.then((commentsTabCount) => {
				expect(commentsTabCount).to.eq(+count - +'1');
			});

		// Log new number of comments via Presentation Mode - should be one less
		cy.clickPresentationMode();

		cy.wait(1000);

		cy
			.get('[cy-test=all] [cy-test=count]')
			.find('span')
			.first()
			.then((num) => {
				const presentationCommentCount = num.text();
				expect(+presentationCommentCount).to.eq(+count - +'1');
			});

		// Return to campaign menu and log new number of comments - should be one less than original, and all comment counts should match
		cy.returnToCampaignCard();

		cy.wait(1000);

		cy
			.get('[cy-test=comment-count]')
			.find('span')
			.invoke('text')
			.then((newCount) => {
				expect(+newCount).to.eq(+count - +'1');
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

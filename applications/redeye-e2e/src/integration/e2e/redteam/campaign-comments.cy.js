/// <reference types="cypress" />

describe('Campaign comments', () => {
	const camp = 'campaigncomments';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';
	const comment = 'Another comment';
	const editedComment = 'Edited comment text';
	const tag = 'testing';
	const tag1 = 'test_1';
	const tag2 = 'test_2';

	it('Add campaign comments and check counts', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=comment-count]').then((number1) => {
			const divNumber1 = number1.text().split(' ').shift();
			cy.get('[cy-test=comment-count]').should('contain', divNumber1);

			// Open campaign and log starting number of comments via Comments tab - should equal campaign card count
			cy.selectCampaign(camp);

			cy.clickCommentsTab();
			cy
				.get('[cy-test=comment-group]')
				.its('length')
				.then((commentsTab1) => {
					expect(+commentsTab1).to.eq(+divNumber1);

					// Log starting number of comments via Presentation Mode - should equal campaign card and Comments tab counts
					cy.clickPresentationMode();

					cy
						.get('[cy-test=all] [cy-test=count]')
						.should('be.visible')
						.invoke('text')
						.then((commentCountAll1) => {
							// cy.log(commentCountAll1);
							expect(+commentCountAll1).to.eq(+divNumber1);
							expect(+commentCountAll1).to.eq(+commentsTab1);

							// Add a new comment
							cy.clickExplorerMode();

							cy.clickCommandsTypesTab();

							cy.selectCommandType(cmd);

							cy.addNewComment('0', comment, tag);

							// Log new number of comments via Comments tab - should be 1 more
							cy.clickExplorerMode();

							cy.clickCommentsTab();

							cy.wait(1000);
							cy
								.get('[cy-test=comment-group]')
								.its('length')
								.then((commentsTab2) => {
									// cy.log(commentsTab2);
									expect(+commentsTab2).to.eq(+commentsTab1 + +'1');

									// Log new number of comments via Presentation Mode - should be one more
									cy.clickPresentationMode();

									cy
										.get('[cy-test=all] [cy-test=count]')
										.should('be.visible')
										.invoke('text')
										.then((commentCountAll2) => {
											expect(+commentCountAll2).to.eq(+commentCountAll1 + +'1');

											// Return to campaign menu and log new number of comments - should be one more than original, and all comment counts should match
											cy.returnToCampaignCard();

											cy.searchForCampaign(camp);

											cy.get('[cy-test=comment-count]').then((number2) => {
												const divNumber2 = number2.text().split(' ').shift();
												cy.get('[cy-test=comment-count]').should('contain', divNumber2);

												expect(+divNumber2).to.equal(+divNumber1 + +'1');
												expect(+commentsTab2).to.equal(+divNumber2);
												expect(+commentCountAll2).to.equal(+divNumber2);
												expect(+commentsTab2).to.equal(+commentCountAll2);
											});

											cy.get('[cy-test=search]').click().clear();
										});
								});
						});
				});
		});
	});

	it('Delete campaign comments and check counts', () => {
		// Look for campaign and log original comment count on campaign card
		cy.searchForCampaign(camp);

		cy.get('[cy-test=comment-count]').then((number1) => {
			const divNumber1 = number1.text().split(' ').shift();

			// Open campaign and log starting number of comments via Comments tab - should equal campaign card count
			cy.selectCampaign(camp);
			cy.clickCommentsTab();
			cy
				.get('[cy-test=comment-group]')
				.its('length')
				.then((commentsTab1) => {
					// cy.log(commentsTab1);
					expect(+commentsTab1).to.eq(+divNumber1);

					// Log starting number of comments via Presentation Mode - should equal campaign card and Comments tab counts
					cy.clickPresentationMode();

					cy
						.get('[cy-test=all] [cy-test=count]')
						.should('be.visible')
						.invoke('text')
						.then((commentCountAll1) => {
							// cy.log(commentCountAll1);
							expect(+commentCountAll1).to.eq(+divNumber1);
							expect(+commentCountAll1).to.eq(+commentsTab1);

							// Delete comment
							cy.clickExplorerMode();

							cy.clickCommandsTypesTab();

							cy.selectCommandType(cmd);

							cy.deleteComment(0);

							// Log new number of comments via Comments tab - should be 1 less
							cy.clickExplorerMode();

							cy.clickCommentsTab();

							cy.wait(1000);

							cy
								.get('[cy-test=comment-group]')
								.its('length')
								.then((commentsTab2) => {
									// cy.log(commentsTab2);
									expect(+commentsTab2).to.eq(+commentsTab1 - +'1');

									// Log new number of comments via Presentation Mode - should be one less
									cy.clickPresentationMode();

									cy
										.get('[cy-test=all] [cy-test=count]')
										.should('be.visible')
										.invoke('text')
										.then((commentCountAll2) => {
											// cy.log(commentCountAll2);
											expect(+commentCountAll2).to.eq(+commentCountAll1 - +'1');

											// Return to campaign menu and log new number of comments - should be one less than original, and all comment counts should match
											cy.returnToCampaignCard();

											cy.searchForCampaign(camp);

											cy.get('[cy-test=comment-count]').then((number3) => {
												const divNumber3 = number3.text().split(' ').shift();
												cy.get('[cy-test=comment-count]').should('contain', divNumber3);
												// cy.log(divNumber3);
												expect(+divNumber3).to.equal(+divNumber1 - +'1');
												expect(+commentsTab2).to.equal(+divNumber3);
												expect(+commentCountAll2).to.equal(+divNumber3);
												expect(+commentsTab2).to.equal(+commentCountAll2);
											});
										});
								});
							cy.get('[cy-test=search]').click().clear();
						});
				});
		});
	});

	it('Add comment and edit the text afterward', () => {
		// Open the campaign and add a new comment
		cy.selectCampaign(camp);

		cy.clickCommandsTypesTab();

		cy.selectCommandType(cmd);

		cy.addNewComment('0', comment, tag2);

		cy.get('[cy-test=add-comment]').eq(0).scrollIntoView().should('be.visible').click({ force: true });

		cy
			.get('[cy-test=existing-comment-display]')
			.scrollIntoView()
			.should('be.visible')
			.and('contain', comment)
			.and('contain', tag2);

		cy.get('[cy-test=add-comment]').eq(0).click({ force: true });

		// After saving comment, edit the comment text
		cy.get('[cy-test=edit-comment]').eq(0).click();

		cy.get('[cy-test=comment-input]').click().clear().type(editedComment);

		cy.get('[cy-test=save-comment]').click();

		cy.wait('@updateAnnotation');

		// Verify edited text was saved
		cy.get('[cy-test=add-comment]').eq(0).should('be.visible').click({ force: true });

		cy.get('[cy-test=existing-comment-display]').should('be.visible').and('contain', editedComment).and('contain', tag2);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

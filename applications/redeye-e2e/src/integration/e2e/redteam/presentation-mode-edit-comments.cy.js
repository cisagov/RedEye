/// <reference types="cypress" />
let origComment;
let updatedComment;
let startingTags;
let endingTags;

describe('Presentation Mode - Edit Comments', () => {
	const camp = 'editCommentsPresentationMode';
	const fileName = 'gt.redeye';

	it('Can edit a comment in Presentation mode', () => {
		const newComment = 'EDITED COMMENT';

		// Upload and open campaign
		cy.uploadCampaign(camp, fileName);
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Go to 2nd slide (first one contains an uneditable comment type)
		cy.get('[cy-test=next-slide]').click();

		// Log current comment text
		cy.get('[cy-test=comment-text]')
			.invoke('text')
			.then((comment1) => {
				origComment = comment1;
			});

		// Click Edit and modify the comment
		cy.get('[cy-test=edit-comment]').click();
		cy.get('[cy-test=comment-input]').click().clear().type(newComment);
		cy.get('[cy-test=save-comment]').click();

		// Verify new comment text appears in Presentation mode
		cy.get('[cy-test=comment-text]')
			.invoke('text')
			.then((comment2) => {
				updatedComment = comment2;
				expect(updatedComment).to.eq(newComment).and.to.not.eq(origComment);
			});

		// Go to Comments tab and verify that new comment appears on the page
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		cy.get('[cy-test=info-row]').eq(0).click();
		cy.wait(1000);

		const comments = [];
		cy.get('[cy-test=comment-text]').each(($comment) => comments.push($comment.text()));
		cy.wrap(comments).as('allComments').should('contain', newComment);
	});

	it('Cannot edit tags in Presentation mode', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Go to 2nd slide (first one contains an uneditable comment type)
		cy.get('[cy-test=next-slide]').click();

		// Get tag text
		cy.get('[cy-test=tags]')
			.invoke('text')
			.then((tags1) => {
				startingTags = tags1;
			});

		// Click Edit and verify that you cannot edit the tags
		cy.get('[cy-test=edit-comment]').click();
		cy.get('[cy-test=tag-input]').should('not.exist');

		// Click Cancel and verify the tag still appears
		cy.get('[cy-test=cancel-comment]').click();
		cy.get('[cy-test=tags]')
			.invoke('text')
			.then((tags2) => {
				endingTags = tags2;
				expect(endingTags).to.eq(startingTags);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

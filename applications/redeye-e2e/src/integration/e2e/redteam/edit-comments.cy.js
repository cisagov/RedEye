/// <reference types="cypress" />

describe('Edit Campaign Comments', () => {
	const camp = 'editComments';
	const editedComment = 'Edited comment text';
	const fileName = 'gt.redeye';
	const comment = 'commenthere';
	const tag2 = 'test_2';

	it('Add comment and edit the text afterward', () => {
		cy.uploadCampaign(camp, fileName);

		// Open the campaign and add a new comment
		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType('dcsync');

		cy.addNewComment('0', comment, tag2);

		cy.get('[cy-test=add-comment]').eq(0).should('be.visible').click({ force: true });

		cy.get('[cy-test=existing-comment-display]').should('be.visible').should('contain', comment).and('contain', tag2);

		cy.get('[cy-test=add-comment]').eq(0).should('be.visible').click({ force: true });

		// After saving comment, edit the comment text
		cy.editExistingComment(0, editedComment);

		// Verify edited text was saved
		cy.get('[cy-test=add-comment]').eq(0).should('be.visible').click({ force: true });

		cy.get('[cy-test=existing-comment-display]')
			.should('be.visible')
			.and('contain', editedComment)
			.and('contain', tag2);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

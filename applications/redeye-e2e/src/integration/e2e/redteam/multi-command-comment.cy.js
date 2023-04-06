/// <reference types="cypress" />

describe('Multi-Command Comments', () => {
	const camp = 'multicommandcomment';
	const fileName = 'gt.redeye';
	const comment = 'Multi-command comment';
	const tag = 'multi-pass';

	it('Use Multi-Command to comment on 1+ commands; Add comment as a favorite', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign, go to Commands, select command and click multi-command comment
		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType('ps');

		cy.addMultiCommandComment();

		// Select both commands
		cy.get('[type=checkbox]').check({ force: true });

		// Click on "Comment on commands"
		cy.get('[cy-test=comment-on-commands').click();

		// Enter comment and tag and save comment
		cy.favoriteComment(0);
		cy.get('[cy-test=comment-input]').type(comment).type('{enter}');
		cy.addNewTags(tag);
		// cy.get('[cy-test=save-comment]').click();
		// cy.wait(1000);

		// Verify comments are saved
		cy.clickExplorerMode();
		cy.clickCommentsTab();
		cy.get('[cy-test=comments-view]').should('contain', comment).and('contain', tag);
		cy.clickPresentationMode();
		cy.get('[cy-test=favorited]').click();
		cy.get('[cy-test=presentation-root]').should('contain', comment).and('contain', tag);
	});

	it('Add a new command to the comment', () => {
		// Open campaign, open comment previously added, add another command
		cy.selectCampaign(camp);

		cy.clickExplorerMode();

		cy.clickCommandTypesTab();

		cy.selectCommandType('runasadmin');

		cy.addToExistingComment(0, comment);

		// Log starting number of commands
		cy.get('[cy-test=number-commands]').then((number1) => {
			const startingCommands = number1.text().split(' ').shift();
			cy.get('[cy-test=number-commands]').should('contain', startingCommands);
			// cy.log(startingCommands);

			cy.get('[cy-test=add-command-this-comment]').click();
			cy.wait('@addCommandToCommandGroup');
			cy.get('[cy-test=command-added]').should('be.visible');
			// cy.wait(1000);

			// Log new number of commands - should be 1 more than earlier
			cy.get('[cy-test=number-commands]').then((number2) => {
				const updatedCommands = number2.text().split(' ').shift();
				cy.get('[cy-test=number-commands]').should('contain', updatedCommands);
				// cy.log(updatedCommands);
				expect(+updatedCommands).to.equal(+startingCommands + +'1');
			});
		});
		cy.get('[cy-test=done-button]').click();

		// Verify new comment is on the command
		cy.get('[cy-test=add-comment]').eq(0).click({ force: true });
		cy.get('[cy-test=existing-comment-display]').should('contain', comment).and('contain', tag);
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

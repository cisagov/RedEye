/// <reference types="cypress" />

describe('Golden Ticket', () => {
	const camp = 'GTTagOnly';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Willy Wonka';
	const partialTag = 'Golden';

	it('Golden Ticket icon appears when GT tag is used; Presentation Mode reflects the count of Golden Ticket tags', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of Golden Ticket tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy.get('[cy-test=GoldenTicket] [cy-test=count]')
			.invoke('text')
			.as('GTTagCount')
			.then((resultGTCount1) => {
				// Go to Commands, select command, verify Golden Ticket icon is not there
				cy.clickExplorerMode();

				cy.clickCommandTypesTab();

				cy.selectCommandType(cmd);

				cy.get('[cy-test=golden-ticket-icon]').should('not.exist');

				// Add a comment and use the existing Golden Ticket tag
				cy.addComment(0, comment);

				cy.addExistingTags(partialTag);

				// Verify the Golden Ticket icon is now there
				cy.get('[cy-test=golden-ticket-icon]').should('be.visible');

				// Log new number of Golden Ticket comments and compare to original count; verify GT only appears once in list
				cy.clickPresentationMode();

				cy.get('@GTTagCount').then((resultGTCount2) => {
					expect(+resultGTCount2).to.equal(+resultGTCount1 + +'1');

					cy.get('[cy-test=GoldenTicket]').should('have.length', 1);
				});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

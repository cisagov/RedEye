/// <reference types="cypress" />

describe('Testing of Adding Golden Ticket & Lateral Movement Tags', () => {
	const camp = 'GTLMTags';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Willy Wonka';
	const partialTag1 = 'Golden';
	const partialTag2 = 'Lateral';

	it('Golden Ticket and Lateral Movement icons appear when tags used on comment; Presentation Mode shows count of each tag', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of applicable tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();
		cy.get('[cy-test=tag-GoldenTicket] [cy-test=count]')
			.invoke('text')
			.as('GTTagCount')
			.then((resultGTCount1) => {
				// cy.log(resultGTCount1);
				cy.get('[cy-test=tag-LateralMovement] [cy-test=count]')
					.invoke('text')
					.as('LMTagCount')
					.then((resultLMCount1) => {
						// Go to Commands, select command, verify icons are not there
						cy.clickExplorerMode();

						cy.clickCommandTypesTab();

						cy.selectCommandType(cmd);

						cy.goldenTicketIcon().should('not.exist');
						cy.lateralMovementIcon().should('not.exist');

						// Add a comment and use the applicable tags
						cy.addComment(0, comment);

						cy.addExistingTags(partialTag1, partialTag2);

						// Verify the apporpriate icons are now there
						cy.goldenTicketIcon().should('be.visible');
						cy.lateralMovementIcon().should('be.visible');

						// Log new number of applicable comments and compare to original count
						cy.clickPresentationMode();

						cy.get('@GTTagCount').then((resultGTCount2) => {
							expect(+resultGTCount2).to.equal(+resultGTCount1 + +'1');
							cy.get('@LMTagCount').then((resultLMCount2) => {
								expect(+resultLMCount2).to.equal(+resultLMCount1 + +'1');

								cy.get('[cy-test=tag-GoldenTicket]').should('have.length', 1);
								cy.get('[cy-test=tag-LateralMovement]').should('have.length', 1);
							});
						});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Testing of Adding Golden Ticket & Privilege Escalation Tags', () => {
	const camp = 'GTPETags';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Willy Wonka';
	const partialTag1 = 'Golden';
	const partialTag2 = 'Privilege';

	it('Golden Ticket and Privilege Escalation icons appear when tags used on comment; Presentation Mode shows count of each tag', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of applicable tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy.get('[cy-test=GoldenTicket] [cy-test=count]')
			.invoke('text')
			.as('GTTagCount')
			.then((resultGTCount1) => {
				cy.get('[cy-test=PrivilegeEscalation] [cy-test=count]')
					.invoke('text')
					.as('PETagCount')
					.then((resultPECount1) => {
						// Go to Commands, select command, verify icons are not there
						cy.clickExplorerMode();

						cy.clickCommandTypesTab();

						cy.selectCommandType(cmd);

						cy.get('[cy-test=GoldenTicket]').should('not.exist');
						cy.get('[cy-test=PrivilegeEscalation]').should('not.exist');

						// Add a comment and use the applicable tags
						cy.addComment(0, comment);
						cy.addExistingTags(partialTag1, partialTag2);

						// Verify the apporpriate icons are now there
						cy.get('[cy-test=GoldenTicket]').should('be.visible');
						cy.get('[cy-test=PrivilegeEscalation]').should('be.visible');

						// Log new number of applicable comments and compare to original count
						cy.clickPresentationMode();

						cy.get('@GTTagCount').then((resultGTCount2) => {
							expect(+resultGTCount2).to.equal(+resultGTCount1 + +'1');
							cy.get('@PETagCount').then((resultPECount2) => {
								expect(+resultPECount2).to.equal(+resultPECount1 + +'1');

								cy.get('[cy-test=GoldenTicket]').should('have.length', 1);
								cy.get('[cy-test=PrivilegeEscalation]').should('have.length', 1);
							});
						});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

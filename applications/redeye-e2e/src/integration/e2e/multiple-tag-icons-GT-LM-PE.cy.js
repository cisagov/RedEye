/// <reference types="cypress" />

describe('Testing of Adding Golden Ticket, Privilege Escalation & Lateral Movement Tags', () => {
	const camp = 'GTPELMTags';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Willy Wonka';
	const partialTag1 = 'Golden';
	const existingTag1 = '#GoldenTicket';
	const partialTag2 = 'Lateral';
	const existingTag2 = '#LateralMovement';
	const partialTag3 = 'Privilege';
	const existingTag3 = '#PrivilegeEscalation';

	it('Golden Ticket, Lateral Movement, and Privilege Escalation icons appear when tags used on comment; Presentation Mode shows count of each tag', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of applicable tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy
			.get('[cy-test=GoldenTicket] [cy-test=count]')
			.invoke('text')
			.then((resultGTCount1) => {
				cy
					.get('[cy-test=LateralMovement] [cy-test=count]')
					.invoke('text')
					.then((resultLMCount1) => {
						cy
							.get('[cy-test=PrivilegeEscalation] [cy-test=count]')
							.invoke('text')
							.then((resultPECount1) => {
								//  Go to Commands, select command, verify icons are not there
								cy.clickExplorerMode();

								cy.clickCommandsTypesTab();

								cy.selectCommandType(cmd);
								cy.get('[cy-test=GoldenTicket]').should('not.exist');
								cy.get('[cy-test=LateralMovement]').should('not.exist');
								cy.get('[cy-test=PrivilegeEscalation]').should('not.exist');

								// Add a comment and use the applicable tags
								cy.addComment(0, comment);
								cy.addExistingTags(partialTag1, partialTag2, partialTag3);

								// Verify the apporpriate icons are now there
								cy.get('[cy-test=GoldenTicket]').should('be.visible');
								cy.get('[cy-test=LateralMovement]').should('be.visible');
								cy.get('[cy-test=PrivilegeEscalation]').should('be.visible');

								// Log new number of applicable comments and compare to original count
								cy.clickPresentationMode();

								cy
									.get('[cy-test=GoldenTicket] [cy-test=count]')
									.should('be.visible')
									.invoke('text')
									.then((resultGTCount2) => {
										expect(+resultGTCount2).to.equal(+resultGTCount1 + +'1');
										cy
											.get('[cy-test=LateralMovement] [cy-test=count]')
											.invoke('text')
											.then((resultLMCount2) => {
												expect(+resultLMCount2).to.equal(+resultLMCount1 + +'1');
												cy
													.get('[cy-test=PrivilegeEscalation] [cy-test=count]')
													.invoke('text')
													.then((resultPECount2) => {
														expect(+resultPECount2).to.equal(+resultPECount1 + +'1');

														cy.get('[cy-test=GoldenTicket]').should('have.length', 1);
														cy.get('[cy-test=LateralMovement]').should('have.length', 1);
														cy.get('[cy-test=PrivilegeEscalation]').should('have.length', 1);
													});
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

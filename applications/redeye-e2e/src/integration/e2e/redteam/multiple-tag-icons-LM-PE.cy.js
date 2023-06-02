/// <reference types="cypress" />

describe('Testing of Adding Privilege Escalation & Lateral Movement Tags', () => {
	const camp = 'PELMTags';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Willy Wonka';
	const partialTag1 = 'Lateral';
	const existingTag1 = '#LateralMovement';
	const partialTag2 = 'Privilege';
	const existingTag2 = '#PrivilegeEscalation';

	it('Lateral Movement and Privilege Escalation icons appear when tags used in comment; Presentation Mode shows count of each tag', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of applicable tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy.get('[cy-test=tag-LateralMovement] [cy-test=count]')
			.invoke('text')
			.as('LMTagCount')
			.then((resultLMCount1) => {
				cy.get('[cy-test=tag-PrivilegeEscalation] [cy-test=count]')
					.invoke('text')
					.as('PETagCount')
					.then((resultPECount1) => {
						// Go to Commands, select command, verify icons are not there
						cy.clickExplorerMode();

						cy.clickCommandTypesTab();

						cy.selectCommandType(cmd);

						cy.lateralMovementIcon().should('not.exist');
						cy.privilegeEscalationIcon().should('not.exist');

						// Add a comment and use the applicable tags
						cy.addComment(0, comment);
						cy.addExistingTags(partialTag1, partialTag2);

						// Verify the apporpriate icons are now there
						cy.lateralMovementIcon().should('be.visible');
						cy.privilegeEscalationIcon().should('be.visible');

						// Log new number of applicable comments and compare to original count
						cy.clickPresentationMode();

						cy.get('@LMTagCount').then((resultLMCount2) => {
							expect(+resultLMCount2).to.equal(+resultLMCount1 + +'1');
							cy.get('@PETagCount').then((resultPECount2) => {
								expect(+resultPECount2).to.equal(+resultPECount1 + +'1');

								cy.get('[cy-test=tag-LateralMovement]').should('have.length', 1);
								cy.get('[cy-test=tag-PrivilegeEscalation]').should('have.length', 1);
							});
						});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Lateral Movement', () => {
	const camp = 'LMTagOnly';
	const fileName = 'gt.redeye';
	const cmd = 'keylogger';
	const comment = 'Shake it to the left';
	const partialTag = 'Lateral';
	const existingTag = '#LateralMovement';

	it('Lateral Movement tag appears when LM tag is used; Presentation Mode reflects the count of LM tags', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and log current number of Lateral Movement tags
		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy
			.get('[cy-test=LateralMovement] [cy-test=count]')
			.invoke('text')
			.then((resultLMCount1) => {
				//  Go to Commands, select command, verify Lateral Movement icon is not there
				cy.clickExplorerMode();

				cy.clickCommandTypesTab();

				cy.selectCommandType(cmd);

				cy.get('[cy-test=LateralMovement]').should('not.exist');

				// Add a comment and use the existing Lateral Movement tag
				cy.addComment(0, comment);

				cy.addExistingTags(partialTag);

				// Verify the Lateral Movement icon is now there
				cy.get('[cy-test=LateralMovement]').should('be.visible');

				// Log new number of Lateral Movement comments and compare to original count; verify LM only appears once in list
				cy.clickPresentationMode();

				cy
					.get('[cy-test=LateralMovement] [cy-test=count]')
					.invoke('text')
					.then((resultLMCount2) => {
						// cy.log(resultLMCount2);
						expect(+resultLMCount2).to.equal(+resultLMCount1 + +'1');

						cy.get('[cy-test=LateralMovement]').should('have.length', 1);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Mitre attack tests', () => {
	const camp = 'mitreattack';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';

	it('Verify mitre attack link includes name of mitre attack', () => {
		// cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType(cmd);

		cy.get('[cy-test=expand]').eq(1).click();

		cy.get('[cy-test=mitre-attack-link]')
			.then(($el) => {
				return Cypress._.map($el, 'innerText');
			})
			.should('deep.equal', ['T1003: OS Credential Dumping', 'T1093: Process Hollowing']);
	});

	// after(() => {
	// 	cy.deleteCampaignGraphQL(camp);
	// });
});

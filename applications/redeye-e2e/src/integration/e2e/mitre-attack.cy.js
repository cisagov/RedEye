/// <reference types="cypress" />

describe('Mitre attack tests', () => {
	const camp = 'mitreattack';
	const fileName = 'gt.redeye';
	const cmd = 'dcsync';

	it('Verify mitre attack link includes name of mitre attack', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickCommandTypesTab();

		cy.selectCommandType(cmd);

		cy.get('[cy-test=expand]').eq(1).click();

		cy
			.get('[cy-test=mitre-attack-link]')
			.eq(0)
			.invoke('text')
			.then((mitre1) => {
				cy.get('[cy-test=mitre-attack-link]').eq(0).should('have.attr', 'href').and('include', mitre1);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Testing Graph Behavior on Presentation Mode', () => {
	const camp = 'presentationgraph';
	const fileName = 'gt.redeye';

	it('Navigate to Presentation Mode and Use Graph', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy.get('[cy-test=tag-PrivilegeEscalation]').click();

		cy.get('[cy-test=graph-legend]').click();

		cy.get('[cy-test=legend-box]').should('be.visible');

		//ZOOM IN
		cy.get('[cy-test=zoom-in]').click().click().click().click();

		//ZOOM OUT
		cy.get('[cy-test=zoom-out]').click().click().click().click();

		//RECENTER THE GRAPH
		cy.get('[cy-test=center-graph]').click();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

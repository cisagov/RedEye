/// <reference types="cypress" />

describe('Testing Graph Behavior on Presentation Mode', () => {
	const camp = 'presentationgraph';
	const fileName = 'gt.redeye';

	it('Navigate to Presentation Mode and Use Graph', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickPresentationMode();

		cy.get('[cy-test=PrivilegeEscalation]').realClick();

		cy.get('[cy-test=graph-legend]').realClick();

		cy.get('[cy-test=legend-box]').should('be.visible');

		//ZOOM IN
		cy.get('[cy-test=zoom-in]').realClick().realClick().realClick().realClick();

		//ZOOM OUT
		cy.get('[cy-test=zoom-out]').realClick().realClick().realClick().realClick();

		//RECENTER THE GRAPH
		cy.get('[cy-test=center-graph]').realClick();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

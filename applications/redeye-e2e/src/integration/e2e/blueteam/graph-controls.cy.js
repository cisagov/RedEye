/// <reference types="cypress" />

describe('Zoom in/ Zoom Out Graph', () => {
	const camp = 'graphcontrols';
	const fileName = 'gt.redeye';

	it('Click on the different graph controls', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.get('[cy-test=graph-legend]').realClick();

		cy.get('[cy-test=legend-box]').should('be.visible');

		//ZOOM IN
		cy.get('[cy-test=zoom-in]').realClick().realClick().realClick().realClick();

		//ZOOM OUT
		cy.get('[cy-test=zoom-out]').realClick().realClick().realClick().realClick();

		//RECENTER THE GRAPH
		cy.get('[cy-test=center-graph]').realClick();

		//VERIFY GRAPH STILL VISIBLE
		cy.get('.superGraph').should('be.visible');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

/// <reference types="cypress" />

describe('Zoom in/ Zoom Out Graph', () => {
	const camp = 'graphcontrols';
	const fileName = 'gt.redeye';

	it('Click on the different graph controls', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.get('[cy-test=graph-legend]').click();

		cy.get('[cy-test=legend-box]').should('be.visible');

		//ZOOM IN
		cy.get('[cy-test=zoom-in]').click().click().click().click();

		//ZOOM OUT
		cy.get('[cy-test=zoom-out]').click().click().click().click();

		//RECENTER THE GRAPH
		cy.get('[cy-test=center-graph]').click();

		//VERIFY GRAPH STILL VISIBLE
		cy.get('.superGraph').should('be.visible');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

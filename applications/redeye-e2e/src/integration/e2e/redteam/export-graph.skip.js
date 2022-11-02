/// <reference types="cypress" />

describe('Export graph', () => {
	const camp = 'exportgraph';
	const fileName = 'gt.redeye';

	it('Verify a file is generated when the graph is exported', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for campaign and open to view the graph
		cy.searchForCampaign(camp);
		cy.selectCampaign(camp);

		// Click the export button
		cy.get('[cy-test=export-graph]').click();
		// cy.verifyDownload('cypress\\Downlaods\\graph.png').should('exist');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

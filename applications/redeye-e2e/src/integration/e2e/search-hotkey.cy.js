/// <reference types="cypress" />

describe('Control/CMD K should bring up search modal', () => {
	const camp = 'searchhotkey';
	const fileName = 'gt.redeye';

	it('Search, close search, re-open - should see same results', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.get('body').type('{meta}k');

		cy.get('body').type('{ctrl}k');

		cy.get('[cy-test=search-modal]').should('be.visible');

		// Enter search term
		cy.searchCampaignFor('exit');

		cy.get('[cy-test=results]').should('contain', '5 results');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

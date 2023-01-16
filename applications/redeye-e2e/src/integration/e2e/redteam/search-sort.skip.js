// <reference types="cypress" />

describe('Search campaign and sort results', () => {
	const camp = 'searchsort';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'copy';
	//  Chose this term because it has 4 results, all of which are different types - makes it easy to verify the order of each sort option

	it('Search and sort by Name', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Sort by NAME descending
		cy.get('[cy-test=sort-search]').click();
		cy.get('[cy-test=Name]').click();
		cy.wait(500);

		// Verify list order
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Command');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Beacon');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Server');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Host');

		// Sort by NAME ascending
		cy.get('[cy-test=sort-order]').click();
		cy.wait(500);

		// Verify list order
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Host');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Server');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Beacon');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Command');
	});

	it('Search and sort by Type', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Sort by TYPE descending
		cy.get('[cy-test=sort-search]').click();
		cy.get('[cy-test=Type]').click();
		cy.wait(500);

		// Verify list order
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Server');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Host');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Command');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Beacon');

		// Sort by TYPE ascending
		cy.get('[cy-test=sort-order]').click();
		cy.wait(500);

		// Verify list order
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Beacon');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Command');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Host');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Server');
	});

	it('Search and sort by Relevance', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);
		cy.wait(500);

		// Verify list order - RELEVANCE descending = default
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Host');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Server');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Beacon');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Command');

		// Sort by RELEVANCE ascending
		cy.get('[cy-test=sort-order]').click();
		cy.wait(500);

		// Verify list order
		cy.get('[cy-test=search-result-item]').eq(0).should('contain', 'Command');
		cy.get('[cy-test=search-result-item]').eq(1).should('contain', 'Beacon');
		cy.get('[cy-test=search-result-item]').eq(2).should('contain', 'Server');
		cy.get('[cy-test=search-result-item]').eq(3).should('contain', 'Host');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

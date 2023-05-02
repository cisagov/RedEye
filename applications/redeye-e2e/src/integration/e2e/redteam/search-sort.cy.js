// <reference types="cypress" />

describe('Search campaign and sort results', () => {
	const camp = 'searchsort';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'TestData';

	it('Search and sort by Name', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Sort by NAME descending
		cy.sortSearchResults();
		cy.sortByName();
		cy.wait(500);

		// Verify list order
		cy.searchResultContains(0, 'Beacon');
		cy.searchResultContains(1, 'Server');
		cy.searchResultContains(2, 'Host');

		// Sort by NAME ascending
		cy.get('[cy-test=sort-order]').realClick();
		cy.wait(500);

		// Verify list order
		cy.searchResultContains(0, 'Host');
		cy.searchResultContains(1, 'Server');
		cy.searchResultContains(2, 'Beacon');
	});

	it('Search and sort by Type', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Sort by TYPE descending
		cy.sortSearchResults();
		cy.sortByType();
		cy.wait(500);

		// Verify list order
		cy.searchResultContains(0, 'Server');
		cy.searchResultContains(1, 'Host');
		cy.searchResultContains(2, 'Beacon');

		// Sort by TYPE ascending
		cy.get('[cy-test=sort-order]').realClick();
		cy.wait(500);

		// Verify list order
		cy.searchResultContains(0, 'Beacon');
		cy.searchResultContains(1, 'Host');
		cy.searchResultContains(2, 'Server');
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
		cy.searchResultContains(0, 'Host');
		cy.searchResultContains(1, 'Server');
		cy.searchResultContains(2, 'Beacon');

		// Sort by RELEVANCE ascending
		cy.get('[cy-test=sort-order]').realClick();
		cy.wait(500);

		// Verify list order
		cy.searchResultContains(0, 'Beacon');
		cy.searchResultContains(1, 'Server');
		cy.searchResultContains(2, 'Host');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

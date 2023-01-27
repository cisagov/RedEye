// <reference types="cypress" />

describe('Search campaign and verify total results match count', () => {
	const camp = 'searchresults';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'exit';

	it('Verify search result count', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		//Click Search
		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		// Log summarized number of results near top
		cy
			.get('[cy-test=results]')
			.invoke('text')
			.then((text) => {
				let resultText = text.split(' ')[0];
				// cy.log(resultText);

				// Verify number of results returned matches what shows at the top
				cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

				// Log total number of results
				cy
					.get('@list')
					.its('length')
					.then((resultSearch1) => {
						// cy.log(resultSearch1);
						expect(resultSearch1).to.eq(+resultText);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

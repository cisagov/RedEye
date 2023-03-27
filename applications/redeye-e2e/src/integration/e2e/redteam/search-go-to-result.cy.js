/// <reference types="cypress" />
let first;

describe('Search campaign and open one of the results', () => {
	const camp = 'searchcampaign';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'exit';

	it('Search, close search, re-open - should see same results', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Log total number of results
		cy.get('@list')
			.its('length')
			.then((resultSearch1) => {
				first = resultSearch1;
			});

		// Close search box
		cy.closeSearch();

		// Re-open search box; verify same results are showing
		cy.clickSearch();

		cy.get('[cy-test=search]').invoke('attr', 'value').should('include', searchTerm1);

		cy.get('@list').should('contain', searchTerm1);

		cy.get('@list')
			.its('length')
			.then((resultSearch2) => {
				expect(resultSearch2).to.equal(first);
			});
	});

	it('Click search result to view details', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Filter on Commands only
		cy.filterSearchResults();
		cy.filterToCommands();

		// Log text showing in the first result
		// line 1 - first part
		cy.get('[cy-test=search-result-item]')
			.eq(0)
			.invoke('text')
			.then((text) => {
				let lineOneText1 = text.split('/')[0];
				cy.log(lineOneText1);

				// line 1 - second part
				cy.get('[cy-test=search-result-item]')
					.eq(0)
					.invoke('text')
					.then((text) => {
						let lineOneText2 = text.split('/')[1];
						cy.log(lineOneText2);

						// line 1- third part
						cy.get('[cy-test=search-result-item]')
							.eq(0)
							.invoke('text')
							.then((text) => {
								let lineOneText3 = text.split('/')[2];
								cy.log(lineOneText3);

								// Log the text details for the Command
								cy.get('[cy-test=search-item-details]')
									.eq(0)
									.invoke('text')
									.then((commandDetails) => {
										cy.log(commandDetails);

										// Select first item from the search results and click to open details; verify against data in search modal
										cy.get('[cy-test=search-result-item]').eq(0).click();
										cy.get('[cy-test=navigation-breadcrumbs]')
											.invoke('text')
											.should('contain', lineOneText1)
											.and('contain', lineOneText2);
										cy.get('[cy-test=beacon-username]').invoke('text').should('contain', lineOneText3);
										cy.get('[cy-test=info-row]').last().invoke('text').should('contain', searchTerm1);
										cy.get('[cy-test=log-details]').last().invoke('text').should('contain', commandDetails);
									});
							});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

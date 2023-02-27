/// <reference types="cypress" />

describe('Search campaign and filter results', () => {
	const camp = 'searchfilter';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'SYSTEM';
	const searchTerm2 = 'Dataset';

	it('Search and filter by Beacons and Commands', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		//Click Search
		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm1);

		// Log total number of results
		cy
			.get('@list')
			.its('length')
			.then((totalResults) => {
				// cy.log(totalResults);

				// Filter to Beacons
				cy.filterSearchResults();
				cy.filterToBeacons();

				// Log filtered results and compare to original
				cy
					.get('@list')
					.its('length')
					.then((beaconsFilter) => {
						// cy.log(beaconsFilter);
						expect(beaconsFilter).to.be.lt(totalResults);

						// Change filter to Commands
						cy.filterSearchResults();
						cy.filterToCommands();

						cy.wait(500);
						// Log filtered results and compare to original
						cy
							.get('@list')
							.its('length')
							.then((commandsFilter) => {
								// cy.log(commandsFilter);
								expect(commandsFilter).to.be.lt(totalResults);
								expect(beaconsFilter + commandsFilter).to.equal(totalResults);
							});
					});
			});
	});

	it('Search and filter by Host, Server and Beacon', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm2);

		cy.get('[cy-test=search-result-item]').as('list').should('have.length.gt', 0).and('contain', searchTerm2);

		// Log total number of results
		cy
			.get('@list')
			.its('length')
			.then((totalResults) => {
				// cy.log(totalResults);

				// Filter to Host
				cy.filterSearchResults();
				cy.filterToHosts();

				// Log filtered results and compare to original
				cy
					.get('@list')
					.its('length')
					.then((hostFilter) => {
						// cy.log(hostFilter);
						expect(hostFilter).to.be.lt(totalResults);

						// Change filter to Server
						cy.filterSearchResults();
						cy.filterToServers();

						// Log filtered results and compare to original
						cy
							.get('@list')
							.its('length')
							.then((serverFilter) => {
								// cy.log(serverFilter);
								expect(serverFilter).to.be.lt(totalResults);

								// Change filter to Beacon
								cy.filterSearchResults();
								cy.filterToBeacons();

								// Log filtered results and compare to original
								cy
									.get('@list')
									.its('length')
									.then((beaconsFilter) => {
										// cy.log(beaconsFilter);
										expect(beaconsFilter).to.be.lt(totalResults);
									});
							});
					});
			});
	});

	it('Choose filter, then enter search term', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Set filter to Beacons
		cy.filterSearchResults();
		cy.filterToBeacons();
		cy.get('[cy-test=search-result-item]').should('not.exist');

		// Enter search term and log number of results
		cy.searchCampaignFor(searchTerm2);

		cy
			.get('[cy-test=search-result-item]')
			.as('list')
			.should('have.length.gt', 0)
			.and('contain', searchTerm2)
			.and('contain', 'Beacon');

		cy
			.get('@list')
			.its('length')
			.then((beaconsFilter) => {
				// Remove filter, verify more items appear
				cy.removeFilter();
				cy
					.get('[cy-test=search-result-item]')
					.its('length')
					.then((totalResults) => {
						expect(totalResults).to.be.gt(beaconsFilter);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

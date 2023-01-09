// <reference types="cypress" />

describe('Search campaign and filter results', () => {
	const camp = 'searchfilter';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'SYSTEM';
	const searchTerm2 = 'Dataset';

	it('Search and filter by Beacons and Commands', () => {
		cy.uploadCampaignBlue(camp, fileName);

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
			.then((resultSearch1) => {
				// cy.log(resultSearch1);

				// Filter to Beacons
				cy.get('[cy-test=filter-search]').click();
				cy.get('[cy-test=Beacons]').click();

				// Log filtered results and compare to original
				cy
					.get('@list')
					.its('length')
					.then((resultSearch2) => {
						// cy.log(resultSearch2);
						expect(resultSearch2).to.be.lt(resultSearch1);

						// Change filter to Commands
						cy.get('[cy-test=filter-search]').click();
						cy.get('[cy-test=Commands]').click();

						cy.wait(500);
						// Log filtered results and compare to original
						cy
							.get('@list')
							.its('length')
							.then((resultSearch3) => {
								// cy.log(resultSearch3);
								expect(resultSearch3).to.be.lt(resultSearch1);
								expect(resultSearch2 + resultSearch3).to.equal(resultSearch1);
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
			.then((resultSearch1) => {
				// cy.log(resultSearch1);

				// Filter to Host
				cy.get('[cy-test=filter-search]').click();
				cy.get('[cy-test=Hosts]').click();

				// Log filtered results and compare to original
				cy
					.get('@list')
					.its('length')
					.then((resultSearch2) => {
						// cy.log(resultSearch2);
						expect(resultSearch2).to.be.lt(resultSearch1);

						// Change filter to Server
						cy.get('[cy-test=filter-search]').click();
						cy.get('[cy-test=Teamservers]').click();

						// Log filtered results and compare to original
						cy
							.get('@list')
							.its('length')
							.then((resultSearch3) => {
								// cy.log(resultSearch3);
								expect(resultSearch3).to.be.lt(resultSearch1);

								// Change filter to Beacon
								cy.get('[cy-test=filter-search]').click();
								cy.get('[cy-test=Beacons]').click();

								// Log filtered results and compare to original
								cy
									.get('@list')
									.its('length')
									.then((resultSearch4) => {
										// cy.log(resultSearch4);
										expect(resultSearch4).to.be.lt(resultSearch1);

										// Log filtered results and compare to original
										cy
											.get('@list')
											.its('length')
											.then((resultSearch5) => {
												// cy.log(resultSearch5);
												expect(resultSearch5).to.be.lt(resultSearch1);
											});
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
		cy.get('[cy-test=filter-search]').click();
		cy.get('[cy-test=Beacons]').click();
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
			.then((count1) => {
				// Remove filter, verify more items appear
				cy.get('[cy-test=remove-filter]').click();
				cy
					.get('[cy-test=search-result-item]')
					.its('length')
					.then((count2) => {
						expect(count2).to.be.gt(count1);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

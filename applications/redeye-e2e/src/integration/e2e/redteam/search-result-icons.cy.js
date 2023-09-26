/// <reference types="cypress" />
let expectedResults;
let actualResults;

describe('Verify icons and navigation in Search results', () => {
	const camp = 'searchresulticons';
	const fileName = 'gt.redeye';
	const searchTerm1 = 'exit';
	const searchTerm2 = 'COMPUTER0';

	it('Verify Command icon in search results', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm1);

		// Filter to Command Type only
		cy.filterSearchResults();
		cy.filterToCommandType();

		// Get count of expected commands related to Command Type
		cy.get('[cy-test=command-count]')
			.invoke('text')
			.then((expected) => {
				expectedResults = expected;
			});

		// Click Commands
		cy.get('[cy-test=command-count]').click();

		// Verify count matches
		cy.get('[cy-test=info-row]')
			.its('length')
			.then((actual) => {
				actualResults = actual;
				expect(+actualResults).to.eq(+expectedResults);
			});
	});

	it('Verify Beacon icon in search results', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm2);

		// Filter to Hosts only
		cy.filterSearchResults();
		cy.filterToHosts();

		// Get count of expected beacons related to first Host
		cy.get('[cy-test=beacon-count]')
			.eq(0)
			.invoke('text')
			.then((expected) => {
				expectedResults = expected;
			});

		// Click Beacons
		cy.get('[cy-test=beacon-count]').eq(0).click();

		// Verify count matches
		cy.clickBeaconsTab();
		cy.get('[cy-test=info-row]')
			.its('length')
			.then((actual) => {
				actualResults = actual;
				expect(+actualResults).to.eq(+expectedResults);
			});
	});

	it('Verify Comment icon in search results', () => {
		// Open campaign and go to Search page
		cy.selectCampaign(camp);

		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor(searchTerm2);

		// Filter to Hosts only
		cy.filterSearchResults();
		cy.filterToHosts();

		// Get count of expected comments related to first Host
		cy.get('[cy-test=comment-count]')
			.eq(0)
			.invoke('text')
			.then((expected) => {
				expectedResults = expected;
			});

		// Click Comments
		cy.get('[cy-test=comment-count]').eq(0).click();

		// Verify count matches
		cy.clickCommentsTabWithinTab();
		cy.get('[cy-test=info-row]')
			.its('length')
			.then((actual) => {
				actualResults = actual;
				expect(+actualResults).to.eq(+expectedResults);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

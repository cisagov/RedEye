/// <reference types="cypress" />

// PENDING BUG FIX - https://jira.pnnl.gov/jira/browse/BLDSTRIKE-529

describe('Beacon counts', () => {
	const camp = 'beaconcounts';
	const fileName = 'gt.redeye';

	it('Verify beacon counts on front page against number of beacons in campaign', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=beacon-count]').then((number1) => {
			const beaconTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=beacon-count]').should('contain', beaconTotal);

			// Open campaign and log command counts showing under Host tab
			cy.selectCampaign(camp);
			cy.clickBeaconsTab();
			cy
				.get('[cy-test=beacons-row]')
				.its('length')
				.then((countBeaconRows) => {
					cy.log(countBeaconRows);

					expect(+countBeaconRows).to.eq(+beaconTotal);
				});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});

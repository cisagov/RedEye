/// <reference types="cypress" />

describe('Links on Details tab', () => {
	const camp = 'detailstablinks';
	const fileName = 'gt.redeye';

	it('Beacon details links redirect to correct location', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name; go to Beacons tab
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();

		// Select first beacon; go to Details tab
		cy.get('[cy-test=beacons-row]').eq(0).click();
		cy.clickDetailsTab();

		// Log location name under Links
		cy.get('[cy-test=meta-link]')
			.eq(0)
			.as('metaLink')
			.invoke('text')
			.then((metaLink) => {
				// Click on location under Links
				cy.get('@metaLink').click();

				// Verify link went to the correct location
				cy.get('[cy-test=panel-header]')
					.invoke('text')
					.then((linkLocation) => {
						expect(linkLocation).to.eq(metaLink);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
